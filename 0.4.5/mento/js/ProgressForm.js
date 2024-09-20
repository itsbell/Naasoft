import { CompositeWindow } from "../../js/Window.js";
import { CourseList } from "../../js/Course.js";
import { StepBook } from "../../js/Step.js";
import { MenteeCard } from "../../js/Mentee.js";
import { ApplyBook, ApplyCard, Apply } from "../../js/Apply.js";
import { PhpRequestor } from "../../js/PhpRequestor.js";
import { IndexedDB } from "../../js/IndexedDB.js";
import { Table, Tr, Td } from "../../js/Table.js"
import { Button } from "../../js/Buttons.js";

export class ProgressForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));

        this.isPaying = false;
        this.courseName = null;
        this.stepNumber = null;
    }

    static GetInstance() {
        if (window.top.forms["PROGRESSFORM"] === undefined) {
            window.top.forms["PROGRESSFORM"] = new ProgressForm("PROGRESSFORM");
        }
        return window.top.forms["PROGRESSFORM"];
    }

    async DoPayment() {
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();

        // 5. 서버에 결제 추가를 요청한다.
        const applyCard = applyBook.GetAt(applyBook.length - 1); // 무조건 하나 이상 있음.
        if (applyCard.isPaid === false) {
            let orderId = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
            const charactersLength = characters.length;
            let count = 0;
            while (count < charactersLength) {
                orderId += characters.charAt(Math.floor(Math.random() * charactersLength));
                count += 1;
            }
            // let orderName = this.courseName + " " + this.stepNumber + "단계";
            let orderName = this.stepNumber + "단계";
            let price = this.stepPrice;

            applyCard.Pay(DateTime.Now()); // TODO: 서버 시간으로 바꾸기

            // 3.8. indexedDB에 신청 책을 저장한다.
            await indexedDB.Put("ApplyBook", applyBook);

            // 3.9. 서버에 결제 추가를 요청한다.
            const emailAddress = menteeCard.emailAddress;
            const requestor = new PhpRequestor();
            await requestor.Post("../php/InsertPayment.php",
                "emailAddress=" + emailAddress + "&orderId=" + orderId +
                "&orderName=" + orderName + "&price=" + price);

            const stepTableManager = new StepTableManager(this);
            stepTableManager.Destroy();
            stepTableManager.Create();
        }
        else {
            alert("오류: 이미 결제됨");
        }
    }

    OnLoaded() {
        const stepBook = StepBook.GetInstance();
        const applyBook = ApplyBook.GetInstance();

        let courseIndex = 0;
        let stepIndex = 0;
        let stepCard;
        if (applyBook.length > 0) {
            const applyCard = applyBook.GetAt(applyBook.length - 1);
            const currentCourseName = applyCard.courseName;
            const currentStepNumber = applyCard.stepNumber;
            if (applyCard.isPaid === false) {
                courseIndex = stepBook.Find(currentCourseName);
                if (courseIndex != -1) {
                    stepCard = stepBook.GetAt(courseIndex);
                    stepIndex = stepCard.Find(currentStepNumber);
                }
            }
            else {
                courseIndex = stepBook.Find(currentCourseName);
                if (courseIndex != -1) {
                    stepCard = stepBook.GetAt(courseIndex);
                    stepIndex = stepCard.Find(currentStepNumber + 1);
                    if (stepIndex == -1) {
                        courseIndex++;
                        stepIndex = 0;
                    }
                }
            }

            if (courseIndex == -1 || stepIndex == -1) {
                courseIndex = 0;
                stepIndex = 0;
            }
        }
        stepCard = stepBook.GetAt(courseIndex);
        let step = stepCard.GetAt(stepIndex);
        this.courseName = stepCard.courseName;
        this.stepNumber = step.number;
        this.stepPrice = Math.floor(step.price);

        const stepTableManager = new StepTableManager(this);
        stepTableManager.Create();
    }

    async OnApplyButtonClicked(event) {
        const courseList = CourseList.GetInstance();
        const stepBook = StepBook.GetInstance();
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();

        let index = applyBook.Find(this.courseName, this.stepNumber);
        if (index == -1) {
            // 1. indexedDB를 연다.
            const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
            await indexedDB.Open();

            // 2. 신청 책에 추가한다.
            // 2.2.1. 과정을 찾는다.
            index = courseList.Find(this.courseName);
            const course = courseList.GetAt(index);
            // 2.2.2. 단계를 찾는다.
            index = stepBook.Find(this.courseName);
            const stepCard = stepBook.GetAt(index);
            index = stepCard.Find(this.stepNumber);
            const step = stepCard.GetAt(index);
            // 2.2.3. 신청 카드를 만든다.
            const applyCard = new ApplyCard(course, step);
            // 2.2.4. 신청을 만든다. TODO: 서버 시간으로 고치기
            const apply = new Apply(DateTime.Now(), "DEAD", false, null, null);
            applyCard.Add(apply);
            // 2.2.5. 추가한다.
            applyBook.Add(applyCard);

            // 3. indexedDB에 신청 책을 저장한다.
            await indexedDB.Put("ApplyBook", applyBook);

            // 4. 서버에 신청 추가를 요청한다.
            const requestor = new PhpRequestor();
            const emailAddress = menteeCard.emailAddress;
            await requestor.Post("../php/InsertApply.php",
                "emailAddress=" + emailAddress
                + "&courseName=" + this.courseName + "&stepNumber=" + this.stepNumber);
        }

        this.DoPayment();
    }

    OnCompleteButtonClicked() {
        alert("완료한 단계(권)의 풀이 목록 보여주기");
    }
    OnProgressButtonClicked() {
        alert("연장 버튼으로 변경하기?");
    }
}

