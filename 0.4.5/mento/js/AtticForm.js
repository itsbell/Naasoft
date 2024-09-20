import { CompositeWindow } from "../../js/Window.js";
import { CourseList } from "../../js/Course.js";
import { StepBook } from "../../js/Step.js";
import { MenteeCard } from "../../js/Mentee.js";
import { ApplyBook } from "../../js/Apply.js";
import { PlayShelf } from "../../js/Play.js";
import { BookmarkCard } from "../../js/Bookmark.js";
import { MentoCard } from "../../js/Mento.js";
import { MenteeInfoList } from "../../js/MenteeInfo.js";
import { IndexedDB } from "../../js/IndexedDB.js";
import { SideBar } from "../../js/SideBar.js";
import { IndexForm } from "../../js/IndexForm.js";
import { FrameController } from "../../js/FrameController.js";

export class AtticForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.atticForm === undefined) {
            window.top.atticForm = new AtticForm("MENTOATTICFORM");
        }
        return window.top.atticForm;
    }

    OnLoaded() {
        window.top.sessionStorage.setItem("PageId", this.id);

        window.top.document.title = "멘토";

        // 5. 사이드바를 만든다.
        const sideBar = new SideBar("SIDEBAR");
        sideBar.AddTop("멘토", "MENTOATTICFORM", "../../assets/logo.png");
        sideBar.AddControl("SIGNOUTBUTTON", "../../assets/signOut.png", this.OnSignOutButtonClicked.bind(this), "로그아웃");
        sideBar.AddSwitchMenu("책갈피", "BOOKMARKFORM", "./bookmark.html");
        sideBar.AddSwitchMenu("멘티", "MENTEEFORM", "./mentee.html");
        sideBar.AddLocation("다락방/멘토", "../../assets/logo.png");
         sideBar.ClickMenuItem(0);
        this.Add(sideBar);

        setTimeout(function () {
            let index = this.Find("SIDEBAR");
            if (index != -1) {
                this.GetAt(index).Show();
            }
        }.bind(this), 10);
    }

    async OnSignOutButtonClicked() {
        // 1. 업무 객체들을 비운다.
        CourseList.GetInstance().RemoveAll();
        StepBook.GetInstance().RemoveAll();
        MenteeCard.GetInstance().RemoveAll();
        ApplyBook.GetInstance().RemoveAll();
        PlayShelf.GetInstance().RemoveAll();
        BookmarkCard.GetInstance().RemoveAll();
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
        window.top.sessionStorage.removeItem("PageId");
        
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("INITIALFORM");
    }
}