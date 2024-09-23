import { CompositeWindow } from "./Window.js";
import { QuestionEditor } from "./QuestionEditor.js";
import { DraggableGround } from "./DraggableGround.js";
import { DraggableElement } from "./DraggableElement.js";

export class QnAView extends CompositeWindow {
    constructor(id, isCurrent) {
        super(id);

        this.isCurrent = isCurrent;
        this.toggle = false;

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
        this.element.style.display = "none";

        this.element.tabIndex = -1; // enable focus = enable key action
        this.element.addEventListener("keyup", this.OnKeyUp.bind(this));

        DraggableGround.SetElement(id);
        
        let QnAElement = document.createElement("div");
        QnAElement.id = "QNAITEM";
        QnAElement.className = "QnA";
        this.element.appendChild(QnAElement);
        
        DraggableElement.SetElement("QNAITEM");

        let head = document.createElement("div");
        head.className = "QNAView-head";
        QnAElement.appendChild(head);

        let sectionName = document.createElement("div");
        sectionName.className = "QNAView-head-sectionName";
        sectionName.textContent = "질문/답변";
        head.appendChild(sectionName);

        let body = document.createElement("div");
        body.className = "QNAView-body";
        QnAElement.appendChild(body);

        this.list = document.createElement("ul");
        this.list.className = "QNAView-body-list";
        body.appendChild(this.list);

        let editor = document.createElement("div");
        editor.id = "QUESTIONEDITOR";
        editor.className = "questionEditor";
        body.appendChild(editor);

        const questionEditor = new QuestionEditor("QUESTIONEDITOR");
        this.Add(questionEditor);
    }

    OnKeyUp(event) {
        if(event.key === "Escape"){
            this.Hide();
        }
    }

    get Toggle() {
        return this.toggle;
    }

    RemoveAllItems() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }
    }

    AddQuestion(text) {
        let item = document.createElement("li");
        item.className = "QNAView-body-list-item-question";
        this.list.appendChild(item);

        let head = document.createElement("div");
        head.className = "QNAView-body-list-item-head"
        head.textContent = "질문";
        item.appendChild(head);

        let body = document.createElement("div");
        body.className = "QNAView-body-list-item-body";
        body.textContent = text;
        item.appendChild(body);

        return this.list.children.length - 1;
    }

    AddAnswer(text) {
        let item = document.createElement("li");
        item.className = "QNAView-body-list-item-answer";
        this.list.appendChild(item);

        let head = document.createElement("div");
        head.className = "QNAView-body-list-item-head"
        head.textContent = "답변";
        item.appendChild(head);

        let body = document.createElement("div");
        body.className = "QNAView-body-list-item-body";
        body.textContent = text;
        item.appendChild(body);

        return this.list.children.length - 1;
    }

    MakeTalks(solutionCard) {
        let question;
        let answer;
        let j;
        let i = 0;
        while (i < solutionCard.QuestionLength) {
            question = solutionCard.GetAtQuestion(i);
            this.AddQuestion(question.Content);
            j = 0;
            while (j < question.Length) {
                answer = question.GetAt(j);
                if (answer.Content != "") {
                    this.AddAnswer(answer.Content);
                }
                j++;
            }
            i++;
        }
    }

    Hide() {
        this.element.style.display = "none";
        this.toggle = false;
    }

    Show() {
        this.element.style.display = "block";

        const qnaItem = document.getElementById("QNAITEM");

        const solutionView = document.getElementById("SOLUTIONVIEW");
        const solutionView_head = document.getElementsByClassName("solutionView-head")[0];

        let middle = solutionView.offsetLeft + (solutionView.offsetWidth / 2);
        let left = middle - (qnaItem.offsetWidth / 2);
        let top = solutionView.offsetTop + solutionView_head.offsetHeight;

        qnaItem.style.left = `${left}px`;
        qnaItem.style.top = `${top}px`;
    }
}