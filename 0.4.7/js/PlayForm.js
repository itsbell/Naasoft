import { CompositeWindow } from "./Window.js";
import { PlayShelf } from "./Play.js";
import { BookmarkCard } from "./Bookmark.js";
import { SideBar } from "./SideBar.js";
import { DraggableGround } from "./DraggableGround.js";
import { DraggableElement } from "./DraggableElement.js";
import { ImageButton } from "./Buttons.js";
import { IndexForm } from "./IndexForm.js";
import { IndexedDB } from "./IndexedDB.js";
import { FrameController } from "./FrameController.js";

export class PlayForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));

        this._frame = null;
    }

    get frame() {
        return this._frame;
    }

    set frame(frame) {
        this._frame = frame;
    }

    static GetInstance() {
        if (window.top.playForm === undefined) {
            window.top.playForm = new PlayForm("PLAYFORM");
        }
        return window.top.playForm;
    }

    OnLoaded() {
        window.top.sessionStorage.setItem("PageId", this.id);

        const playShelf = PlayShelf.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();

        // 2. 사이드바를 만든다.
        const sideBar = new SideBar("SIDEBAR");
        sideBar.AddTop("나아 소프트북", "ATTICFORM", "../assets/logo.png");
        sideBar.AddControl("UPBUTTON", "../assets/up.png", this.OnUpButtonClicked.bind(this), "뒤로가기");
        sideBar.AddControl("HELPBUTTON", "../assets/help.png", this.OnHelpButtonClicked.bind(this), "도움말");

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
            let isFinish;
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

                isFinish = false;
                j = 0;
                while (j < solutionListLength) {
                    solution = solutionList.GetAt(j);
                    sideBar.AddSwitchSubmenu(submenuId, "풀이 " + solution.number, "SOLVEFORM", "./solve.html", solution);
                    if (solution.state === "FINISH") {
                        isFinish = true;
                    }
                    j++;
                }

                if (isFinish === false) {
                    sideBar.AddSwitchButtonSubmenu(submenuId, "ADDBUTTON" + problemNumber, "+", "EDITSOLUTIONFORM", "./editSolution.html", problem);
                }

                i++;
            }

            this.Add(sideBar);

            // 3. SolutionForm OR EditSolutionForm(iFrame)을 끼운다.

            // 전체보기면 처음 풀이를 연다.
            // 한 장 보기면 마지막 또는 특정 풀이를 연다.
            let list;
            if (bookmarkCard.chapterNumber != -1) {
                let problemListIndex = problemList.Find(bookmarkCard.chapterNumber, bookmarkCard.problemNumber);
                problemList.Move(problemListIndex);
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
                else {
                    const frameController = new FrameController(this);
                    frameController.Append("EDITSOLUTIONFORM");
                }
            }
            else {
                if (solutionBook.length > 0) {
                    solutionBook.Move(solutionListIndex);
                    solutionList = solutionBook.GetAt(0);
                    
                    chapterNumber = solutionList.chapterNumber;
                    problemNumber = solutionList.problemNumber;
                    
                    problemList.MoveByChapterNumberAndNumber(chapterNumber, problemNumber);
                    
                    solutionList.Move(0);
                    solution = solutionList.GetAt(0);

                    list = sideBar.ClickMenuItemByText(chapterNumber + "장");
                    list = sideBar.ClickMenuItemByText("문제 " + problemNumber, list);
                    sideBar.ClickMenuItemByText("풀이 " + solution.number, list);
                }
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
        frameController.Change("DESKFORM");
    }

    OnHelpButtonClicked() {
        let currentId;

        let parentBody = document.body;
        let children = parentBody.children;
        let i = 0;
        while (i < children.length && children[i].tagName != "IFRAME") {
            i++;
        }
        if (i < children.length) {
            let iframe = children[i];
            currentId = iframe.id;
        }

        let ground = document.getElementById("HELPGROUND");
        if (ground != null) {
            document.body.removeChild(ground);
        }
        else {
            ground = document.createElement("div");
            ground.id = "HELPGROUND";
            document.body.prepend(ground);

            const helpGround = new HelpGround(ground.id);

            if (currentId === "EDITSOLUTIONFORM") {
                helpGround.ShowSubmit();
            }
            else if (currentId === "SOLVEFORM") {
                helpGround.ShowMove();
            }
        }
    }
}

