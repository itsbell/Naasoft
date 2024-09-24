import { CompositeWindow } from "./Window.js";
import { IndexedDB } from "./IndexedDB.js";
import { MenteeCard } from "./Mentee.js";
import { PlayShelf } from "./Play.js";
import { BookmarkCard } from "./Bookmark.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { PlayForm } from "./PlayForm.js";
import { ProblemView } from "./ProblemView.js";
import { SolutionView } from "./SolutionView.js";
import { DraggableElement } from "./DraggableElement.js";
import { SolveGround, QnAItem } from "./SolveGround.js";
import { ApplyBook } from "./Apply.js";
import { QuestionList, Question } from "./Question.js";
import { DateTime } from "./DateTime.js";
import { IndexForm } from "./IndexForm.js";


export class SolveForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
        this.element.addEventListener("load", this.OnLoaded.bind(this));

        this._isSubmitted = false; // 질문 중복 제출 방지
    }

    static GetInstance() {
        if (window.top.forms["SOLVEFORM"] === undefined) {
            window.top.forms["SOLVEFORM"] = new SolveForm("SOLVEFORM");
        }
        return window.top.forms["SOLVEFORM"];
    }

    async SubmitQuestion(content) {
        if (this._isSubmitted === false) {
            this._isSubmitted = true;

            let postContent = content.replace(/\\/g, '\\\\'); // 역슬래시 하나를 역슬래시 두개로 바꾸기
            postContent = postContent.replace(/"/g, '\\"');   // escape quotes

            const requestor = new PhpRequestor();
            const playForm = PlayForm.GetInstance();
            const playShelf = PlayShelf.GetInstance();
            const applyBook = ApplyBook.GetInstance();
            const menteeCard = MenteeCard.GetInstance();

            const playCase = playShelf.GetAt(playShelf.current);
            const applyCard = applyBook.GetAt(applyBook.current);
            const problemList = playCase.GetAt(0);
            const problem = problemList.GetAt(problemList.current);
            const solutionBook = playCase.GetAt(1);
            const solutionList = solutionBook.GetAt(solutionBook.current);
            const solution = solutionList.GetAt(solutionList.current);
            const questionBook = playCase.GetAt(3);

            const emailAddress = menteeCard.emailAddress;
            const courseName = applyCard.courseName;
            const stepNumber = applyCard.stepNumber;
            const chapterNumber = problem.chapterNumber;
            const problemNumber = problem.number;
            const solutionNumber = solution.number;

            playForm.Element.className = "waiting";
            this.element.className = "waiting";

            let questionList = null;
            let index = questionBook.Find(chapterNumber, problemNumber, solutionNumber);
            if (index === -1) {
                questionList = new QuestionList(problem, solution);
                index = questionBook.Add(questionList);
            }
            questionBook.Move(index);
            questionList = questionBook.GetAt(questionBook.current);

            let question = new Question(questionList.length + 1, null, content);
            index = questionList.Add(question);
            question = questionList.GetAt(index);

            let body = `emailAddress=${emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}&chapterNumber=${chapterNumber}&problemNumber=${problemNumber}&solutionNumber=${solutionNumber}&number=${question.number}&content=${postContent}`;
            let response = await requestor.PostJson("../php/InsertQuestion.php", body);

            let time = new DateTime(response.time);
            questionList.Correct(index, time);
            const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
            await indexedDB.Open();
            await indexedDB.Put("PlayShelf", playShelf);

            const bookmarkCard = BookmarkCard.GetInstance();
            bookmarkCard.Correct(0, bookmarkCard.location, "", "", "question", "", 0, chapterNumber, problemNumber, solutionNumber);
            await indexedDB.Put("BookmarkCard", bookmarkCard);

            this.UpdateQnA();
        }
    }

    async UpdateQnA() {
        const bookmarkCard = BookmarkCard.GetInstance();
        const playForm = PlayForm.GetInstance();
        const playShelf = PlayShelf.GetInstance();
        const playCase = playShelf.GetAt(playShelf.current);
        const questionBook = playCase.GetAt(3);
        const answerBook = playCase.GetAt(4);
        const questionList = questionBook.GetAt(questionBook.current);

        const solveGroundElement = document.getElementById("SOLVEGROUND");
        const solveGround = solveGroundElement.logicalObject;
        solveGround.qnaToggle = false;
        solveGround.qnaNeverShowed = true;
        let qnaListCtrl = document.getElementById("QNALISTCTRL");
        solveGroundElement.removeChild(qnaListCtrl);
        solveGround.qnaListCtrl = new QnAItem("QNALISTCTRL", "질문/답변");

        solveGround.qnaListCtrl.element.addEventListener("click", solveGround.OnQnaListCtrlClicked.bind(solveGround.qnaListCtrl.element));
        solveGround.qnaListCtrl.head.addEventListener("mousedown", solveGround.OnQnaListCtrlMousedown.bind(solveGround.qnaListCtrl.element));
        solveGround.qnaListCtrl.head.addEventListener("mouseleave", solveGround.OnQnaListCtrlMouseleave.bind(solveGround.qnaListCtrl.element));
        solveGround.qnaListCtrl.head.addEventListener("mousemove", solveGround.OnQnaListCtrlMousemove.bind(solveGround.qnaListCtrl.element));
        solveGround.qnaListCtrl.element.style.zIndex = solveGround.zIndex;
        solveGround.zIndex++;
        solveGround.element.appendChild(solveGround.qnaListCtrl.element);

        solveGround.qnaListCtrl.MakeTalks(questionList, answerBook);

        const solutionView = document.getElementById("SOLUTIONVIEW").logicalObject;
        if (bookmarkCard.type === "feedback") {
            solutionView.ClickFeedback();
        }
        else if (bookmarkCard.type == "question" || bookmarkCard.type == "answer") {
            solutionView.ClickQnA();
        }
        bookmarkCard.type = "";
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        playForm.Element.className = "";
        this.element.className = "";
        this._isSubmitted = false;
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

            const requestor = new PhpRequestor;
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
            let questionList = null;
            index = questionBook.Find(solutionList.chapterNumber, solutionList.problemNumber, solution.number);
            if (index != -1) {
                questionList = questionBook.GetAt(index);
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
                const image = await requestor.Post("../php/GetSolutionImage.php", body);
                solution.image = image;
            }

            // 4. 서버에 풀이 상태 데이터를 요청한다.
            const state = await requestor.Post("../php/GetSolutionState.php", body);
            solution.state = state;

            // 5. 서버에 피드백 데이터를 요청한다.
            let feedbackList = null;
            const feedbackListObject = await requestor.PostJson("../php/GetSolutionFeedbacks.php", body);
            index = feedbackBook.Find(chapterNumber, problemNumber, solutionNumber);
            if (index != -1 && feedbackListObject != undefined) {
                feedbackList = feedbackBook.GetAt(index);
                feedbackList.SetObject(feedbackListObject, problemList, solutionBook);
            }

            // 6. 서버에 답변 데이터를 요청한다.
            const answerBookPartObject = await requestor.PostJson("../php/GetSolutionAnswers.php", body);
            answerBook.SetObjectPart(answerBookPartObject, problemList, solutionBook, questionBook);

            // 7. 놀이 책장에서 수정한다.
            // 8. indexedDB에 놀이 책장을 저장한다.
            indexedDB.Put("PlayShelf", playShelf);

            // 9. 풀이 뷰를 만든다.
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

            if (solution.state === "FINISH") {
                // 현재 문제가 현재 장의 마지막 문제가 아니면 다음 문제 버튼을 만든다.
                if (problemList.IsLastProblem(chapterNumber, problemNumber) === false) {
                    solutionView.AddNextProblem();
                }
                // 현재 문제가 현재 장의 마지막 문제이면
                else {
                    //  현재 장이 마지막 장이 아니면 다음 장 버튼을 만든다.
                    if (problemList.IsLastChapter(chapterNumber) === false) {
                        solutionView.AddNextChapter();
                    }
                    //  현재 장이 마지막 장이면 다음 책 버튼을 만든다.
                    else {
                        solutionView.AddNextBook();
                    }
                }
            }
            this.Add(solutionView);

            const solveGround = new SolveGround("SOLVEGROUND", feedbackList);
            this.element.prepend(solveGround.element);
            if (questionList != null) {
                solveGround.qnaListCtrl.MakeTalks(questionList, answerBook);
            }

            // 책갈피의 정보에 따라 피드백 또는 질문답변을 열다.
            if (bookmarkCard.type === "Feedback") {
                solutionView.ClickFeedback();
            }
            else if (bookmarkCard.type == "Question" || bookmarkCard.type == "Answer") {
                solutionView.ClickQnA();
            }
            bookmarkCard.type = "";
            await indexedDB.Put("BookmarkCard", bookmarkCard);

            if (courseName === "다락방 1층" && stepNumber === 1 &&
                chapterNumber === 2 && problemNumber === 1 && solutionNumber === 1) {
                let windowIndex = sideBar.Find("HELPBUTTON");
                if (windowIndex != -1) {
                    const helpButton = sideBar.GetAt(windowIndex);
                    helpButton.Element.dispatchEvent(new Event("click"));
                }
            }
        }
        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class FeedbackItem {
    constructor(id, evaluate, content) {

        this.element = document.getElementById(id);
        this.element.logicalObject = this;
        this.element.addEventListener("mousedown", this.OnFeedbackItemMousedown);
        DraggableElement.SetElement(id);

        let feedbackHead = document.createElement("div");
        feedbackHead.className = "feedback-head";
        this.element.appendChild(feedbackHead);

        let number = document.createElement("div");
        number.className = "feedback-head-number";
        let textContent = this.element.parentNode.logicalObject.Length + 1;
        number.textContent = textContent;
        feedbackHead.appendChild(number);

        let wrapper = document.createElement("div");
        wrapper.className = "feedback-head-wrapper";
        feedbackHead.appendChild(wrapper);

        let iconDiv = document.createElement("div");
        iconDiv.className = "feedback-head-iconDiv";
        wrapper.appendChild(iconDiv);

        let icon = document.createElement("img");
        icon.className = "feedback-head-iconDiv-icon";
        iconDiv.appendChild(icon);

        let subject = document.createElement("div");
        subject.className = "feedback-head-subject";
        wrapper.appendChild(subject);

        let feedbackBody = document.createElement("div");
        feedbackBody.className = "feedback-body";
        this.element.appendChild(feedbackBody);

        let p = document.createElement("p");
        p.textContent = content;
        feedbackBody.appendChild(p);

        evaluate = parseInt(evaluate, 10);
        switch (evaluate) {
            case -2: subject.textContent = "평가 불가";
                icon.src = "../assets/none.png"; break;
            case -1: subject.textContent = "완료";
                icon.src = "../assets/ability.png"; break;
            case 1: subject.textContent = "추상화 능력";
                icon.src = "../assets/ability1.png"; break;
            case 2: subject.textContent = "논리적 사고력";
                icon.src = "../assets/ability2.png"; break;
            case 3: subject.textContent = "문제 해결 능력";
                icon.src = "../assets/ability3.png"; break;
            case 4: subject.textContent = "비판적 사고력";
                icon.src = "../assets/ability4.png"; break;
            case 5: subject.textContent = "프로그래밍 언어 구사 능력";
                icon.src = "../assets/ability5.png"; break;
            case 6: subject.textContent = "디버깅 능력";
                icon.src = "../assets/ability6.png"; break;
            default: break;
        }
    }

    OnFeedbackItemMousedown() {
        const solveGround = document.getElementById("SOLVEGROUND").logicalObject;
        this.style.zIndex = solveGround.ZIndex;
        solveGround.zIndex++;
    }
}