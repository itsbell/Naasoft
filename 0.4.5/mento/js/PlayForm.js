import { CompositeWindow } from "../../js/Window.js";
import { PlayShelf } from "../../js/Play.js";
import { BookmarkCard } from "../../js/Bookmark.js";
import { IndexedDB } from "../../js/IndexedDB.js";
import { SideBar } from "../../js/SideBar.js";
import { IndexForm } from "../../js/IndexForm.js";
import { FrameController } from "../../js/FrameController.js";

export class PlayForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.playForm === undefined) {
            window.top.playForm = new PlayForm("MENTOPLAYFORM");
        }
        return window.top.playForm;
    }

    OnLoaded() {
        window.top.sessionStorage.setItem("PageId", this.id);

        const playShelf = PlayShelf.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();

        // 2. 사이드바를 만든다.
        const sideBar = new SideBar("SIDEBAR");
        sideBar.AddTop("나아 소프트북", "MENTOATTICFORM", "../../assets/logo.png");
        sideBar.AddControl("UPBUTTON", "../../assets/up.png", this.OnUpButtonClicked.bind(this), "뒤로가기");

        let index = playShelf.Find(bookmarkCard.courseName, bookmarkCard.stepNumber);
        if (index != -1) {
            playShelf.Move(index);
            let playCase = playShelf.GetAt(index);

            const problemList = playCase.GetAt(0);
            const solutionBook = playCase.GetAt(1);
            // TODO: 번호 순대로 정렬하기.
            // problemList.Arrange();

            if (bookmarkCard.chapterNumber != -1) {
                window.top.document.title = bookmarkCard.chapterNumber + "장";
            }

            let start;
            let end;
            [start, end] = problemList.FindChapterRange(bookmarkCard.chapterNumber);
            if (start === -1 && end === -1) {
                start = 0;
                end = problemList.length - 1;
            }

            let menuId;
            let submenuId;
            let chapterNumber;
            let problemNumber;
            let previousChapterNumber;
            let problem;
            let solutionList;
            let solutionListIndex;
            let solutionListLength;
            let solution;
            let j;
            let i = start;
            while (i <= end) {
                problem = problemList.GetAt(i);
                chapterNumber = problem.chapterNumber;
                problemNumber = problem.number;

                menuId = "CHAPTER" + chapterNumber;
                submenuId = menuId + "PROBLEM" + problemNumber;
                if (i === start || chapterNumber != previousChapterNumber) {
                    sideBar.AddDropdownMenu(chapterNumber + "장", menuId);
                    previousChapterNumber = chapterNumber;
                }

                solutionListLength = 0;
                solutionListIndex = solutionBook.Find(chapterNumber, problemNumber);
                if (solutionListIndex != -1) {
                    solutionList = solutionBook.GetAt(solutionListIndex);
                    solutionListLength = solutionList.length;
                    sideBar.AddDropdownSubmenu(menuId, "문제 " + problemNumber, submenuId);
                }

                j = 0;
                while (j < solutionListLength) {
                    solution = solutionList.GetAt(j);
                    sideBar.AddSwitchSubmenu(submenuId, "풀이 " + solution.number, "SOLVEFORM", "./solve.html", solution);
                    j++;
                }

                i++;
            }

            this.Add(sideBar);

            // 3. SolutionForm을 끼운다.

            // 전체보기면 처음 풀이를 연다.
            // 한 장 보기면 마지막 또는 특정 풀이를 연다.
            let list;
            if (bookmarkCard.chapterNumber != -1) {
                let problemListIndex = problemList.Find(bookmarkCard.chapterNumber, bookmarkCard.problemNumber);
                problemList.Move(problemListIndex);
                solutionBook.Move(0);
                problem = problemList.GetAt(problemListIndex);
                list = sideBar.ClickMenuItemByText(problem.chapterNumber + "장");
                solutionListIndex = solutionBook.Find(problem.chapterNumber, problem.number);
                if (solutionListIndex != -1) {
                    solutionBook.Move(solutionListIndex);

                    list = sideBar.ClickMenuItemByText("문제 " + problem.number, list);

                    solutionList = solutionBook.GetAt(solutionListIndex);
                    let solutionIndex = solutionList.Find(bookmarkCard.solutionNumber);
                    if (solutionIndex == -1) {
                        solutionIndex = solutionList.length - 1;
                    }
                    solutionList.Move(solutionIndex);
                    solution = solutionList.GetAt(solutionIndex);
                    sideBar.ClickMenuItemByText("풀이 " + solution.number, list);
                }
            }
            else {
                problemList.Move(0);
                problem = problemList.GetAt(0);
                solutionListIndex = solutionBook.Find(problem.chapterNumber, problem.number);
                solutionBook.Move(solutionListIndex);
                solutionList = solutionBook.GetAt(solutionListIndex);
                solutionList.Move(0);
                solution = solutionList.GetAt(0);

                list = sideBar.ClickMenuItemByText(problem.chapterNumber + "장");
                list = sideBar.ClickMenuItemByText("문제 " + problem.number, list);
                sideBar.ClickMenuItemByText("풀이 " + solution.number, list);
            }
        }

        // 4. SideBar를 보여준다.
        setTimeout(function () {
            let index = this.Find("SIDEBAR");
            if (index != -1) {
                this.GetAt(index).Show();
            }
        }.bind(this), 30);
    }

    async OnUpButtonClicked() {
        const playShelf = PlayShelf.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();
        const playCase = playShelf.GetAt(0);
        const problemList = playCase.GetAt(0);
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        let chapterNumber = 0;
        if (problemList.current != -1) {
            let problem = problemList.GetAt(problemList.current);
            chapterNumber = problem.chapterNumber;
        }
        let menu = "살펴보기";
        if (chapterNumber > 0) {
            menu = `${chapterNumber}장`;
        }

        bookmarkCard.Correct(0, bookmarkCard.location, "DESKFORM", "STUDYFORM", "", "", 0, chapterNumber, 0, 0);
        await indexedDB.Put("BookmarkCard", bookmarkCard);
        
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("MENTODESKFORM");
    }
}