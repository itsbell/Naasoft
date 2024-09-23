import { CompositeWindow } from "./Window.js";
import { StepBook } from "./Step.js";
import { ApplyBook } from "./Apply.js";
import { Table, Tr, Td } from "./Table.js"
import { Button } from "./Buttons.js";
import { IndexForm } from "./IndexForm.js";
import { PlayShelf } from "./Play.js";

export class ProgressForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["PROGRESSFORM"] === undefined) {
            window.top.forms["PROGRESSFORM"] = new ProgressForm("PROGRESSFORM");
        }
        return window.top.forms["PROGRESSFORM"];
    }

    OnLoaded() {
        const playShelf = PlayShelf.GetInstance();
        const playCase = playShelf.GetAt(playShelf.current);
        playCase.Reset();

        // StepTable을 만든다. (항목 추가 포함)
        const stepBook = StepBook.GetInstance();
        const applyBook = ApplyBook.GetInstance();

        const stepTable = document.createElement("table");
        stepTable.id = "STEPTABLE";
        stepTable.className = "stepTable";

        let section = document.getElementById("STEP");
        section.appendChild(stepTable);

        const table = new Table("STEPTABLE");
        this.Add(table);

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
                button = new Button("TR" + i + "TD" + 6 + "BUTTON" + i, "완료", this.OnCompleteButtonClicked.bind(this));
                table.windows[i].windows[5].Add(button);
            }
            else if (i === current && applyCard.state === "ALIVE") {
                tdElement = document.getElementById("TR" + i + "TD" + 6);
                buttonElement = document.createElement("button");
                buttonElement.id = "TR" + i + "TD" + 6 + "BUTTON" + i;
                buttonElement.className = "completeButton";
                tdElement.appendChild(buttonElement);
                button = new Button("TR" + i + "TD" + 6 + "BUTTON" + i, "진행", this.OnProgressButtonClicked.bind(this));
                table.windows[i].windows[5].Add(button);
            }
            else {
                tdElement = document.getElementById("TR" + i + "TD" + 5);
                buttonElement = document.createElement("button");
                buttonElement.id = "TR" + i + "TD" + 5 + "BUTTON" + i;
                buttonElement.className = "applyButton";
                tdElement.appendChild(buttonElement);
                button = new Button("TR" + i + "TD" + 5 + "BUTTON" + i, "교재", this.OnBuyingBookButtonClicked);
                table.windows[i].windows[5].Add(button);

                tdElement = document.getElementById("TR" + i + "TD" + 6);
                buttonElement = document.createElement("button");
                buttonElement.id = "TR" + i + "TD" + 6 + "BUTTON" + i;
                buttonElement.className = "button applyButton";
                tdElement.appendChild(buttonElement);
                button = new Button("TR" + i + "TD" + 6 + "BUTTON" + i, "신청", this.OnApplyButtonClicked.bind(this));
                table.windows[i].windows[5].Add(button);
            }
            i++;
        }
        if (applyBook.length === 0) {
            tdElement = document.getElementById("TR" + i + "TD" + 5);
            buttonElement = document.createElement("button");
            buttonElement.id = "TR" + i + "TD" + 5 + "BUTTON" + i;
            buttonElement.className = "applyButton";
            tdElement.appendChild(buttonElement);
            button = new Button("TR" + i + "TD" + 5 + "BUTTON" + i, "교재", this.OnBuyingBookButtonClicked);
            table.windows[i].windows[5].Add(button);

            tdElement = document.getElementById("TR" + i + "TD" + 6);
            buttonElement = document.createElement("button");
            buttonElement.id = "TR" + i + "TD" + 6 + "BUTTON" + i;
            buttonElement.className = "applyButton";
            tdElement.appendChild(buttonElement);
            button = new Button("TR" + i + "TD" + 6 + "BUTTON" + i, "신청", this.OnApplyButtonClicked.bind(this));
            table.windows[i].windows[5].Add(button);

            i++;
        }

        j = i;
        while (j < stepList.length) {
            tdElement = document.getElementById("TR" + j + "TD" + 5);
            buttonElement = document.createElement("button");
            buttonElement.id = "TR" + j + "TD" + 5 + "BUTTON" + j;
            buttonElement.className = "applyButton";
            tdElement.appendChild(buttonElement);
            button = new Button("TR" + j + "TD" + 5 + "BUTTON" + j, "교재", this.OnBuyingBookButtonClicked);
            table.windows[j].windows[5].Add(button);

            tdElement = document.getElementById("TR" + j + "TD" + 6);
            buttonElement = document.createElement("button");
            buttonElement.id = "TR" + j + "TD" + 6 + "BUTTON" + j;
            buttonElement.className = "button applyButton";
            if (j > i || !(i - 1 < current || (i - 1 === current && applyCard.state === "DEAD"))) {
                buttonElement.disabled = "true";
            }
            tdElement.appendChild(buttonElement);
            button = new Button("TR" + j + "TD" + 6 + "BUTTON" + j, "신청", this.OnApplyButtonClicked.bind(this));
            table.windows[j].windows[5].Add(button);

            j++;
        }

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    OnBuyingBookButtonClicked() {
        const tr = this.parentElement.parentElement;
        const content = tr.children[0].textContent;

        let link;
        let num = parseInt(content.match(/\d+/g));

        switch (num) {
            case 1: link = "https://product.kyobobook.co.kr/detail/S000001615791"; break;
            case 2: link = "https://product.kyobobook.co.kr/detail/S000001615792"; break;
            case 3: link = "https://product.kyobobook.co.kr/detail/S000001615793"; break;
            case 4: link = "https://product.kyobobook.co.kr/detail/S000001959832"; break;
            case 5: link = "https://product.kyobobook.co.kr/detail/S000001959833"; break;
            case 6: link = "https://product.kyobobook.co.kr/detail/S000001959834"; break;
            case 7: link = "https://product.kyobobook.co.kr/detail/S000001959835"; break;
            case 8: link = "https://product.kyobobook.co.kr/detail/S000001959836"; break;
            case 9: link = "https://product.kyobobook.co.kr/detail/S000001959837"; break;
            default: break;
        }

        window.open(link);
    }

    OnApplyButtonClicked() {
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("APPLYFORM");
    }

    OnCompleteButtonClicked() {
        // alert("완료한 단계(권)의 풀이 목록 보여주기");
    }
    OnProgressButtonClicked() {
        // alert("연장 버튼으로 변경하기?");
    }
}