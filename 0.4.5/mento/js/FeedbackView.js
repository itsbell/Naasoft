import { CompositeWindow } from "../../js/Window.js";
import { FeedbackEditor } from "./FeedbackEditor.js";

export class FeedbackView extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
        this.element.className = "feedbackView-hide";

        let head = document.createElement("div");
        head.className = "feedbackView-head";
        this.element.appendChild(head);

        let sectionName = document.createElement("div");
        sectionName.className = "feedbackView-head-sectionName";
        sectionName.textContent = "피드백";
        head.appendChild(sectionName);

        let body = document.createElement("div");
        body.className = "feedbackView-body";
        this.element.appendChild(body);

        this.list = document.createElement("ul");
        this.list.className = "feedbackView-body-list";
        body.appendChild(this.list);

        let editor = document.createElement("div");
        editor.id = "FEEDBACKEDITOR";
        editor.className = "feedbackEditor";
        body.appendChild(editor);

        const feedbackEditor = new FeedbackEditor("FEEDBACKEDITOR");
        this.Add(feedbackEditor);
    }

    RemoveAllItems() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }
    }

    AddItem(text, evaluate) {
        let item = document.createElement("li");
        item.className = "feedbackView-body-list-item";
        this.list.appendChild(item);

        let head = document.createElement("div");
        head.className = "feedbackView-body-list-item-head";
        item.appendChild(head);

        let title = document.createElement("p");
        head.appendChild(title);

        let body = document.createElement("div");
        body.className = "feedbackView-body-list-item-body";
        item.appendChild(body);

        let p = document.createElement("p");
        p.textContent = text;
        body.appendChild(p);

        evaluate = parseInt(evaluate, 10);
        switch (evaluate) {
            case -2: title.textContent = "평가불가"; break;
            case -1: title.textContent = "완료"; break;
            case 0: title.textContent = "선택없음"; break;
            case 1: title.textContent = "추상화 능력"; break;
            case 2: title.textContent = "논리적 사고력"; break;
            case 3: title.textContent = "문제 해결 능력"; break;
            case 4: title.textContent = "비판적 사고력"; break;
            case 5: title.textContent = "프로그래밍 언어 구사 능력"; break;
            case 6: title.textContent = "디버깅 능력"; break;
            default: break;
        }

        return this.list.children.length - 1;
    }

    SetEditor(evaluate) {
        let index = this.Find("FEEDBACKEDITOR");
        if (index != 1) {
            this.GetAt(index).Set(evaluate);
        }
    }
}