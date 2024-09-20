import { CompositeWindow } from "../../js/Window.js";
import { MenteeCard } from "../../js/Mentee.js";
import { SideBar } from "../../js/SideBar.js";
import { IndexForm } from "../../js/IndexForm.js";
import { FrameController } from "../../js/FrameController.js";

export class DeskForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.isPassing = false;

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.deskForm === undefined) {
            window.top.deskForm = new DeskForm("MENTODESKFORM");
        }
        return window.top.deskForm;
    }

    OnLoaded() {
        window.top.sessionStorage.setItem("PageId", this.id);

        const menteeCard = MenteeCard.GetInstance();

        window.top.document.title = menteeCard.name;

        // 3. 사이드바를 만든다.
        const sideBar = new SideBar("SIDEBAR");
        sideBar.AddTop("멘토", "MENTOATTICFORM", "../../assets/logo.png");
        sideBar.AddControl("UPBUTTON", "../../assets/up.png", this.OnUpButtonClicked.bind(this), "뒤로가기");
        sideBar.AddSwitchMenu("진행", "PROGRESSFORM", "./progress.html");
        sideBar.AddSwitchMenu("성과", "ABILITYFORM", "./ability.html");
        this.Add(sideBar);
        sideBar.ClickMenuItem(0);

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