class StepTableManager {
    constructor(form) {
        this.form = form;
    }

    Create() {
        const stepBook = StepBook.GetInstance();
        const applyBook = ApplyBook.GetInstance();

        let section = document.getElementById("STEP");

        const stepTable = document.createElement("table");
        stepTable.id = "STEPTABLE";
        stepTable.className = "stepTable";
        section.appendChild(stepTable);

        const table = new Table("STEPTABLE");
        this.form.Add(table);

        let index = stepBook.Find("다락방 1층");
        let stepList = stepBook.GetAt(index);

        let step;
        let trElement;
        let tr;
        let tdElement;
        let td;
        let j;
        let columnCount = 6;
        let i = 0;
        while (i < stepList.length) {
            step = stepList.GetAt(i);

            trElement = document.createElement("tr");
            trElement.id = "TR" + i;
            trElement.className = "contentBox";
            stepTable.appendChild(trElement);
            tr = new Tr("TR" + i);
            table.Add(tr);

            j = 1;
            while (j <= columnCount) {
                tdElement = document.createElement("td");
                tdElement.id = "TR" + i + "TD" + j;
                tdElement.className = "stepColumn";
                trElement.appendChild(tdElement);
                td = new Td("TR" + i + "TD" + j);
                tr.Add(td);

                switch (j) {
                    case 1: tdElement.textContent = (i + 1) + "권"; break;
                    case 2: tdElement.textContent = step.subject; break;
                    case 3: tdElement.textContent = Math.floor(step.price).toLocaleString("ko-KR", { style: "currency", currency: "KRW" }); break;
                    case 4: tdElement.textContent = step.period + "일"; break;
                    case 5: break;
                    case 6: break;
                    default: break;
                }
                j++;
            }
            i++;
        }

        let buttonElement;
        let button;
        let applyCard;
        let current = applyBook.FindCurrentCard();
        i = 0;
        while (i < applyBook.length) {
            applyCard = applyBook.GetAt(i);
            tdElement = document.getElementById("TR" + i + "TD" + 3);
            tdElement.textContent = applyCard.start.date;
            tdElement = document.getElementById("TR" + i + "TD" + 4);
            tdElement.textContent = applyCard.end.date;

            if (i < current || (i === current && applyCard.state === "DEAD")) {
                tdElement = document.getElementById("TR" + i + "TD" + 6);
                buttonElement = document.createElement("button");
                buttonElement.id = "TR" + i + "TD" + 6 + "BUTTON" + i;
                buttonElement.className = "completeButton";
                tdElement.appendChild(buttonElement);
                button = new Button("TR" + i + "TD" + 6 + "BUTTON" + i, "완료", this.form.OnCompleteButtonClicked.bind(this.form));
                table.windows[i].windows[5].Add(button);
            }
            else if (i === current && applyCard.state === "ALIVE") {
                tdElement = document.getElementById("TR" + i + "TD" + 6);
                buttonElement = document.createElement("button");
                buttonElement.id = "TR" + i + "TD" + 6 + "BUTTON" + i;
                buttonElement.className = "completeButton";
                tdElement.appendChild(buttonElement);
                button = new Button("TR" + i + "TD" + 6 + "BUTTON" + i, "진행", this.form.OnProgressButtonClicked.bind(this.form));
                table.windows[i].windows[5].Add(button);
            }
            else {
                tdElement = document.getElementById("TR" + i + "TD" + 6);
                buttonElement = document.createElement("button");
                buttonElement.id = "TR" + i + "TD" + 6 + "BUTTON" + i;
                buttonElement.className = "button applyButton";
                tdElement.appendChild(buttonElement);
                button = new Button("TR" + i + "TD" + 6 + "BUTTON" + i, "접수", this.form.OnApplyButtonClicked.bind(this.form));
                table.windows[i].windows[5].Add(button);
            }
            i++;
        }
        if (applyBook.length === 0) {
            tdElement = document.getElementById("TR" + i + "TD" + 6);
            buttonElement = document.createElement("button");
            buttonElement.id = "TR" + i + "TD" + 6 + "BUTTON" + i;
            buttonElement.className = "applyButton";
            tdElement.appendChild(buttonElement);
            button = new Button("TR" + i + "TD" + 6 + "BUTTON" + i, "접수", this.form.OnApplyButtonClicked.bind(this.form));
            table.windows[i].windows[5].Add(button);

            i++;
        }

        j = i;
        while (j < stepList.Length) {
            tdElement = document.getElementById("TR" + j + "TD" + 6);
            buttonElement = document.createElement("button");
            buttonElement.id = "TR" + j + "TD" + 6 + "BUTTON" + j;
            buttonElement.className = "button applyButton";
            if (j > i || !(i - 1 < current || (i - 1 === current && applyCard.state === "DEAD"))) {
                buttonElement.disabled = "true";
            }
            tdElement.appendChild(buttonElement);
            button = new Button("TR" + j + "TD" + 6 + "BUTTON" + j, "접수", this.form.OnApplyButtonClicked.bind(this.form));
            table.windows[j].windows[5].Add(button);

            j++;
        }
    }

    Destroy() {
        let index;

        index = this.form.Find("STEPTABLE");
        if (index != -1) {
            const stepTable = this.form.GetAt(index);
            stepTable.Clear();
            this.form.Remove(index);
        }

        let section = document.getElementById("STEP");
        let i = section.children.length - 1;
        while (i >= 0) {
            section.removeChild(section.children[i]);
            i--;
        }
    }
}