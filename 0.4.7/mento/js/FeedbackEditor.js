import { CompositeWindow } from "../../js/Window.js";
import { Button, ImageButton } from "../../js/Buttons.js";
import { RadioControl } from "./RadioControl.js";
import { SolveForm } from "./SolveForm.js";

export class FeedbackEditor extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.addWrapper = document.createElement("div");
        this.addWrapper.className = "feedbackEditor-addWrapper";
        this.element.appendChild(this.addWrapper);

        let add = document.createElement("button");
        add.id = "ADDFEEDBACKBUTTON";
        add.className = "addButton";
        add.type = "button";
        this.addWrapper.appendChild(add);

        const addButton = new Button("ADDFEEDBACKBUTTON", "+", this.OnAddButtonClicked.bind(this));
        this.Add(addButton);

        this.textWrapper = document.createElement("div");
        this.textWrapper.className = "feedbackEditor-textWrapper";
        this.textWrapper.style.display = "none";
        this.element.appendChild(this.textWrapper);

        let textControl = document.createElement("div");
        textControl.className = "feedbackEditor-control";
        this.textWrapper.appendChild(textControl);

        let radioElement = document.createElement("div");
        radioElement.id = "EVALUATERADIO";
        radioElement.className = "radioControl";
        textControl.appendChild(radioElement);

        const radio = new RadioControl("EVALUATERADIO");
        radio.AddItem(0, "선택없음");
        radio.AddItem(-1, "완료");
        radio.AddItem(-2, "평가불가");
        this.Add(radio);

        let buttonWrapper = document.createElement("div");
        buttonWrapper.className = "control-buttonWrapper";
        textControl.appendChild(buttonWrapper);

        let cancel = document.createElement("button");
        cancel.id = "CANCELFEEDBACKBUTTON";
        cancel.className = "cancelButton";
        cancel.type = "button";
        buttonWrapper.appendChild(cancel);

        const cancelButton = new ImageButton("CANCELFEEDBACKBUTTON", "../../assets/close.png", this.OnCancelButtonClicked.bind(this), "취소");
        this.Add(cancelButton);

        let submit = document.createElement("button");
        submit.id = "SUBMITFEEDBACKBUTTON";
        submit.className = "submitButton";
        submit.type = "button";
        buttonWrapper.appendChild(submit);

        const submitButton = new ImageButton("SUBMITFEEDBACKBUTTON", "../../assets/check.png", this.OnSubmitButtonClicked.bind(this), "제출");
        this.Add(submitButton);

        let textArea = document.createElement("textarea");
        textArea.id = "FEEDBACKTEXTAREA";
        textArea.className = "feedbackEditor-textArea";
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

    Set(evaluate) {
        let index = this.Find("EVALUATERADIO");
        if (index != -1) {
            const radio = this.GetAt(index);

            let value = 1;
            let result = evaluate & value;
            if(result > 0){
                radio.AddItem(1, "추");
            }

            value = value << 1;
            result = evaluate & value;
            if(result > 0){
                radio.AddItem(2, "논");
            }

            value = value << 1;
            result = evaluate & value;
            if(result > 0){
                radio.AddItem(3, "문");
            }

            value = value << 1;
            result = evaluate & value;
            if(result > 0){
                radio.AddItem(4, "비");
            }

            value = value << 1;
            result = evaluate & value;
            if(result > 0){
                radio.AddItem(5, "프");
            }

            value = value << 1;
            result = evaluate & value;
            if(result > 0){
                radio.AddItem(6, "디");
            }
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
        let evaluate = null;
        const index = this.Find("EVALUATERADIO");
        if (index != -1) {
            const radioControl = this.GetAt(index);
            evaluate = radioControl.GetValue();
        }

        const textArea = document.getElementById("FEEDBACKTEXTAREA");
        const content = textArea.value;
        if (content != "") {
            SolveForm.GetInstance().SubmitFeedback(evaluate, content);
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