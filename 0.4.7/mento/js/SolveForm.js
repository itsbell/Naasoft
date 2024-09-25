import { CompositeWindow } from "../../js/Window.js";
import { MenteeCard } from "../../js/Mentee.js";
import { PlayShelf } from "../../js/Play.js";
import { FeedbackList, Feedback } from "../../js/Feedback.js";
import { AnswerCard, Answer } from "../../js/Answer.js";
import { BookmarkCard } from "../../js/Bookmark.js";
import { MentoCard } from "../../js/Mento.js";
import { PhpRequestor } from "../../js/PhpRequestor.js";
import { IndexedDB } from "../../js/IndexedDB.js";
import { DateTime } from "../../js/DateTime.js";
import { ProblemView } from "./ProblemView.js";
import { SolutionView } from "./SolutionView.js";
import { FeedbackView } from "./FeedbackView.js";
import { QnaView } from "./QnaView.js";
import { PlayForm } from "./PlayForm.js";
import { IndexForm } from "../../js/IndexForm.js";

export class SolveForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
        this.isFeedbackSubmitted = false;
        this.isAnswerSubmitted = false;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["MENTOSOLVEFORM"] === undefined) {
            window.top.forms["MENTOSOLVEFORM"] = new SolveForm("MENTOSOLVEFORM");
        }
        return window.top.forms["MENTOSOLVEFORM"];
    }

    async SubmitFeedback(evaluate, content) {
        if (this.isFeedbackSubmitted === false) {

            const requestor = new PhpRequestor();
            const playForm = PlayForm.GetInstance();
            const menteeCard = MenteeCard.GetInstance();
            const playShelf = PlayShelf.GetInstance();
            const mentoCard = MentoCard.GetInstance();

            // 1. indexedDB를 연다.
            const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
            await indexedDB.Open();

            playForm.Element.className = "waiting";
            this.element.className = "waiting";

            // 2. 피드백 책에 추가한다.
            const playCase = playShelf.GetAt(playShelf.current);
            const applyCard = playCase.applyCard;
            const problemList = playCase.GetAt(0);
            const problem = problemList.GetAt(problemList.current);
            const solutionBook = playCase.GetAt(1);
            const solutionList = solutionBook.GetAt(solutionBook.current);
            const solution = solutionList.GetAt(solutionList.current);
            const feedbackBook = playCase.GetAt(2);

            const emailAddress = menteeCard.emailAddress;
            const courseName = applyCard.courseName;
            const stepNumber = applyCard.stepNumber;
            const chapterNumber = problem.chapterNumber;
            const problemNumber = problem.number;
            const solutionNumber = solution.number;
            const mentoEmailAddress = mentoCard.emailAddress;

            let feedbackList = null;
            let index = feedbackBook.Find(chapterNumber, problemNumber, solutionNumber);
            if (index == -1) {
                feedbackList = new FeedbackList(problem, solution);
                index = feedbackBook.Add(feedbackList);
            }
            feedbackBook.Move(index);
            feedbackList = feedbackBook.GetAt(feedbackBook.current);

            let feedback = new Feedback(null, content, evaluate);
            index = feedbackList.Add(feedback);
            feedback = feedbackList.GetAt(index);

            // 4. 서버에 피드백 추가를 요청한다.
            let body = `mentoEmailAddress=${mentoEmailAddress}&menteeEmailAddress=${emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}&chapterNumber=${chapterNumber}&problemNumber=${problemNumber}&solutionNumber=${solutionNumber}&evaluate=${feedback.evaluate}&content=${encodeURIComponent(feedback.content)}`;
            let response = await requestor.PostJson("../../php/InsertFeedback.php", body);

            this.isFeedbackSubmitted = true;

            // 3. indexedDB에 놀이 책장을 저장한다.
            let time = new DateTime(response.time);
            feedbackList.Correct(index, time);

            indexedDB.Put("PlayShelf", playShelf);

            // 5. 피드백 항목을 추가한다.
            index = this.Find("FEEDBACKVIEW");
            if (index != -1) {
                this.GetAt(index).RemoveAllItems();
                this.Remove(index);
            }

            const feedbackView = new FeedbackView("FEEDBACKVIEW");
            let j = 0;
            while (j < feedbackList.length) {
                feedback = feedbackList.GetAt(j);
                feedbackView.AddItem(feedback.content, feedback.evaluate);
                j++;
            }
            feedbackView.SetEditor(problem.evaluate);
            this.Add(feedbackView);

            index = this.Find("SOLUTIONVIEW");
            if (index != -1) {
                let solutionView = this.GetAt(index);
                solutionView.ClickFeedback();
            }

            this.isFeedbackSubmitted = false;

            playForm.Element.className = "";
            this.element.className = "";
        }
    }

    async SubmitAnswer(questionNumber, content) {
        if (this.isAnswerSubmitted === false) {

            const playForm = PlayForm.GetInstance();
            const requestor = new PhpRequestor();
            const menteeCard = MenteeCard.GetInstance();
            const playShelf = PlayShelf.GetInstance();
            const mentoCard = MentoCard.GetInstance();

            // 1. indexedDB를 연다.
            const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
            await indexedDB.Open();

            // 2. 답변 책에 추가한다.
            const playCase = playShelf.GetAt(playShelf.current);
            const applyCard = playCase.applyCard;
            const problemList = playCase.GetAt(0);
            const problem = problemList.GetAt(problemList.current);
            const solutionBook = playCase.GetAt(1);
            const solutionList = solutionBook.GetAt(solutionBook.current);
            const solution = solutionList.GetAt(solutionList.current);
            const questionBook = playCase.GetAt(3);
            const answerBook = playCase.GetAt(4);

            const emailAddress = menteeCard.emailAddress;
            const courseName = applyCard.courseName;
            const stepNumber = applyCard.stepNumber;
            const chapterNumber = problem.chapterNumber;
            const problemNumber = problem.number;
            const solutionNumber = solution.number;
            const mentoEmailAddress = mentoCard.emailAddress;

            let index = questionBook.Find(chapterNumber, problemNumber, solutionNumber);
            const questionList = questionBook.GetAt(index);
            index = questionList.Find(questionNumber);
            let question = questionList.GetAt(index);

            let answerCard = null;
            answerCard = new AnswerCard(problem, solution, question);
            answerBook.Add(answerCard);

            let answer = new Answer(null, content);
            index = answerCard.Add(answer);
            answer = answerCard.GetAt(index);

            // 4. 서버에 답변 추가를 요청한다.
            let body = `mentoEmailAddress=${mentoEmailAddress}&menteeEmailAddress=${emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}&chapterNumber=${chapterNumber}&problemNumber=${problemNumber}&solutionNumber=${solutionNumber}&questionNumber=${questionNumber}&content=${encodeURIComponent(answer.content)}`;
            let response = await requestor.PostJson("../../php/InsertAnswer.php", body);

            this.isAnswerSubmitted = true;

            // 3. indexedDB에 놀이 책장을 저장한다.
            let time = new DateTime(response.time);
            answerCard.Correct(index, time);

            indexedDB.Put("PlayShelf", playShelf);

            // 5. 답변 항목을 추가한다.
            index = this.Find("QNAVIEW");
            if (index != -1) {
                this.GetAt(index).RemoveAllItems();
                this.Remove(index);
            }

            const qnaView = new QnaView("QNAVIEW");
            let answerIndex;
            let j = 0;
            while (j < questionList.length) {
                question = questionList.GetAt(j);
                qnaView.AddQuestion(question.content);
                answerIndex = answerBook.Find(chapterNumber, problemNumber, solutionNumber, question.number);
                if (answerIndex != -1) {
                    answerCard = answerBook.GetAt(answerIndex);
                    qnaView.AddAnswer(answerCard.GetAt(0).content);
                }
                else {
                    qnaView.AddEditor("ANSWEREDITOR" + (j + 1));
                }
                j++;
            }
            this.Add(qnaView);

            index = this.Find("SOLUTIONVIEW");
            if (index != -1) {
                let solutionView = this.GetAt(index);
                solutionView.ClickQnA();
            }

            this.isAnswerSubmitted = false;

            playForm.Element.className = "";
            this.element.className = "";
        }
    }

    async OnLoaded() {
        const menteeCard = MenteeCard.GetInstance();
        const playShelf = PlayShelf.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();

        const playForm = PlayForm.GetInstance();

        let sideBar;
        let object;
        let index = playForm.Find("SIDEBAR");
        if (index != -1) {
            sideBar = PlayForm.GetInstance().GetAt(index);
            object = sideBar.GetSelectedSwitchMenuObject();
        }

        // 1. indexedDB를 연다.
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        // 2. 책갈피로 선택한 풀이를 찾는다.
        if (playShelf.current != -1 && object != null) {
            let playCase = playShelf.GetAt(playShelf.current);

            const requestor = new PhpRequestor();
            const applyCard = playCase.applyCard;
            const problemList = playCase.GetAt(0);
            const solutionBook = playCase.GetAt(1);
            const feedbackBook = playCase.GetAt(2);
            const questionBook = playCase.GetAt(3);
            const answerBook = playCase.GetAt(4);

            index = solutionBook.FindBySolution(object);
            const solutionList = solutionBook.GetAt(index);
            solutionBook.Move(index);
            index = problemList.Find(solutionList.chapterNumber, solutionList.problemNumber);
            const problem = problemList.GetAt(index);
            problemList.Move(index);
            index = solutionList.FindBySolution(object);
            const solution = solutionList.GetAt(index);
            solutionList.Move(index);
            let feedbackList = null;
            index = feedbackBook.Find(solutionList.chapterNumber, solutionList.problemNumber, solution.number);
            if (index != -1) {
                feedbackList = feedbackBook.GetAt(index);
            }

            const emailAddress = menteeCard.emailAddress;
            const courseName = applyCard.courseName;
            const stepNumber = applyCard.stepNumber;
            const chapterNumber = solutionList.chapterNumber;
            const problemNumber = solutionList.problemNumber;
            const solutionNumber = solution.number;

            let body = "emailAddress=" + emailAddress + "&courseName=" + courseName + "&stepNumber=" + stepNumber +
                "&chapterNumber=" + chapterNumber + "&problemNumber=" + problemNumber + "&number=" + solutionNumber;
            // 3. 이미지가 없으면 서버에 풀이 이미지 데이터를 요청한다.
            if (solution.image === null) {
                const image = await requestor.Post("../../php/GetSolutionImage.php", body);
                solution.image = image;
            }

            // 4. 서버에 질문 데이터를 요청한다.
            let questionList = null;
            const questionListObject = await requestor.PostJson("../../php/GetSolutionQuestions.php", body);
            index = questionBook.Find(chapterNumber, problemNumber, solutionNumber);
            if (index != -1 && questionListObject != undefined) {
                questionList = questionBook.GetAt(index);
                questionList.SetObject(questionListObject, problemList, solutionBook);
            }

            // 5. 놀이 책장에서 수정한다.
            // 6. indexedDB에 놀이 책장을 저장한다.
            indexedDB.Put("PlayShelf", playShelf);

            // 7. 풀이 뷰를 만든다.
            /** ProblemView를 만든다. */
            const problemView = new ProblemView("PROBLEMVIEW");
            problemView.SetTitle(problem.title);
            problemView.SetContent(problem.content);
            this.Add(problemView);

            /** SolutionView를 만든다. */
            const solutionView = new SolutionView("SOLUTIONVIEW", solution.state);
            solutionView.SetTitle(solution.number);
            solutionView.SetContent(solution.content);
            if (solution.image != '') {
                solutionView.SetImage(solution.image);
            }
            this.Add(solutionView);

            // 피드백
            index = this.Find("FEEDBACKVIEW");
            if (index != -1) {
                this.GetAt(index).RemoveAllItems();
                this.Remove(index);
            }

            const feedbackView = new FeedbackView("FEEDBACKVIEW");
            if (feedbackList != null) {
                let feedback;
                let j = 0;
                while (j < feedbackList.length) {
                    feedback = feedbackList.GetAt(j);
                    feedbackView.AddItem(feedback.content, feedback.evaluate);
                    j++;
                }
            }
            feedbackView.SetEditor(problem.evaluate); //TODO: 이진수 분류로 수정하기
            this.Add(feedbackView);

            // 질문답변
            index = this.Find("QNAVIEW");
            if (index != -1) {
                this.GetAt(index).RemoveAllItems();
                this.Remove(index);
            }

            const qnaView = new QnaView("QNAVIEW");
            if (questionList != null) {
                let question;
                let answerIndex;
                let answerCard;
                let j = 0;
                while (j < questionList.length) {
                    question = questionList.GetAt(j);
                    qnaView.AddQuestion(question.content);
                    answerIndex = answerBook.Find(chapterNumber, problemNumber, solutionNumber, question.number);
                    if (answerIndex != -1) {
                        answerCard = answerBook.GetAt(answerIndex);
                        qnaView.AddAnswer(answerCard.GetAt(0).content);
                    }
                    else {
                        qnaView.AddEditor("ANSWEREDITOR" + (j + 1));
                    }
                    j++;
                }
            }
            this.Add(qnaView);

            // 책갈피의 정보에 따라 피드백 또는 질문답변을 열다.
            if (bookmarkCard.type === "Solution") {
                solutionView.ClickFeedback();
            }
            else if (bookmarkCard.type == "Question" || bookmarkCard.type == "Answer") {
                solutionView.ClickQnA();
            }
            bookmarkCard.type = "";
            await indexedDB.Put("BookmarkCard", bookmarkCard);
        }
        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }
}