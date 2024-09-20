import { CompositeWindow } from "./Window.js";
import { Button, ImageButton } from "./Buttons.js";
import { SolveForm } from "./SolveForm.js";

export class QuestionEditor extends CompositeWindow {
    constructor(id, editor) {
        super(id);

        this.element = editor;
        this.element.logicalObject = this;

        this.addWrapper = document.createElement("div");
        this.addWrapper.className = "questionEditor-addWrapper";
        this.element.appendChild(this.addWrapper);

        let add = document.createElement("button");
        add.id = "ADDQUESTIONBUTTON";
        add.className = "addButton";
        add.type = "button";
        add.textContent = "+";
        add.addEventListener("click", this.OnAddButtonClicked.bind(this));
        this.addWrapper.appendChild(add);

        this.textWrapper = document.createElement("div");
        this.textWrapper.className = "questionEditor-textWrapper";
        this.textWrapper.style.display = "none";
        this.element.appendChild(this.textWrapper);

        let textControl = document.createElement("div");
        textControl.className = "questionEditor-control";
        this.textWrapper.appendChild(textControl);

        let buttonWrapper = document.createElement("div");
        buttonWrapper.className = "control-buttonWrapper";
        textControl.appendChild(buttonWrapper);

        let cancel = document.createElement("button");
        cancel.id = "CANCELQUESTIONBUTTON";
        cancel.className = "cancelButton";
        cancel.type = "button";
        cancel.addEventListener("click", this.OnCancelButtonClicked.bind(this));
        cancel.img = document.createElement("img");
        cancel.img.src = "../assets/close.png";
        cancel.appendChild(cancel.img);
        cancel.title = "취소";
        buttonWrapper.appendChild(cancel);

        let submit = document.createElement("button");
        submit.id = "SUBMITQUESTIONBUTTON";
        submit.className = "submitButton";
        submit.type = "button";
        submit.addEventListener("click", this.OnSubmitButtonClicked.bind(this));
        submit.img = document.createElement("img");
        submit.img.src = "../assets/check.png";
        submit.appendChild(submit.img);
        submit.title = "제출";
        buttonWrapper.appendChild(submit);;

        let textArea = document.createElement("textarea");
        textArea.id = "QUESTIONTEXTAREA";
        textArea.className = "questionEditor-textArea";
        textArea.placeholder = "내용을 입력하세요.";
        textArea.maxLength = 128;
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
        const textArea = document.getElementById("QUESTIONTEXTAREA");
        const content = textArea.value;
        if (content != "") {
            SolveForm.GetInstance().SubmitQuestion(content);
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