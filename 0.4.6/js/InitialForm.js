import { CompositeWindow } from "./Window.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { IndexForm } from "./IndexForm.js";
import { IndexedDB } from "./IndexedDB.js";
import { CourseList } from "./Course.js";
import { StepBook } from "./Step.js";
import { SideBar } from "./SideBar.js";
import { FrameController } from "./FrameController.js";
import { BookmarkCard } from "./Bookmark.js";

export class InitialForm extends CompositeWindow {
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
        if (window.top.initialForm === undefined) {
            window.top.initialForm = new InitialForm("INITIALFORM");
        }
        return window.top.initialForm;
    }

    async OnLoaded() {
        window.top.document.title = "나아 소프트북";

        const requestor = new PhpRequestor();

        // 1. indexedDB를 연다.
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        // 2. 서버에 과정 데이터를 요청한다.
        let courseListObject = await requestor.PostJson("../php/GetAllCourse.php");

        // 3. 과정 목록에 추가한다.
        const courseList = CourseList.GetInstance();
        courseList.SetObject(courseListObject);

        // 4. indexedDB에 과정 목록을 저장한다.
        await indexedDB.Put("CourseList", courseList);

        // 5. 서버에 단계 데이터를 요청한다.
        let stepBookObject = await requestor.PostJson("../php/GetAllStep.php");

        // 6. 단계 책에 추가한다.
        const stepBook = StepBook.GetInstance();
        stepBook.SetObject(stepBookObject, courseList);

        // 7. indexedDB에 단계 책을 저장한다.
        await indexedDB.Put("StepBook", stepBook);

        // 8. 사이드바를 만든다.
        const sideBar = new SideBar("SIDEBAR");
        sideBar.AddTop("나아 소프트북", "INITIALFORM", "../assets/logo.png");
        sideBar.AddSwitchMenu("인사", "ABOUTFORM", "./about.html");
        sideBar.AddSwitchMenu("목표", "GOALFORM", "./goal.html");
        sideBar.AddSwitchMenu("서비스", "SERVICEFORM", "./service.html");
        sideBar.AddSwitchMenu("이벤트", "EVENTFORM", "./event.html");
        //sideBar.AddActionMenu("다락방", this.OnTestSignInMenuClicked.bind(this));
        sideBar.AddControl("CHATBUTTON", "../assets/chat.png", this.OnChatButtonClicked.bind(this), "채팅문의");
        sideBar.AddControl("INSTAGRAMBUTTON", "../assets/instagram.png", this.OnInstagramButtonClicked.bind(this), "인스타그램");

        // 3. iFrame을 끼운다.
        let text = "";
        const bookmarkCard = BookmarkCard.GetInstance();
        if (bookmarkCard.length > 0 && bookmarkCard.grandChildForm === "ABOUTFORM") {
            text = "인사";
        }
        if (bookmarkCard.length > 0 && bookmarkCard.grandChildForm === "GOALFORM") {
            text = "목표";
        }
        else if (bookmarkCard.length > 0 && bookmarkCard.grandChildForm === "SERVICEFORM") {
            text = "서비스";
        }

        if (text === "") {
            const frameController = new FrameController(this);
            frameController.Append("MAINFORM");
        }
        else {
            sideBar.ClickMenuItemByText(text);
        }
        this.Add(sideBar);

        // 9. SideBar를 보여준다.
        setTimeout(sideBar.Show.bind(sideBar), 10);
    }

    OnChatButtonClicked() {
        window.open("https://open.kakao.com/o/spWMY6rg", '_blank');
    }

    OnInstagramButtonClicked() {
        window.open("https://www.instagram.com/naacoaching/", '_blank');
    }

    // OnTestSignInMenuClicked() {
    //     if (MenteeCard.IsExist() === false) {
    //         const requestor = new PhpRequestor();
    //         requestor.Open("POST", "../php/GetMentee.php");
    //         requestor.Ready("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
    //         requestor.Request(this.OnMenteeGot.bind(this),
    //             "emailAddress=" + "test@naa.com");
    //     }
    //     else {
    //         window.location.href = "../attic.php";
    //     }
    // }

    // /***test**********************/
    // OnMenteeGot(event) {
    //     const request = event.target;
    //     if (request.readyState === 4 && request.status === 200) {
    //         let columns = [];
    //         let i = 0;
    //         const scanner = new ColumnScanner(request.responseText);
    //         while (scanner.IsEnd() == false) {
    //             columns[i] = scanner.GetColumn();
    //             i++;
    //             scanner.NextColumn();
    //         }

    //         const menteeCard = MenteeCard.GetInstance();
    //         menteeCard.Write(columns[0], columns[1]);

    //         let jsonText = JSON.stringify(menteeCard);
    //         window.sessionStorage.setItem("MenteeCard", jsonText);

    //         const emailAddress = menteeCard.EmailAddress;

    //         const requestor = new PhpRequestor();
    //         requestor.Open("POST", "../php/GetAllApply.php");
    //         requestor.Ready("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    //         requestor.Request(this.OnAllApplyGot.bind(this),
    //             "emailAddress=" + emailAddress);
    //     }
    // }

    // OnAllApplyGot(event) {
    //     const request = event.target;
    //     if (request.readyState === 4 && request.status === 200) {
    //         if (request.responseText != '') {
    //             const applyCardBook = ApplyCardBook.GetInstance();
    //             let applyCard;
    //             let row;
    //             let columns = [];
    //             let i;
    //             // 행은 <br>, 열은 ;로 구분
    //             let columnScanner;
    //             let rowScanner = new RowScanner(request.responseText);
    //             while (rowScanner.IsEnd() == false) {
    //                 i = 0;
    //                 row = rowScanner.GetRow();
    //                 columnScanner = new ColumnScanner(row);
    //                 while (columnScanner.IsEnd() == false) {
    //                     columns[i] = columnScanner.GetColumn();
    //                     i++;
    //                     columnScanner.NextColumn();
    //                 }

    //                 let isPaid = false;
    //                 if (columns[6] != "") {
    //                     isPaid = true;
    //                 }

    //                 applyCard = new ApplyCard(columns[0], columns[1], columns[2], columns[3], columns[4], columns[5], isPaid);
    //                 applyCardBook.Add(applyCard);
    //                 rowScanner.NextRow();
    //             }

    //             let jsonText = JSON.stringify(applyCardBook);
    //             window.sessionStorage.setItem("ApplyCardBook", jsonText);

    //         }

    //         window.location.href = "../attic.php";
    //     }
    // }
}
