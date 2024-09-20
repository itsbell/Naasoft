import { CompositeWindow } from "../../js/Window.js";
import { Button, ImageButton } from "../../js/Buttons.js";
import { SolveForm } from "./SolveForm.js";

export class AnswerEditor extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.addWrapper = document.createElement("div");
        this.addWrapper.className = "answerEditor-addWrapper";
        this.element.appendChild(this.addWrapper);

        //ANSWEREDITOR1
        let number = this.id.substring(12, this.id.length);

        let add = document.createElement("button");
        add.id = "ADDANSWERBUTTON" + number;
        add.className = "addButton";
        add.type = "button";
        this.addWrapper.appendChild(add);

        const addButton = new Button(add.id, "+", this.OnAddButtonClicked.bind(this));
        this.Add(addButton);

        this.textWrapper = document.createElement("div");
        this.textWrapper.className = "answerEditor-textWrapper";
        this.textWrapper.style.display = "none";
        this.element.appendChild(this.textWrapper);

        let textControl = document.createElement("div");
        textControl.className = "answerEditor-control";
        this.textWrapper.appendChild(textControl);

        let buttonWrapper = document.createElement("div");
        buttonWrapper.className = "control-buttonWrapper";
        textControl.appendChild(buttonWrapper);

        let cancel = document.createElement("button");
        cancel.id = "CANCELANSWERBUTTON" + number;
        cancel.className = "cancelButton";
        cancel.type = "button";
        buttonWrapper.appendChild(cancel);

        const cancelButton = new ImageButton(cancel.id, "../../assets/close.png", this.OnCancelButtonClicked.bind(this), "취소");
        this.Add(cancelButton);

        let submit = document.createElement("button");
        submit.id = "SUBMITANSWERBUTTON" + number;
        submit.className = "submitButton";
        submit.type = "button";
        buttonWrapper.appendChild(submit);

        const submitButton = new ImageButton(submit.id, "../../assets/check.png", this.OnSubmitButtonClicked.bind(this), "제출");
        this.Add(submitButton);

        let textArea = document.createElement("textarea");
        textArea.id = "ANSWERTEXTAREA" + number;
        textArea.className = "answerEditor-textArea";
        textArea.placeholder = "내용을 입력하세요.";
        textArea.addEventListener("keyup", this.OnTextAreaKeyUp.bind(this));
        this.textWrapper.appendChild(textArea);
    }

    RemoveAllItems() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }
    }

    OnAddButtonClicked() {
        this.addWrapper.style.display = "none";

        this.textWrapper.style.display = "flex";
    }

    OnCancelButtonClicked() {
        this.textWrapper.style.display = "none";

        this.addWrapper.style.display = "flex";
    }

    OnSubmitButtonClicked() {
        let number = parseInt(this.id.substring(12, this.id.length), 10);
        const textArea = document.getElementById("ANSWERTEXTAREA" + number);
        const content = textArea.value;
        if (content != "") {
            SolveForm.GetInstance().SubmitAnswer(number, content);
        }
    }

    OnTextAreaKeyUp(event) {
        let textArea = event.target;
        let height = textArea.scrollHeight;
        if (height < 30) {
            height = 30;
        }
        textArea.style.height = height + "px";

        height = 70 + textArea.scrollHeight;
        this.textWrapper.style.height = height + "px";
    }
}