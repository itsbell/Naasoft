import { CompositeWindow } from "../../js/Window.js";
import { AnswerEditor } from "./AnswerEditor.js";

export class QnaView extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
        this.element.className = "qnaView-hide";

        let head = document.createElement("div");
        head.className = "qnaView-head";
        this.element.appendChild(head);

        let sectionName = document.createElement("div");
        sectionName.className = "qnaView-head-sectionName";
        sectionName.textContent = "질문/답변";
        head.appendChild(sectionName);

        let body = document.createElement("div");
        body.className = "qnaView-body";
        this.element.appendChild(body);

        this.list = document.createElement("ul");
        this.list.className = "qnaView-body-list";
        body.appendChild(this.list);
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
        item.className = "qnaView-body-list-item-question";
        this.list.appendChild(item);

        let head = document.createElement("div");
        head.className = "qnaView-body-list-item-head";
        item.appendChild(head);

        let title = document.createElement("p");
        title.textContent = "질문";
        head.appendChild(title);

        let body = document.createElement("div");
        body.className = "qnaView-body-list-item-body";
        item.appendChild(body);

        let p = document.createElement("p");
        p.textContent = text;
        body.appendChild(p);

        return this.list.children.length - 1;
    }

    AddAnswer(text) {
        let item = document.createElement("li");
        item.className = "qnaView-body-list-item-answer";
        this.list.appendChild(item);

        let head = document.createElement("div");
        head.className = "qnaView-body-list-item-head";
        item.appendChild(head);

        let title = document.createElement("p");
        title.textContent = "답변";
        head.appendChild(title);

        let body = document.createElement("div");
        body.className = "qnaView-body-list-item-body";
        item.appendChild(body);

        let p = document.createElement("p");
        p.textContent = text;
        body.appendChild(p);

        return this.list.children.length - 1;
    }

    AddEditor(id) {
        let editor = document.createElement("div");
        editor.id = id;
        editor.className = "answerEditor";
        this.list.appendChild(editor);

        const answerEditor = new AnswerEditor(id);
        this.Add(answerEditor);
    }

    MakeTalks(solutionCard) {
        let question;
        let answer;
        let i = 0;
        let j;

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
            if (j === 0) {
                this.AddEditor("ANSWEREDITOR" + (i + 1));
            }
            i++;
        }
    }
}