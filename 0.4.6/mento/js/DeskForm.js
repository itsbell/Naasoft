import { CompositeWindow } from "../../js/Window.js";
import { MenteeCard } from "../../js/Mentee.js";
import { SideBar } from "../../js/SideBar.js";
import { IndexForm } from "../../js/IndexForm.js";
import { FrameController } from "../../js/FrameController.js";
import { BookmarkCard } from "../../js/Bookmark.js";

export class DeskForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.isPassing = false;

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["MENTODESKFORM"] === undefined) {
            window.top.forms["MENTODESKFORM"] = new DeskForm("MENTODESKFORM");
        }
        return window.top.forms["MENTODESKFORM"];
    }

    OnLoaded() {
        const menteeCard = MenteeCard.GetInstance();
        window.top.document.title = menteeCard.name;

        // 3. 사이드바를 만든다.
        const sideBar = new SideBar("SIDEBAR");
        sideBar.AddTop("멘토", "MENTOATTICFORM", "../../assets/logo.png");
        sideBar.AddControl("UPBUTTON", "../../assets/up.png", this.OnUpButtonClicked.bind(this), "뒤로가기");
        sideBar.AddSwitchMenu("진행", "MENTOPROGRESSFORM", "./progress.html");
        sideBar.AddSwitchMenu("성과", "MENTOABILITYFORM", "./ability.html");

        let text = "진행";
        const bookmarkCard = BookmarkCard.GetInstance();
        if (bookmarkCard.length > 0 && bookmarkCard.grandChildForm === "MENTOABILITYFORM") {
            text = "성과";
        }
        sideBar.ClickMenuItemByText(text);

        this.Add(sideBar);

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
        frameController.Change("MENTOATTICFORM");
    }
}