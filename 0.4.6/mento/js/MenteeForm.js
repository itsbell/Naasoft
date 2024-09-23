import { CompositeWindow } from "../../js/Window.js";
import { MenteeInfoList } from "../../js/MenteeInfo.js";
import { CourseList } from "../../js/Course.js";
import { StepBook } from "../../js/Step.js";
import { MenteeCard } from "../../js/Mentee.js";
import { ApplyBook } from "../../js/Apply.js";
import { PlayShelf } from "../../js/Play.js";
import { PhpRequestor } from "../../js/PhpRequestor.js";
import { IndexedDB } from "../../js/IndexedDB.js";
import { Table, Tr, Td } from "../../js/Table.js";
import { Button } from "../../js/Buttons.js";
import { IndexForm } from "../../js/IndexForm.js";
import { FrameController } from "../../js/FrameController.js";

export class MenteeForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["MENTEEFORM"] === undefined) {
            window.top.forms["MENTEEFORM"] = new MenteeForm("MENTEEFORM");
        }
        return window.top.forms["MENTEEFORM"];
    }

    async OnLoaded() {
        const menteeInfoList = MenteeInfoList.GetInstance();

        // 1. indexedDB를 연다.
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        // 2. 서버에 멘티 정보 데이터를 요청한다.
        const requestor = new PhpRequestor();
        let menteeInfoListObject = await requestor.PostJson("../../php/GetAllMenteeInfo.php");

        // 3. 멘티 정보 목록에 추가한다.
        menteeInfoList.SetObject(menteeInfoListObject);

        // 4. indexedDB에 멘티 정보 목록을 저장한다.
        indexedDB.Put("MenteeInfoList", menteeInfoList);

        // 5. 전체 멘티 목록을 만든다.
        const pastTable = document.getElementById("MENTEETABLE");
        const table = new Table("MENTEETABLE");
        this.Add(table);
        let trElement;
        let tr;
        let tdElement;
        let td;
        let j;
        let columnCount = 5;
        let buttonElement;
        let button;
        let menteeInfo;
        let i = 0;
        while (i < menteeInfoList.length) {
            menteeInfo = menteeInfoList.GetAt(i);
            trElement = document.createElement("tr");
            trElement.id = "TR" + i;
            trElement.className = "contentBox";
            pastTable.appendChild(trElement);
            tr = new Tr("TR" + i);
            table.Add(tr);

            j = 1;
            while (j <= columnCount) {
                tdElement = document.createElement("td");
                tdElement.id = "TR" + i + "TD" + j;
                tdElement.className = "menteeColumn";
                trElement.appendChild(tdElement);
                td = new Td("TR" + i + "TD" + j);
                tr.Add(td);

                switch (j) {
                    case 1: tdElement.textContent = (i + 1); break;
                    case 2: tdElement.textContent = menteeInfo.name; break;
                    case 3: tdElement.textContent = menteeInfo.emailAddress; break;
                    case 4:
                        tdElement.textContent =
                            (menteeInfo.stepNumber != '') ? (menteeInfo.stepNumber + "단계") : ("손님");
                        break;
                    case 5:
                        buttonElement = document.createElement("button");
                        buttonElement.id = "VIEWBUTTON" + (i + 1);
                        buttonElement.className = "viewButton";
                        tdElement.appendChild(buttonElement);
                        button = new Button(buttonElement.id, "보기", this.OnViewButtonClicked.bind(this));
                        table.windows[i].windows[j - 1].Add(button);
                        break;
                    default: break;
                }
                j++;
            }
            i++;
        }

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    async OnViewButtonClicked(event) {
        const courseList = CourseList.GetInstance();
        const stepBook = StepBook.GetInstance();
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();
        const playShelf = PlayShelf.GetInstance();
        const menteeInfoList = MenteeInfoList.GetInstance();
        
        // 1. 멘티 카드에서 지운다.
        menteeCard.RemoveAll();
        // 2. 신청 책에서 지운다.
        applyBook.RemoveAll();
        // 3. 놀이 책장에서 지운다.
        playShelf.RemoveAll();
        
        // 4. indexedDB를 연다.
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        // 5. 서버에 멘티 데이터를 요청한다.
        const id = event.target.id;
        const number = parseInt(id.substring(10, id.length), 10);
        const menteeInfo = menteeInfoList.GetAt(number - 1);
        
        let body = "emailAddress=" + menteeInfo.emailAddress;

        const requestor = new PhpRequestor();
        let menteeCardObject = await requestor.PostJson("../../php/GetMentee.php", body);

        // 6. 멘티 카드에 추가한다.
        menteeCard.SetObject(menteeCardObject);

        // 7. indexedDB에 멘티 카드를 저장한다.
        await indexedDB.Put("MenteeCard", menteeCard);

        // 8. 서버에 신청 데이터를 요청한다.
        const applyBookObject = await requestor.PostJson("../../php/GetAllApply.php", body);

        // 9. 신청 책에 추가한다.
        applyBook.SetObject(applyBookObject, courseList, stepBook);

        // 10. indexedDB에 신청 책을 저장한다.
        await indexedDB.Put("ApplyBook", applyBook);

        // 11. 멘토 책상으로 이동한다.
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("MENTODESKFORM");
    }
}