import { CompositeWindow } from "../../js/Window.js";
import { PhpRequestor } from "../../js/PhpRequestor.js";
import { WorkList } from "./Work.js";
import { NTable } from "../../js/NTable.js";
import { DateTime } from "../../js/DateTime.js";
import { IndexForm } from "../../js/IndexForm.js";
import { IndexedDB } from "../../js/IndexedDB.js";
import { PlayShelf, PlayCase } from "../../js/Play.js";
import { MenteeCard } from "../../js/Mentee.js";
import { ApplyBook } from "../../js/Apply.js";
import { BookmarkCard, Bookmark } from "../../js/Bookmark.js"
import { StepBook } from "../../js/Step.js";
import { CourseList } from "../../js/Course.js";
import { ProblemList } from "../../js/Problem.js";
import { SolutionBook } from "../../js/Solution.js";
import { FeedbackBook } from "../../js/Feedback.js";
import { QuestionBook } from "../../js/Question.js";
import { AnswerBook } from "../../js/Answer.js";
import { FrameController } from "../../js/FrameController.js";

export class BookmarkForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));

        this._workList = null;
    }

    /** @return {BookmarkForm} */
    static GetInstance() {
        if (window.top.forms["BOOKMARKFORM"] === undefined) {
            window.top.forms["BOOKMARKFORM"] = new BookmarkForm("BOOKMARKFORM");
        }
        return window.top.forms["BOOKMARKFORM"];
    }

    async OnLoaded() {

        // WorkList를 적재한다.
        await this.LoadWorkList();

        // WorkList UI를 만든다.
        this.MakeWorkListUI();

    }

    async LoadWorkList() {
        if (this._workList != null) {
            this._workList = null;
        }
        let workList = new WorkList();
        this._workList = workList;

        /* "WAIT" 상태인 풀이들을 가지고 워크카드를 만든다. */
        const requestor = new PhpRequestor();
        let response = await requestor.PostJson("../../php/GetSolutionWorkCards.php");
        let i = 0;
        while (i < response.length) {
            workList.Add(
                "solution",
                new DateTime(response[i].time),
                response[i].menteeName,
                response[i].menteeEmailAddress,
                response[i].courseName,
                parseInt(response[i].stepNumber),
                parseInt(response[i].chapterNumber),
                parseInt(response[i].problemNumber),
                parseInt(response[i].solutionNumber)
            );
            i++;
        }

        /* "UNCHECKED" 상태인 질문들을 가지고 워크카드를 만든다. */
        response = await requestor.PostJson("../../php/GetQuestionWorkCards.php");
        i = 0;
        while (i < response.length) {
            workList.Add(
                "question",
                new DateTime(response[i].time),
                response[i].menteeName,
                response[i].menteeEmailAddress,
                response[i].courseName,
                parseInt(response[i].stepNumber),
                parseInt(response[i].chapterNumber),
                parseInt(response[i].problemNumber),
                parseInt(response[i].solutionNumber)
            );
            i++;
        }
        // 시간 순 정렬
        workList.Arrange();
    }

    MakeWorkListUI() {
        /* 활동목록에 활동을 추가하다. */
        let table = new NTable("WORKTABLE");
        let container = document.getElementById("CONTAINER");
        container.appendChild(table.element);

        table.InsertColumn(0, "");
        table.InsertColumn(1, "");

        let i = 0;
        while (i < this._workList.length) {
            let work = this._workList.GetAt(i);

            // 첫 번째 열
            let dayOfWeek = work.time.GetKoreanDayOfWeek();
            let hour = work.time.hour;
            let ampm = "오전";
            if (parseInt(hour) >= 12) {
                ampm = "오후";
                if (parseInt(hour) >= 13) {
                    hour -= 12;
                }
            }

            let date = `${String(work.time.month).padStart(2, "0")}. ${String(work.time.day).padStart(2, "0")} (${dayOfWeek})`;
            let time = `${ampm} ${String(hour).padStart(2, "0")}:${String(work.time.minute).padStart(2, "0")}`;
            let dateTime = `${date}<br>${time}`;
            table.InsertItem(table.length, dateTime);

            let content;
            // 두 번째 열
            if (work.type === "solution") {
                content = `${work.menteeName}이(가) ${work.stepNumber}단계 ${work.chapterNumber}장 문제${work.problemNumber} 풀이${work.solutionNumber}을(를) 제출했습니다.`;
            }
            else if (work.type === "question") {
                content = `${work.menteeName}이(가) ${work.stepNumber}단계 ${work.chapterNumber}장 문제${work.problemNumber} 풀이${work.solutionNumber}에 질문을 남겼어요.`;
            }
            table.SetItemText(i, 1, content);
            table.SetItemData(i, 1, work);
            table.AddEventListener(i, 1, "click", this.OnWorkClicked);

            i++;
        }
    }

    async OnWorkClicked() {
        const requestor = new PhpRequestor;
        const stepBook = StepBook.GetInstance();
        const courseList = CourseList.GetInstance();
        const playShelf = PlayShelf.GetInstance();
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();

        menteeCard.RemoveAll();
        applyBook.RemoveAll();
        bookmarkCard.RemoveAll();
        playShelf.RemoveAll();

        const work = this.data;
        const emailAddress = work.menteeEmailAddress;
        const courseName = work.courseName;
        const stepNumber = work.stepNumber;

        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVerision);
        await indexedDB.Open();

        // 서버에 멘티 데이터를 요청한다.
        let body = `emailAddress=${emailAddress}`;
        const menteeObject = await requestor.PostJson("../../php/GetMentee.php", body);
        menteeCard.SetObject(menteeObject);
        await indexedDB.Put("MenteeCard", menteeCard);

        // 서버에 신청 데이터를 요청한다.
        body = `emailAddress=${menteeCard.emailAddress}`;
        const applyBookObject = await requestor.PostJson("../../php/GetAllApply.php", body);
        applyBook.SetObject(applyBookObject, courseList, stepBook);
        let index = applyBook.Find(courseName, stepNumber);
        if (index === -1) {
            index = applyBook.length - 1;
        }
        applyBook.Move(index);
        const applyCard = applyBook.GetAt(applyBook.current);
        await indexedDB.Put("ApplyBook", applyBook);

        index = playShelf.Add(new PlayCase(applyCard));
        const playCase = playShelf.GetAt(index);

        // 서버에 문제 데이터를 요청한다.
        const problemList = new ProblemList();
        body = `courseName=${courseName}&stepNumber=${stepNumber}`;
        const problemListObject = await requestor.PostJson("../../php/GetProblems.php", body);
        problemList.SetObject(problemListObject);
        playCase.Add(problemList);

        // 서버에 풀이 데이터를 요청한다.
        const solutionBook = new SolutionBook();
        body = `emailAddress=${menteeCard.emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
        const solutionBookObject = await requestor.PostJson("../../php/GetCurrentApplySolutions.php", body);
        solutionBook.SetObject(solutionBookObject, problemList);
        playCase.Add(solutionBook);

        // 서버에 피드백 데이터를 요청한다.
        const feedbackBook = new FeedbackBook();
        body = `emailAddress=${menteeCard.emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
        const feedbackBookObject = await requestor.PostJson("../../php/GetCurrentApplyFeedbacks.php", body);
        feedbackBook.SetObject(feedbackBookObject, problemList, solutionBook);
        playCase.Add(feedbackBook);

        // 서버에 질문 데이터를 요청한다.
        const questionBook = new QuestionBook();
        body = `emailAddress=${menteeCard.emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
        const questionBookObject = await requestor.PostJson("../../php/GetCurrentApplyQuestions.php", body);
        questionBook.SetObject(questionBookObject, problemList, solutionBook);
        playCase.Add(questionBook);

        // 서버에 답변 데이터를 요청한다.
        const answerBook = new AnswerBook();
        body = `emailAddress=${menteeCard.emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
        const answerBookObject = await requestor.PostJson("../../php/GetCurrentApplyAnswers.php", body);
        answerBook.SetObject(answerBookObject, problemList, solutionBook, questionBook);
        playCase.Add(answerBook);

        // indexedDB에 놀이 책장을 저장한다.
        await indexedDB.Put("PlayShelf", playShelf);

        let bookmark = new Bookmark("", "", work.type, work.courseName, work.stepNumber, work.chapterNumber, work.problemNumber, work.solutionNumber);
        bookmarkCard.Add(bookmark);
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("MENTOPLAYFORM");
    }

}
