import { CompositeWindow } from "./Window.js";
import { CourseList } from "./Course.js";
import { StepBook } from "./Step.js";
import { MenteeCard } from "./Mentee.js";
import { ApplyBook } from "./Apply.js";
import { PlayShelf } from "./Play.js";
import { BookmarkCard } from "./Bookmark.js";
import { MentoCard } from "./Mento.js";
import { MenteeInfoList } from "./MenteeInfo.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { IndexedDB } from "./IndexedDB.js";
import { SideBar } from "./SideBar.js";
import { DraggableGround } from "./DraggableGround.js";
import { DraggableElement } from "./DraggableElement.js";
import { ImageButton } from "./Buttons.js";
import { IndexForm } from "./IndexForm.js";
import { FrameController } from "./FrameController.js";

export class AtticForm extends CompositeWindow {
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
        if (window.top.atticForm === undefined) {
            window.top.atticForm = new AtticForm("ATTICFORM");
        }
        return window.top.atticForm;
    }

    async OnLoaded() {
        window.top.document.title = "다락방";

        const applyBook = ApplyBook.GetInstance();

        // 2. 사이드바를 만든다.
        const sideBar = new SideBar("SIDEBAR");
        sideBar.AddTop("나아 소프트북", "ATTICFORM", "../assets/logo.png");
        sideBar.AddControl("SIGNOUTBUTTON", "../assets/signOut.png", this.OnSignOutButtonClicked.bind(this), "로그아웃");
        sideBar.AddControl("HELPBUTTON", "../assets/help.png", this.OnHelpButtonClicked.bind(this), "도움말");
        sideBar.AddSwitchMenu("첫 번째 질", "PROGRESSFORM", "./progress.html");
        let index = applyBook.FindCurrentCard();
        if (index != -1) {
            applyBook.Move(index);

            let bookText;
            let applyCard = applyBook.GetAt(index);
            console.log("책번호: " + applyCard.stepNumber); // 두 번째 책 결제 후에 안뜨는 오류 찾기
            switch (parseInt(applyCard.stepNumber, 10)) {
                case 1: bookText = "첫 번째 책"; break;
                case 2: bookText = "두 번째 책"; break;
                case 3: bookText = "세 번째 책"; break;
                case 4: bookText = "네 번째 책"; break;
                case 5: bookText = "다섯 번째 책"; break;
                case 6: bookText = "여섯 번째 책"; break;
                case 7: bookText = "일곱 번째 책"; break;
                case 8: bookText = "여덟 번째 책"; break;
                case 9: bookText = "아홉 번째 책"; break;
                default: break;
            }
            sideBar.AddActionMenu(bookText, this.OnStepMenuClicked.bind(this));
        }
        sideBar.AddSwitchMenu("책갈피", "BOOKMARKFORM", "./bookmark.html");
        sideBar.AddSwitchMenu("성과", "ABILITYFORM", "./ability.html");
        sideBar.AddActionMenu("100MB 삽입", this.On100MBMenuClicked.bind(this));
        sideBar.AddSwitchEdgeMenu("퇴거", "LEAVEFORM", "./leave.html");
        sideBar.AddLocation("다락방", "../assets/logo.png");

        // 3. BookmarkForm(iFrame)을 끼운다.
        let text = "책갈피";
        const bookmarkCard = BookmarkCard.GetInstance();
        if (bookmarkCard.grandChildForm === "PROGRESSFORM") {
            text = "첫 번째 질";
        }
        else if (bookmarkCard.grandChildForm === "ABILITYFORM") {
            text = "성과";
        }
        else if (bookmarkCard.grandChildForm === "LEAVEFORM") {
            text = "퇴거";
        }
        sideBar.ClickMenuItemByText(text);
        this.Add(sideBar);

        // 4. SideBar를 보여준다.
        setTimeout(function () {
            let index = this.Find("SIDEBAR");
            if (index != -1) {
                this.GetAt(index).Show();
            }
        }.bind(this), 10);
    }

    async OnStepMenuClicked() {
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        const bookmarkCard = BookmarkCard.GetInstance();
        bookmarkCard.Correct(0, bookmarkCard.location, "DESKFORM", "STUDYFORM", "", "", 0, 0, 0, 0);
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("DESKFORM");
    }

    async OnSignOutButtonClicked() {
        const menteeCard = MenteeCard.GetInstance();
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
        await requestor.Post("../php/IntegrateMentee.php",
            "emailAddress=" + emailAddress +
            "&applyBook=" + applies + "&playShelf=" + solutionsAndQuestions + "&bookmarkCard=" + bookmark);

        // 1. 업무 객체들을 비운다.
        CourseList.GetInstance().RemoveAll();
        StepBook.GetInstance().RemoveAll();
        menteeCard.RemoveAll();
        applyBook.RemoveAll();
        playShelf.RemoveAll();
        bookmarkCard.RemoveAll();
        MentoCard.GetInstance().RemoveAll();
        MenteeInfoList.GetInstance().RemoveAll();

        // 2. indexedDB를 지운다.
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();
        await indexedDB.Clear();

        // Clear 후 이동하지 않으면 개발자 도구 상에 indexedDB가 비워졌으나
        // 이상하게도 이동하면 비워지지 않는다.
        // await indexedDB.Get("CourseList");
        // 그러나 더더욱 이상하게도 위처럼 Get을 한 번 하고 나서 이동하면 indexedDB가 비워진다.

        // 3. 초기로 이동한다.
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("INITIALFORM");
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

            if (currentId === "BOOKMARKFORM") {
                helpGround.ShowBookmark();
            }
            else if (currentId === "PROGRESSFORM") {
                helpGround.ShowProgress();
            }
            else if (currentId === "ABILITYFORM") {
                helpGround.ShowAbility();
            }
        }
    }

    async On100MBMenuClicked() {
        const requestor = new PhpRequestor;
        let body = "emailAddress=" + MenteeCard.GetInstance().EmailAddress;
        await requestor.Post("../php/MakeBigDataForTest.php", body);
        alert("처리 완료");
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

    ShowBookmark() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }

        let bookmark = document.createElement("div");
        bookmark.id = "BOOKMARKHELP";
        bookmark.className = "help";
        bookmark.style.zIndex = this.zIndex;
        this.element.appendChild(bookmark);

        let item = new HelpItem(bookmark.id);

        let head = document.createElement("div");
        head.className = "help-head";
        bookmark.appendChild(head);

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
        bookmark.appendChild(description);

        let descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        let p = document.createElement("p");
        p.className = "bold";
        p.textContent = "책갈피";
        descriptionItem.appendChild(p);

        let ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        let li = document.createElement("li");
        li.textContent = "책에서 끼워둔 책갈피가 표시됩니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "클릭하면 해당 장으로 이동합니다.";
        ul.appendChild(li);

        descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "활동 이력";
        descriptionItem.appendChild(p);

        ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        li = document.createElement("li");
        li.textContent = "활동 이력이 최신순으로 5개씩 표시됩니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "페이지 번호를 클릭하면 다른 5개를 표시합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "항목을 클릭하면 해당 활동으로 이동합니다.";
        ul.appendChild(li);

        let middleX = this.element.offsetLeft + (this.element.offsetWidth / 2);
        let left = middleX - (bookmark.offsetWidth / 2);
        let middleY = this.element.offsetTop + (this.element.offsetHeight / 2);
        let top = middleY - (bookmark.offsetHeight / 2);

        bookmark.style.left = `${left}px`;
        bookmark.style.top = `${top}px`;

        this.zIndex++;
    }

    ShowProgress() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }

        let progress = document.createElement("div");
        progress.id = "PROGRESSHELP";
        progress.className = "help";
        progress.style.zIndex = this.zIndex;
        this.element.appendChild(progress);

        let item = new HelpItem(progress.id);

        let head = document.createElement("div");
        head.className = "help-head";
        progress.appendChild(head);

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
        progress.appendChild(description);

        let descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        let p = document.createElement("p");
        p.className = "bold";
        p.textContent = "질";
        descriptionItem.appendChild(p);

        let ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        let li = document.createElement("li");
        li.textContent = "현재 질에 속한 책들의 정보가 표시됩니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "교재 버튼을 클릭하면 교재 구매 링크로 이동합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "신청 버튼을 클릭하면 신청 페이지로 이동합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "진행은 현재 신청하여 진행 중인 책을 의미합니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "완료는 학습이 끝난 책을 의미합니다.";
        ul.appendChild(li);

        let middleX = this.element.offsetLeft + (this.element.offsetWidth / 2);
        let left = middleX - (progress.offsetWidth / 2);
        let middleY = this.element.offsetTop + (this.element.offsetHeight / 2);
        let top = middleY - (progress.offsetHeight / 2);

        progress.style.left = `${left}px`;
        progress.style.top = `${top}px`;

        this.zIndex++;
    }

    ShowAbility() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }

        let ability = document.createElement("div");
        ability.id = "ABILITYHELP";
        ability.className = "help";
        ability.style.zIndex = this.zIndex;
        this.element.appendChild(ability);

        let item = new HelpItem(ability.id);

        let head = document.createElement("div");
        head.className = "help-head";
        ability.appendChild(head);

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
        ability.appendChild(description);

        let descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        let p = document.createElement("p");
        p.className = "bold";
        p.textContent = "능력 평가";
        descriptionItem.appendChild(p);

        let ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        let li = document.createElement("li");
        li.textContent = "멘토가 평가한 각 능력 점수가 표시됩니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "파란색 막대는 현재까지 평가된 평균 점수입니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "초록색 막대는 1번째 전까지 평가된 평균 점수입니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "노란색 막대는 2번째 전까지 평가된 평균 점수입니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "회색 막대는 해당 능력이 평가된 적 없음을 의미합니다.";
        ul.appendChild(li);

        descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "이전 책";
        descriptionItem.appendChild(p);

        ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        li = document.createElement("li");
        li.textContent = "보기 버튼을 클릭하면 이전 책에서 올렸던 모든 풀이들을 확인할 수 있습니다.";
        ul.appendChild(li);

        let middleX = this.element.offsetLeft + (this.element.offsetWidth / 2);
        let left = middleX - (ability.offsetWidth / 2);
        let middleY = this.element.offsetTop + (this.element.offsetHeight / 2);
        let top = middleY - (ability.offsetHeight / 2);

        ability.style.left = `${left}px`;
        ability.style.top = `${top}px`;

        this.zIndex++;
    }

    OnCloseButtonClicked() {
        let ground = document.getElementById("HELPGROUND");
        if (ground != null) {
            document.body.removeChild(ground);
        }
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