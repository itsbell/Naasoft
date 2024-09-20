import { CompositeWindow } from "./Window.js";
import { SideBar } from "./SideBar.js";
import { ApplyBook } from "./Apply.js";
import { DraggableGround } from "./DraggableGround.js";
import { DraggableElement } from "./DraggableElement.js";
import { ImageButton } from "./Buttons.js";
import { IndexForm } from "./IndexForm.js";
import { BookmarkCard } from "./Bookmark.js";
import { FrameController } from "./FrameController.js";

export class DeskForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.deskForm === undefined) {
            window.top.deskForm = new DeskForm("DESKFORM");
        }
        return window.top.deskForm;
    }

    OnLoaded() {
        window.top.sessionStorage.setItem("PageId", this.id);

        const applyBook = ApplyBook.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();
        let index = applyBook.FindCurrentCard();
        const applyCard = applyBook.GetAt(index);
        const stepNumber = applyCard.stepNumber;

        // 1. 사이드바를 만든다.
        window.top.document.title = stepNumber + "단계";
        const factory = new DeskFormSideBarLoaderFactory(this);
        const loader = factory.Make(stepNumber);
        if (loader != null) {
            loader.Load();
        }

        // 2. StudyForm(iFrame)을 끼운다.
        index = this.Find("SIDEBAR");
        if (index != -1) {
            let sideBar = this.GetAt(index);
            let menu = "살펴보기";
            if (bookmarkCard.chapterNumber > 0) {
                menu = `${bookmarkCard.chapterNumber}장`;
            }
            let i = 0;
            while (i < sideBar.list.children.length && menu != sideBar.list.children[i].textContent) {
                i++;
            }
            if (i < sideBar.list.children.length) {
                sideBar.SelectMenuItem(i);
            }
        }

        // 3. SideBar를 보여준다.
        setTimeout(function () {
            let index = this.Find("SIDEBAR");
            if (index != -1) {
                this.GetAt(index).Show();
            }
        }.bind(this), 30);
    }

    OnUpButtonClicked() {
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("ATTICFORM");
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

            if (currentId === "STUDYFORM") {
                helpGround.ShowStudy();
            }
        }
    }
}

class DeskFormSideBarLoaderFactory {
    constructor(deskForm) {
        this.deskForm = deskForm;
    }

    Make(stepNumber) {
        let loader = null;

        if (stepNumber == 1) {
            loader = new Step1DeskFormSideBarLoader(this.deskForm);
        }
        else if (stepNumber == 2) {
            loader = new Step2DeskFormSideBarLoader(this.deskForm);
        }
        else if (stepNumber == 3) {
            loader = new Step3DeskFormSideBarLoader(this.deskForm);
        }

        return loader;
    }
}

class DeskFormSideBarLoader {
    constructor(deskForm) {
        this.deskForm = deskForm;
    }

    Load() {

    }
}

class Step1DeskFormSideBarLoader extends DeskFormSideBarLoader {
    constructor(deskForm) {
        super(deskForm);
    }

