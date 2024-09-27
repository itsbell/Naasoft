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
import { IndexForm } from "./IndexForm.js";
import { FrameController } from "./FrameController.js";

export class LeaveForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["LEAVEFORM"] === undefined) {
            window.top.forms["LEAVEFORM"] = new LeaveForm("LEAVEFORM");
        }
        return window.top.forms["LEAVEFORM"];
    }

    OnLoaded() {
        const playShelf = PlayShelf.GetInstance();
        const playCase = playShelf.GetAt(playShelf.current);
        playCase.Reset();
        
        const leaveButton = document.getElementById("LEAVEBUTTON");
        leaveButton.addEventListener("click", this.OnLeaveButtonClicked.bind(this));

        this.Add(leaveButton);

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    async OnLeaveButtonClicked() {
        let wrapper = document.getElementById("LEAVEWRAPPER");
        let errorMessage = document.getElementById("ERRORMESSAGE");
        if (errorMessage != null) {
            wrapper.removeChild(errorMessage);
        }

        const passwordInput = document.getElementById("PASSWORD");
        const password = passwordInput.value;

        const menteeCard = MenteeCard.GetInstance();
        // 1. 서버에 멘티일치여부 확인을 요청한다.
        const emailAddress = menteeCard.emailAddress;
        const requestor = new PhpRequestor();
        const ret = await requestor.Post("../php/CheckMentee.php",
            "emailAddress=" + emailAddress + "&password=" + password);

        if (ret == "0") {
            // 비밀번호 틀렸음을 알려주는 에러 메시지 출력
            let wrapper = document.getElementById("LEAVEWRAPPER");
            let errorMessage = document.createElement("div");
            errorMessage.id = "ERRORMESSAGE";
            errorMessage.className = "errorMessage";
            errorMessage.innerText = "잘못된 비밀번호입니다.";
            wrapper.appendChild(errorMessage);
        }
        // 2. 멘티이면
        else if (ret == "1") {
            // 2.1. 서버에 멘티 퇴거 요청한다.
            requestor.Post("../php/LeaveMentee.php", "emailAddress=" + emailAddress);
            // 2.2. 업무 객체들을 비운다.
            CourseList.GetInstance().RemoveAll();
            StepBook.GetInstance().RemoveAll();
            MenteeCard.GetInstance().RemoveAll();
            ApplyBook.GetInstance().RemoveAll();
            PlayShelf.GetInstance().RemoveAll();
            BookmarkCard.GetInstance().RemoveAll();
            MentoCard.GetInstance().RemoveAll();
            MenteeInfoList.GetInstance().RemoveAll();

            // 2.3. indexedDB를 지운다.
            const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
            await indexedDB.Open();
            await indexedDB.Clear();

            // 2.4. 초기로 이동한다.
            const indexForm = IndexForm.GetInstance();
            const frameController = new FrameController(indexForm);
            frameController.Change("INITIALFORM");
        }
    }
}