class HelpGround {
    constructor(id) {
        this.element = document.getElementById(id);
        this.element.logicalObject = this;

        DraggableGround.SetElement(id);

        this.zIndex = 1;
    }

    get ZIndex() {
        return this.zIndex;
    }

    ShowSubmit() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }

        let submit = document.createElement("div");
        submit.id = "SUBMITHELP";
        submit.className = "help";
        submit.style.zIndex = this.zIndex;
        this.element.appendChild(submit);

        let item = new HelpItem(submit.id);

        let head = document.createElement("div");
        head.className = "help-head";
        submit.appendChild(head);

        let title = document.createElement("p");
        title.className = "head-title";
        title.textContent = "도움말";
        head.appendChild(title);

        let close = document.createElement("button");
        close.id = "CLOSEBUTTON";
        close.className = "closeButton";
        close.type = "button";
        head.appendChild(close);

        const closeButton = new ImageButton(close.id, "../assets/close.png", this.OnCloseButtonClicked.bind(this), "닫기");

        let description = document.createElement("div");
        description.className = "help-description";
        submit.appendChild(description);

        let descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        let p = document.createElement("p");
        p.className = "bold";
        p.textContent = "문제";
        descriptionItem.appendChild(p);

        let ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        let li = document.createElement("li");
        li.textContent = "펼치기 버튼을 클릭하면 내용을 펼칩니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "접기 버튼을 클릭하면 내용을 접습니다.";
        ul.appendChild(li);

        descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "이미지";
        descriptionItem.appendChild(p);

        ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        li = document.createElement("li");
        li.textContent = "이미지 영역을 클릭하면 파일을 선택할 수 있습니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "삭제 버튼을 클릭하면 선택한 파일을 삭제합니다.";
        ul.appendChild(li);

        descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        let descTitle = document.createElement("div");
        descTitle.className = "item-title";
        descriptionItem.appendChild(descTitle);

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "확대";
        descTitle.appendChild(p);

        let play = document.createElement("a");
        play.id = "EXPANDPLAY";
        play.textContent = "동영상";
        descTitle.appendChild(play);
        play.addEventListener("click", this.OnPlayAnchorClicked.bind(this));

        ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        li = document.createElement("li");
        li.textContent = "이미지를 더블클릭하면 클릭한 위치를 확대합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "Ctrl 키를 누르고 마우스 드래그하면 확대 범위를 설정합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "Esc 키 또는 아무 곳이나 클릭하면 확대된 이미지를 닫습니다.";
        ul.appendChild(li);

        let middleX = this.element.offsetLeft + (this.element.offsetWidth / 2);
        let left = middleX - (submit.offsetWidth / 2);
        let middleY = this.element.offsetTop + (this.element.offsetHeight / 2);
        let top = middleY - (submit.offsetHeight / 2);

        submit.style.left = `${left}px`;
        submit.style.top = `${top}px`;

        this.zIndex++;
    }

    ShowMove() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }

        let view = document.createElement("div");
        view.id = "VIEWHELP";
        view.className = "help";
        view.style.zIndex = this.zIndex;
        this.element.appendChild(view);

        let item = new HelpItem(view.id);

        let head = document.createElement("div");
        head.className = "help-head";
        view.appendChild(head);

        let title = document.createElement("p");
        title.className = "head-title";
        title.textContent = "도움말";
        head.appendChild(title);

        let close = document.createElement("button");
        close.id = "CLOSEBUTTON";
        close.className = "closeButton";
        close.type = "button";
        head.appendChild(close);

        const closeButton = new ImageButton(close.id, "../assets/close.png", this.OnCloseButtonClicked.bind(this), "닫기");

        let description = document.createElement("div");
        description.className = "help-description";
        view.appendChild(description);

        let descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        let p = document.createElement("p");
        p.className = "bold";
        p.textContent = "문제";
        descriptionItem.appendChild(p);

        let ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        let li = document.createElement("li");
        li.textContent = "펼치기 버튼을 클릭하면 내용을 펼칩니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "접기 버튼을 클릭하면 내용을 접습니다.";
        ul.appendChild(li);

        descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        let descTitle = document.createElement("div");
        descTitle.className = "item-title";
        descriptionItem.appendChild(descTitle);

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "확대";
        descTitle.appendChild(p);

        let play = document.createElement("a");
        play.id = "EXPANDPLAY";
        play.textContent = "동영상";
        descTitle.appendChild(play);
        play.addEventListener("click", this.OnPlayAnchorClicked.bind(this));

        ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        li = document.createElement("li");
        li.textContent = "이미지를 더블클릭하면 클릭한 위치를 확대합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "Ctrl 키를 누르고 마우스 드래그하면 확대 범위를 설정합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "Esc 키 또는 아무 곳이나 클릭하면 확대된 이미지를 닫습니다.";
        ul.appendChild(li);

        descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        descTitle = document.createElement("div");
        descTitle.className = "item-title";
        descriptionItem.appendChild(descTitle);

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "피드백/질문";
        descTitle.appendChild(p);

        play = document.createElement("a");
        play.id = "MOVEPLAY";
        play.textContent = "동영상";
        descTitle.appendChild(play);
        play.addEventListener("click", this.OnPlayAnchorClicked.bind(this));

        ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        li = document.createElement("li");
        li.textContent = "피드백(질문) 버튼을 클릭하면 피드백(질문) 항목을 표시합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "항목을 마우스 드래그하면 위치를 이동합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "각 항목을 마우스 드래그로 빼거나 끼웁니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "Esc 키 또는 피드백(질문) 버튼을 다시 클릭하면 항목을 닫습니다.";
        ul.appendChild(li);

        let middleX = this.element.offsetLeft + (this.element.offsetWidth / 2);
        let left = middleX - (view.offsetWidth / 2);
        let middleY = this.element.offsetTop + (this.element.offsetHeight / 2);
        let top = middleY - (view.offsetHeight / 2);

        view.style.left = `${left}px`;
        view.style.top = `${top}px`;

        this.zIndex++;
    }

    OnCloseButtonClicked() {
        let ground = document.getElementById("HELPGROUND");
        if (ground != null) {
            document.body.removeChild(ground);
        }
    }

    OnPlayAnchorClicked(event) {
        let source;
        if (event.currentTarget.id === "EXPANDPLAY") {
            source = "../assets/helpExpand.mp4";
        }
        else if (event.currentTarget.id === "MOVEPLAY") {
            source = "../assets/helpMove.mp4";
        }

        let video = document.createElement("video");
        video.className = "help-video";
        video.autoplay = true;
        video.loop = true;
        video.title = "클릭하여 닫기";
        this.element.appendChild(video);

        video.addEventListener("click", this.OnVideoPaused.bind(this));

        let videoSource = document.createElement("source");
        videoSource.src = source;
        videoSource.type = "video/mp4";
        video.appendChild(videoSource);
    }

    OnVideoPaused(event) {
        this.element.removeChild(event.currentTarget);
    }
}

class HelpItem {
    constructor(id) {
        this.element = document.getElementById(id);
        this.element.logicalObject = this;
        this.element.addEventListener("mousedown", this.OnItemMousedown);

        DraggableElement.SetElement(id);
    }

    OnItemMousedown() {
        const helpGround = document.getElementById("HELPGROUND").logicalObject;
        this.style.zIndex = helpGround.ZIndex;
        helpGround.zIndex++;
    }
}