    Load() {
        const sideBar = new SideBar("SIDEBAR");

        sideBar.AddTop("나아 소프트북", "ATTICFORM", "../assets/logo.png");
        sideBar.AddControl("UPBUTTON", "../assets/up.png", this.deskForm.OnUpButtonClicked.bind(this.deskForm), "뒤로가기");
        sideBar.AddControl("HELPBUTTON", "../assets/help.png", this.deskForm.OnHelpButtonClicked.bind(this.deskForm), "도움말");
        const target = "./study.html";
        sideBar.AddSwitchMenu("살펴보기", "STUDYFORM", target);
        sideBar.AddSwitchMenu("1장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("2장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("3장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("4장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("5장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("6장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("7장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("8장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("9장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("10장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("11장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("12장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("13장", "STUDYFORM", target);

        this.deskForm.Add(sideBar);
        sideBar.SelectMenuItem(0);
    }
}

class Step2DeskFormSideBarLoader extends DeskFormSideBarLoader {
    constructor(deskForm) {
        super(deskForm);
    }

    Load() {
        const sideBar = new SideBar("SIDEBAR");

        sideBar.AddTop("나아 소프트북", "ATTICFORM", "../assets/logo.png");
        sideBar.AddControl("UPBUTTON", "../assets/up.png", this.deskForm.OnUpButtonClicked.bind(this.deskForm), "뒤로가기");
        sideBar.AddControl("HELPBUTTON", "../assets/help.png", this.deskForm.OnHelpButtonClicked.bind(this.deskForm), "도움말");
        const target = "./study.html";
        sideBar.AddSwitchMenu("살펴보기", "STUDYFORM", target);
        sideBar.AddSwitchMenu("1장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("2장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("3장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("4장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("5장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("6장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("7장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("8장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("9장", "STUDYFORM", target);

        this.deskForm.Add(sideBar);
        sideBar.SelectMenuItem(0);
    }
}

class Step3DeskFormSideBarLoader extends DeskFormSideBarLoader {
    constructor(deskForm) {
        super(deskForm);
    }

    Load() {
        const sideBar = new SideBar("SIDEBAR");

        sideBar.AddTop("나아 소프트북", "ATTICFORM", "../assets/logo.png");
        sideBar.AddControl("UPBUTTON", "../assets/up.png", this.deskForm.OnUpButtonClicked.bind(this.deskForm), "뒤로가기");
        sideBar.AddControl("HELPBUTTON", "../assets/help.png", this.deskForm.OnHelpButtonClicked.bind(this.deskForm), "도움말");
        const target = "./study.html";
        sideBar.AddSwitchMenu("살펴보기", "STUDYFORM", target);
        sideBar.AddSwitchMenu("1장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("2장", "STUDYFORM", target);
        sideBar.AddSwitchMenu("3장", "STUDYFORM", target);

        this.deskForm.Add(sideBar);
        sideBar.SelectMenuItem(0);
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

    ShowStudy() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }

        let study = document.createElement("div");
        study.id = "STUDYHELP";
        study.className = "help";
        study.style.zIndex = this.zIndex;
        this.element.appendChild(study);

        let item = new HelpItem(study.id);

        let head = document.createElement("div");
        head.className = "help-head";
        study.appendChild(head);

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
        study.appendChild(description);

        let descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        let p = document.createElement("p");
        p.className = "bold";
        p.textContent = "사이드바";
        descriptionItem.appendChild(p);

        let ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        let li = document.createElement("li");
        li.textContent = "교재의 각 장에 맞는 공부법이 제시됩니다.";
        ul.appendChild(li);

        li = document.createElement("li");
        li.textContent = "사이드바 메뉴를 클릭하면 장을 이동합니다.";
        ul.appendChild(li);

        descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "책갈피";
        descriptionItem.appendChild(p);

        ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        li = document.createElement("li");
        li.textContent = "책갈피 버튼을 클릭하면 현재 장에 책갈피를 끼웁니다.";
        ul.appendChild(li);

        descriptionItem = document.createElement("div");
        descriptionItem.className = "description-item";
        description.appendChild(descriptionItem);

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "문제";
        descriptionItem.appendChild(p);

        ul = document.createElement("ul");
        descriptionItem.appendChild(ul);

        li = document.createElement("li");
        li.textContent = "문제 버튼을 클릭하면 내 풀이를 발표할 수 있습니다.";
        ul.appendChild(li);

        let middleX = this.element.offsetLeft + (this.element.offsetWidth / 2);
        let left = middleX - (study.offsetWidth / 2);
        let middleY = this.element.offsetTop + (this.element.offsetHeight / 2);
        let top = middleY - (study.offsetHeight / 2);

        study.style.left = `${left}px`;
        study.style.top = `${top}px`;

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