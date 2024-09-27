import { CompositeWindow } from "./Window.js";
import { WorkList } from "./Work.js";
import { ApplyBook } from "./Apply.js";
import { BookmarkCard } from "./Bookmark.js";
import { NTable } from "./NTable.js";
import { PageNavigation } from "./PageNavigation.js";
import { IndexForm } from "./IndexForm.js";
import { PlayShelf } from "./Play.js";
import { IndexedDB } from "./IndexedDB.js";
import { FrameController } from "./FrameController.js";
import { FeedbackBook } from "./Feedback.js";
import { MenteeCard } from "./Mentee.js";
import { PhpRequestor } from "./PhpRequestor.js";

export class BookmarkForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
        
        this.bookmarkTable = null;

        this.workList = null;
        this.workTable = null;
        this.pageNavigation = null;
    }

    static GetInstance() {
        if (window.top.forms["BOOKMARKFORM"] === undefined) {
            window.top.forms["BOOKMARKFORM"] = new BookmarkForm("BOOKMARKFORM");
        }
        return window.top.forms["BOOKMARKFORM"];
    }

    async OnLoaded() {
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();
        const playShelf = PlayShelf.GetInstance();
        let index = applyBook.FindCurrentCard();
        const applyCard = applyBook.GetAt(index);
        index = playShelf.Find(applyCard.courseName, applyCard.stepNumber);
        const playCase = playShelf.GetAt(index);
        playCase.Reset();

        const problemList = playCase.GetAt(0);
        const solutionBook = playCase.GetAt(1);
        const feedbackBook = playCase.GetAt(2);
        const questionBook = playCase.GetAt(3);
        const answerBook = playCase.GetAt(4);

        const requestor = new PhpRequestor();
        let body = `emailAddress=${menteeCard.emailAddress}&courseName=${applyCard.courseName}&stepNumber=${applyCard.stepNumber}`;
        const feedbackBookObject = await requestor.PostJson("../php/GetCurrentApplyFeedbacks.php", body);
        feedbackBook.SetObject(feedbackBookObject, problemList, solutionBook);

        // 풀이들 상태를 수정한다.
        feedbackBook.UpdateSolutionStates();
        // 신청 상태를 수정한다.
        playCase.UpdateApplyState();

        body = `emailAddress=${menteeCard.emailAddress}&courseName=${applyCard.courseName}&stepNumber=${applyCard.stepNumber}`;
        const answerBookObject = await requestor.PostJson("../php/GetCurrentApplyAnswers.php", body);
        answerBook.SetObject(answerBookObject, problemList, solutionBook, questionBook);

        let indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();
        await indexedDB.Put("PlayShelf", playShelf);

        const bookmarkCard = BookmarkCard.GetInstance();
        /** 1. 책갈피 표를 만든다. */
        const bookmarkTable = new NTable("BOOKMARKTABLE");
        this.bookmarkTable = bookmarkTable;
        let wrapper = document.getElementById("BOOKMARKTABLEWRAPPER");
        wrapper.appendChild(bookmarkTable.element);

        bookmarkTable.InsertColumn(0, "");
        bookmarkTable.InsertColumn(1, "");
        bookmarkTable.InsertItem(0, "책갈피");
        let text = "살펴보기";
        if (bookmarkCard.location > 0) {
            text = `${bookmarkCard.location}장`
        }
        bookmarkTable.SetItemText(0, 1, text);
        if (bookmarkCard.chapterNumber != null) {
            bookmarkTable.AddEventListener(0, 1, "click", this.OnBookmarkClicked);
        }

        /** 2. 활동 표를 만든다. */
        const workList = new WorkList();
        this.workList = workList;
        workList.LoadSolutionBook(solutionBook);
        workList.LoadFeedbackBook(feedbackBook);
        workList.LoadQuestionBook(questionBook);
        workList.LoadAnswerBook(answerBook);
        workList.Arrange();

        const workTable = new NTable("WORKTABLE");
        this.workTable = workTable;
        wrapper = document.getElementById("WORKTABLEWRAPPER");
        wrapper.appendChild(workTable.element);

        workTable.InsertColumn(0, "");
        workTable.InsertColumn(1, "");

        const MAX = 5;
        let i = 0;
        let count = 0;
        let work;
        let content;

        while (i < workList.length && count < MAX) {
            work = workList.GetAt(i);

            // 1 번째 열
            let dayOfWeek = work.time.GetKoreanDayOfWeek();
            let hour = work.time.hour;
            let ampm = "오전";
            if (hour >= 12) {
                ampm = "오후";
                if (hour >= 13) {
                    hour -= 12;
                }
            }
            const date = `${String(work.time.month).padStart(2, "0")}. ${String(work.time.day).padStart(2, "0")} (${dayOfWeek})`;
            const time = `${ampm} ${String(hour).padStart(2, "0")}:${String(work.time.minute).padStart(2, "0")}`;
            const dateTime = `${date}<br>${time}`;
            workTable.InsertItem(workTable.length, dateTime);

            // 2 번째 열
            content = `${work.chapterNumber}장 문제${work.problemNumber} 풀이${work.solutionNumber}`;

            let proto = Object.getPrototypeOf(work.object)
            let constructorName = proto.constructor.name;

            if (constructorName === "Solution") {
                content = `${content} 제출했습니다.`;
            }
            else if (constructorName === "Feedback") {
                content = `${content}에 피드백이 남겨졌어요.`;
            }
            else if (constructorName === "Question") {
                content = `${content}에 질문을 제출했습니다.`;
            }
            else if (constructorName === "Answer") {
                content = `${content}에 답변이 남겨졌어요.`;
            }
            workTable.SetItemText(workTable.length - 1, 1, content);
            workTable.SetItemData(workTable.length - 1, 1, work);
            workTable.AddEventListener(workTable.length - 1, 1, "click", this.OnWorkClicked);
            count++;
            i++;
        }

        /** 활동이 없으면 */
        if (workList.length === 0) {
            let dayOfWeek = applyCard.time.GetKoreanDayOfWeek();
            let hour = applyCard.time.hour;
            let ampm = "오전";
            if (parseInt(hour) >= 12) {
                ampm = "오후";
                if (parseInt(hour) >= 13) {
                    hour -= 12;
                }
            }
            const date = `${String(applyCard.time.month).padStart(2, "0")}. ${String(applyCard.time.day).padStart(2, "0")} (${dayOfWeek})`;
            const time = `${ampm} ${String(hour).padStart(2, "0")}:${String(applyCard.time.minute).padStart(2, "0")}`;
            const dateTime = `${date}<br>${time}`;

            workTable.InsertItem(0, dateTime);
            workTable.SetItemText(0, 1, "환영합니다. 왼쪽의 도움말 버튼으로 페이지별 도움말을 확인해보세요.");
        }

        /** 완료된 문제에 대한 알림을 흐리게 합니다. */
        // let problem;
        // let tr;
        // i = 0;
        // while (i < table.element.childElementCount - 1) {
        //     tr = table.element.children[i + 1];
        //     work = tr.children[1].data;
        //     j = 0;
        //     while (j < solutionCardBook.CompletesLength) {
        //         problem = solutionCardBook.completes[j];
        //         if (work.ChapterNumber == problem.ChapterNumber && work.ProblemNumber == problem.Number) {
        //             tr.className = "opacity";
        //         }
        //         j++;
        //     }
        //     i++;
        // }

        /** 페이지 네비게이션*/
        const pageNavigation = new PageNavigation("PAGENAVIGATION");
        this.pageNavigation = pageNavigation;
        wrapper = document.getElementById("PAGENAVIGATIONWRAPPER");
        wrapper.appendChild(this.pageNavigation.element);

        let pageCount = Math.floor(workList.length / MAX); // 한 페이지에 5개씩
        let remainder = workList.length % MAX;
        if (remainder > 0 || workList.length === 0) {
            pageCount++;
        }
        i = 1;
        while (i <= pageCount && i <= 10) { // 페이지 번호는 최대 10번까지
            pageNavigation.AddNumber(i, this.OnPageNumberClicked);
            i++;
        }
        if (pageCount > 10) {
            pageNavigation.AddNext(this.OnNextClicked, "../assets/roundRightArrow.png");
        }
        pageNavigation.Select(1);

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    async OnBookmarkClicked() {
        const applyBook = ApplyBook.GetInstance();
        const applyCard = applyBook.GetAt(applyBook.current);
        const bookmarkCard = BookmarkCard.GetInstance();

        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        bookmarkCard.Correct(0, bookmarkCard.location, "DESKFORM", "STUDYFORM", "bookmark", applyCard.courseName, applyCard.stepNumber, bookmarkCard.location, 0, 0);
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("DESKFORM");
    }

    OnNextClicked() {
        const bookmarkForm = BookmarkForm.GetInstance();
        const pageNavigationElement = document.getElementById("PAGENAVIGATION");
        const pageNavigation = pageNavigationElement.logicalObject;

        /** 페이지 번호를 다 지운다. */
        pageNavigation.DeleteAllItems();

        /** 이전 버튼을 만든다. */
        pageNavigation.AddPrevious(bookmarkForm.OnPreviousClicked, "../assets/roundLeftArrow.png");

        /** 다음 시작페이지 번호를 찾는다. */
        let first = pageNavigation.Current + 1;
        let remainder = first % 10;
        while (remainder != 1) {
            first++;
            remainder = first % 10;
        }

        /** 번호를 구성한다. */
        const MAX = 5;
        const workList = bookmarkForm.workList;
        let pageCount = Math.floor(workList.length / MAX); // 한 페이지에 5개씩
        remainder = workList.length % MAX;
        if (remainder != 0) {
            pageCount++;
        }

        let count = 0;
        let i = first;
        while (i <= pageCount && count < 10) { // 페이지 번호는 최대 10개까지
            pageNavigation.AddNumber(i, bookmarkForm.OnPageNumberClicked);
            count++
            i++;
        }

        /** 다음 버튼을 만든다. */
        let last = first + 10 - 1;
        if (last < pageCount) {
            pageNavigation.AddNext(bookmarkForm.OnNextClicked, "../assets/roundRightArrow.png");
        }

        /** 첫 번째 페이지번호를 클릭한다. */
        let firstElement = document.getElementById(`${pageNavigation.element.id}_NUMBERAREA_PAGE${first}`);
        let OnPageNumberClicked = bookmarkForm.OnPageNumberClicked.bind(firstElement);
        OnPageNumberClicked();
    }

    OnPageNumberClicked() {
        const bookmarkForm = BookmarkForm.GetInstance();
        const pageNavigationElement = document.getElementById("PAGENAVIGATION");
        const pageNavigation = pageNavigationElement.logicalObject;

        let pageNumber = parseInt(this.textContent);

        const tableElement = document.getElementById("WORKTABLE");
        const workTable = tableElement.logicalObject;
        workTable.DeleteAllItems();

        /** 표에 활동 카드를 적는다. */
        const workList = bookmarkForm.workList;
        const MAX = 5;
        let count = 0;
        let work;
        let i = (pageNumber - 1) * 5;
        while (i < workList.length && count < MAX) {
            work = workList.GetAt(i);

            // 1 번째 열
            let dayOfWeek = work.time.GetKoreanDayOfWeek();
            let hour = work.time.hour;
            let ampm = "오전";
            if (hour >= 12) {
                ampm = "오후";
                if (hour >= 13) {
                    hour -= 12;
                }
            }
            const date = `${String(work.time.month).padStart(2, "0")}. ${String(work.time.day).padStart(2, "0")} (${dayOfWeek})`;
            const time = `${ampm} ${String(hour).padStart(2, "0")}:${String(work.time.minute).padStart(2, "0")}`;
            const dateTime = `${date}<br>${time}`;
            workTable.InsertItem(workTable.length, dateTime);

            // 2 번째 열
            let content = `${work.chapterNumber}장 문제${work.problemNumber} 풀이${work.solutionNumber}`;

            let proto = Object.getPrototypeOf(work.object)
            let constructorName = proto.constructor.name;

            if (constructorName === "Solution") {
                content = `${content} 제출했습니다.`;
            }
            else if (constructorName === "Feedback") {
                content = `${content}에 피드백이 남겨졌어요.`;
            }
            else if (constructorName === "Question") {
                content = `${content}에 질문을 제출했습니다.`;
            }
            else if (constructorName === "Answer") {
                content = `${content}에 답변이 남겨졌어요.`;
            }

            workTable.SetItemText(workTable.length - 1, 1, content);
            workTable.SetItemData(workTable.length - 1, 1, work);
            workTable.AddEventListener(workTable.length - 1, 1, "click", BookmarkForm.GetInstance().OnWorkClicked);
            count++;
            i++;
        }

        /** 완료된 문제에 대한 알림을 흐리게 합니다. */
        // const solutionCardBook = SolutionCardBook.GetInstance();
        // let problem;
        // let tr;
        // let j;
        // i = 0;
        // while (i < table.element.childElementCount - 1) {
        //     tr = table.element.children[i + 1];
        //     work = tr.children[1].data;
        //     j = 0;
        //     while (j < solutionCardBook.CompletesLength) {
        //         problem = solutionCardBook.completes[j];
        //         if (work.ChapterNumber == problem.ChapterNumber && work.ProblemNumber == problem.Number) {
        //             tr.className = "opacity";
        //         }
        //         j++;
        //     }
        //     i++;
        // }

        pageNavigation.Select(pageNumber);
    }

    OnPreviousClicked() {
        const bookmarkForm = BookmarkForm.GetInstance();
        const pageNavigationElement = document.getElementById("PAGENAVIGATION");
        const pageNavigation = pageNavigationElement.logicalObject;

        /** 페이지 번호를 다 지운다. */
        pageNavigation.DeleteAllItems();

        /** 이전 시작페이지를 찾는다. */
        let first = pageNavigation.Current - 10;
        let remainder = first % 10;
        while (remainder != 1) {
            first--;
            remainder = first % 10;
        }

        /** 이전 버튼을 만든다. */
        if (first != 1) {
            pageNavigation.AddPrevious(bookmarkForm.OnPreviousClicked, "../assets/roundLeftArrow.png");
        }

        /** 번호를 구성한다. */
        const MAX = 5;
        const workList = bookmarkForm.workList;
        let pageCount = Math.floor(workList.length / MAX); // 한 페이지에 5개씩
        remainder = workList.length % MAX;
        if (remainder != 0) {
            pageCount++;
        }

        let count = 0;
        let i = first;
        while (i <= pageCount && count < 10) {
            pageNavigation.AddNumber(i, bookmarkForm.OnPageNumberClicked);
            count++
            i++;
        }

        /** 다음 버튼을 만든다. */
        pageNavigation.AddNext(bookmarkForm.OnNextClicked, "../assets/roundRightArrow.png");

        /** 마지막 페이지번호를 클릭한다. */
        let last = first + 10 - 1;
        let lastElement = document.getElementById(`${pageNavigation.element.id}_NUMBERAREA_PAGE${last}`);
        let OnPageNumberClicked = bookmarkForm.OnPageNumberClicked.bind(lastElement);
        OnPageNumberClicked();
    }

    async OnWorkClicked() {
        const applyBook = ApplyBook.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();
        const applyCard = applyBook.GetAt(applyBook.current);

        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        bookmarkCard.Correct(0, bookmarkCard.location, "PLAYFORM", "SOLVEFORM",
            this.data.object.__proto__.constructor.name, applyCard.courseName, applyCard.stepNumber,
            this.data.chapterNumber, this.data.problemNumber, this.data.solutionNumber);
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("PLAYFORM");
    }
}