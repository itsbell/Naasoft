import { CompositeWindow } from "./Window.js";
import { IndexedDB } from "./IndexedDB.js";
import { CourseList } from "./Course.js";
import { StepBook } from "./Step.js";
import { Mentee, MenteeCard } from "./Mentee.js";
import { ApplyBook } from "./Apply.js";
import { ProblemList } from "./Problem.js";
import { SolutionBook } from "./Solution.js";
import { FeedbackBook } from "./Feedback.js";
import { QuestionBook } from "./Question.js";
import { AnswerBook } from "./Answer.js";
import { PlayShelf, PlayCase } from "./Play.js";
import { BookmarkCard, Bookmark } from "./Bookmark.js";
import { MentoCard } from "./Mento.js";
import { MenteeInfoList } from "./MenteeInfo.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { Subject } from "./Subject.js";
import { FrameController } from "./FrameController.js"
import { HistoryController, HistoryState } from "./Observer.js";
import { RequestorFactory } from "./RequestorFactory.js";
import { DateTime } from "./DateTime.js";

export class IndexForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
        this.element.tabIndex = -1; // enable focus = enable key action
        this.element.addEventListener("keydown", this.OnKeyDown.bind(this));

        window.addEventListener('popstate', this.OnPopState.bind(this));

        this._frame = null;
        this._subject = null;
    }

    get frame() {
        return this._frame;
    }

    set frame(frame) {
        this._frame = frame;
    }

    get historyController() {
        return this._subject.GetAt(0);
    }

    static GetInstance() {
        if (window.top.indexForm === undefined) {
            window.top.indexForm = new IndexForm("INDEXFORM");
        }
        return window.top.indexForm;
    }

    Notify() {
        this._subject.Notify();
    }

    async OnLoaded() {
        this._subject = new Subject();
        this._subject.Attach(new HistoryController(this));

        // 1. 업무 객체들을 만든다.
        const courseList = CourseList.GetInstance();
        const stepBook = StepBook.GetInstance();
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();
        const playShelf = PlayShelf.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();
        const mentoCard = MentoCard.GetInstance();
        const menteeInfoList = MenteeInfoList.GetInstance();

        const phpRequestor = new PhpRequestor();

        // 2. indexedDB를 연다.
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        // 3. indexedDB에서 과정 목록을 적재한다.
        const courseListObject = await indexedDB.Get("CourseList");
        if (courseListObject != undefined) {
            courseList.SetObject(courseListObject);
        }
        // 4. indexedDB에서 단계 책을 적재한다.
        const stepBookObject = await indexedDB.Get("StepBook");
        if (stepBookObject != undefined) {
            stepBook.SetObject(stepBookObject, courseList);
        }

        // 5. indexedDB에서 멘토 카드를 적재한다.
        const mentoCardObject = await indexedDB.Get("MentoCard");
        if (mentoCardObject != undefined) {
            mentoCard.SetObject(mentoCardObject);
            // 6. 멘토 카드를 적재했으면
            // 6.1. 서버에 멘티 정보 데이터를 요청한다.
            let menteeInfoListObject = await phpRequestor.PostJson(`./${window.top.version}/php/GetAllMenteeInfo.php`);

            // 6.2. 멘티 정보 목록에 추가한다.
            menteeInfoList.SetObject(menteeInfoListObject);

            // 6.3. indexedDB에 멘티 정보 목록을 저장한다.
            indexedDB.Put("MenteeInfoList", menteeInfoList);
        }
        // 7. indexedDB에서 멘티 카드를 적재한다.
        const menteeCardObject = await indexedDB.Get("MenteeCard");
        if (menteeCardObject != undefined) {
            menteeCard.SetObject(menteeCardObject);
            // 8. 멘티 카드를 적재했으면
            // 8.1. 서버에 신청 데이터를 요청한다.
            let body = `emailAddress=${menteeCard.emailAddress}`;
            const applyBookObject = await phpRequestor.PostJson(`./${window.top.version}/php/GetAllApply.php`, body);

            // 8.2. 신청 책에 추가한다.
            applyBook.SetObject(applyBookObject, courseList, stepBook);

            // 8.3. 현재 신청을 찾는다.
            let index = applyBook.FindCurrentCard();
            if (index === -1) {
                index = applyBook.length - 1;
            }

            // 8.4. 신청 책에서 이동한다.
            applyBook.Move(index);

            // 8.5. indexedDB에 신청 책을 저장한다.
            await indexedDB.Put("ApplyBook", applyBook);

            // 
            this.RequestPlayCase();

            // 8.17. 서버에 책갈피 데이터를 요청한다.
            body = `emailAddress=${menteeCard.emailAddress}`;
            const bookmarkCardObject = await phpRequestor.PostJson(`./${window.top.version}/php/GetBookmark.php`, body);

            // 8.18. 책갈피 카드에 추가한다.
            bookmarkCard.SetObject(bookmarkCardObject);

            // 8.19. indexedDB에 책갈피 카드를 저장한다.
            await indexedDB.Put("BookmarkCard", bookmarkCard);
        }

        // 9. 페이지 상태와 멘토, 멘티 카드 적재 여부에 따라 페이지를 이동한다.
        const frameController = new FrameController(this);
        let id = "INITIALFORM";
        // 9.1. 현재 페이지가 있으면 현재 페이지로 이동한다.
        if (this.historyController.state != null) {
            let state = new HistoryState();
            state.SetObject(this.historyController.state);

            if (state.childForm != undefined) {
                if (bookmarkCard.length > 0) {
                    bookmarkCard.Correct(0, bookmarkCard.location, state.childForm, state.grandChildForm, state.type,
                        state.courseName, state.stepNumber, state.chapterNumber, state.problemNumber, state.solutionNumber);
                }
                else {
                    let bookmark = new Bookmark(0, state.childForm, state.grandChildForm, state.type,
                        state.courseName, state.stepNumber, state.chapterNumber, state.problemNumber, state.solutionNumber);
                    bookmarkCard.Add(bookmark);
                }

                await indexedDB.Put("BookmarkCard", bookmarkCard);

                id = bookmarkCard.childForm;
                this.historyController.isPushed = true;

                // 성과를 통해 이전 단계를 보다가 새로고침을 눌렀을 때
                let index = playShelf.Find(bookmarkCard.courseName, bookmarkCard.stepNumber);
                if (index === -1) {
                    index = applyBook.Find(bookmarkCard.courseName, bookmarkCard.stepNumber);
                    if (index != -1) {
                        applyBook.Move(index);
                        await indexedDB.Put("ApplyBook", applyBook);

                        this.RequestPlayCase();

                        bookmarkCard.Correct(0, bookmarkCard.location, bookmarkCard.childForm, bookmarkCard.grandChildForm,
                            bookmarkCard.type, bookmarkCard.courseName, bookmarkCard.stepNumber, -1, 0, 0);

                        await indexedDB.Put("BookmarkCard", bookmarkCard);
                    }
                }
            }
        }
        // 9.2. 현재 페이지가 없고, 멘토 카드가 적재되었으면 멘토 다락방으로 이동한다.
        else if (mentoCardObject != undefined) {
            id = "MENTOATTICFORM";
        }
        // 9.3. 현재 페이지가 없고, 멘토 카드가 적재되지 않았고, 멘티 카드가 적재되었으면 다락방으로 이동한다.
        else if (menteeCardObject != undefined) {
            id = "ATTICFORM";
        }
        // 9.4. 현재 페이지가 없고, 멘토 카드가 적재되지 않았고, 멘티 카드가 적재되지 않았으면 초기 페이지로 이동한다.
        frameController.Append(id);
        
        setInterval(this.OnIntegrateInterval.bind(this), 60000); // 60 sec
    }

    async RequestPlayCase() {
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();
        let applyCard = applyBook.GetAt(applyBook.current);
        const playShelf = PlayShelf.GetInstance();
        let index = playShelf.Add(new PlayCase(applyCard));
        let playCase = playShelf.GetAt(index);

        const MAX = 5;
        let i = 0;
        let promise;
        let promises = [];
        let requestor;
        let requestorFactory = new RequestorFactory({ emailAddress: menteeCard.emailAddress, courseName: applyCard.courseName, stepNumber: applyCard.stepNumber });
        let businessObject;

        while (i < MAX) {
            switch (i) {
                case 0: businessObject = new ProblemList(); break;
                case 1: businessObject = new SolutionBook(); break;
                case 2: businessObject = new FeedbackBook(); break;
                case 3: businessObject = new QuestionBook(); break;
                case 4: businessObject = new AnswerBook(); break;
                default: break;
            }
            playCase.Add(businessObject);

            requestor = requestorFactory.Make(businessObject);
            promise = requestor.Request();
            promises.push(promise);
            i++;
        }

        let text;
        let object;
        let response = await Promise.all(promises);
        let problemList = playCase.GetAt(0);
        let solutionBook = playCase.GetAt(1);
        let feedbackBook = playCase.GetAt(2);
        let questionBook = playCase.GetAt(3);

        i = 0;
        while (i < MAX) {
            businessObject = playCase.GetAt(i);
            text = await response[i].text();
            object = JSON.parse(text);

            switch (i) {
                case 0: problemList.SetObject(object); break;
                case 1: solutionBook.SetObject(object, problemList); break;
                case 2: feedbackBook.SetObject(object, problemList, solutionBook); break;
                case 3: businessObject.SetObject(object, problemList, solutionBook); break;
                case 4: businessObject.SetObject(object, problemList, solutionBook, questionBook); break;
                default: break;
            }
            i++;
        }

        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();
        await indexedDB.Put("PlayShelf", playShelf);
    }

    async OnPopState(event) {
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        let state = new HistoryState();
        state.SetObject(event.state);

        const bookmarkCard = BookmarkCard.GetInstance();
        if (bookmarkCard.length > 0) {
            bookmarkCard.Correct(0, bookmarkCard.location, state.childForm, state.grandChildForm, state.type,
                state.courseName, state.stepNumber, state.chapterNumber, state.problemNumber, state.solutionNumber);
        }
        else {
            let bookmark = new Bookmark(0, 0, state.childForm, state.grandChildForm, state.type,
                state.courseName, state.stepNumber, state.chapterNumber, state.problemNumber, state.solutionNumber);
            bookmarkCard.Add(bookmark);
        }

        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        indexForm.historyController.isPushed = true;

        const frameController = new FrameController(indexForm);
        frameController.Change(bookmarkCard.childForm);
    }

    async OnIntegrateInterval() {
        const mentoCard = MentoCard.GetInstance();
        const menteeCard = MenteeCard.GetInstance();
        if (mentoCard.length > 0) {
            const emailAddress = mentoCard.emailAddress;
            const time = mentoCard.time;

            const playShelf = PlayShelf.GetInstance();
            const integratePlayShelf = playShelf.GetMentoIntegrateObject(time);
            const feedbacksAndAnswers = JSON.stringify(integratePlayShelf);

            // 서버에 데이터 결합을 요청한다.
            const requestor = new PhpRequestor();
            let timeString = await requestor.Post(`./${window.top.version}/php/IntegrateMento.php`,
                "emailAddress=" + emailAddress +
                "&playShelf=" + feedbacksAndAnswers);

            mentoCard.time = new DateTime(timeString);
        }
        else if (menteeCard.length > 0) {
            const emailAddress = menteeCard.emailAddress;
            const time = menteeCard.time;

            const applyBook = ApplyBook.GetInstance();
            const integrateApplyBook = applyBook.GetIntegrateObject(time);
            const applies = JSON.stringify(integrateApplyBook);

            const playShelf = PlayShelf.GetInstance();
            const integratePlayShelf = playShelf.GetMenteeIntegrateObject(time);
            const solutionsAndQuestions = JSON.stringify(integratePlayShelf);

            const bookmarkCard = BookmarkCard.GetInstance();
            const integrateBookmarkCard = bookmarkCard.GetIntegrateObject();
            const bookmark = JSON.stringify(integrateBookmarkCard);
            // 서버에 데이터 결합을 요청한다.
            const requestor = new PhpRequestor();
            let timeString = await requestor.Post(`./${window.top.version}/php/IntegrateMentee.php`,
                "emailAddress=" + emailAddress +
                "&applyBook=" + applies + "&playShelf=" + solutionsAndQuestions + "&bookmarkCard=" + bookmark);

            menteeCard.time = new DateTime(timeString);
        }
    }

    async OnKeyDown(event) {
        if (event.ctrlKey && event.keyCode == 81) { // Ctrl Q
            const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
            await indexedDB.Open();
            await indexedDB.Clear();

            console.log("새고로침하세요.");
        }
        else if (event.ctrlKey && event.keyCode == 89) { // Ctrl Y
            const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
            await indexedDB.Open();

            const courseListObject = await indexedDB.Get("CourseList");
            console.log(courseListObject);
            const stepBookObject = await indexedDB.Get("StepBook");
            console.log(stepBookObject);
            const menteeCardObject = await indexedDB.Get("MenteeCard");
            console.log(menteeCardObject);
            const applyBookObject = await indexedDB.Get("ApplyBook");
            console.log(applyBookObject);
            const playShelfObject = await indexedDB.Get("PlayShelf");
            console.log(playShelfObject);
            const bookmarkCardObject = await indexedDB.Get("BookmarkCard");
            console.log(bookmarkCardObject);
            const mentoCardObject = await indexedDB.Get("MentoCard");
            console.log(mentoCardObject);
            const menteeInfoListObject = await indexedDB.Get("MenteeInfoList");
            console.log(menteeInfoListObject);
        }
    }
}