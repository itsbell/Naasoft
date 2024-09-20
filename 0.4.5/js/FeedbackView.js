import { DraggableElement } from "./DraggableElement.js";
import { DraggableGround } from "./DraggableGround.js";
import { CompositeWindow } from "./Window.js";

export class FeedbackView extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById("FEEDBACKVIEW");
        this.element.logicalObject = this;

        DraggableGround.SetElement(id);

        this.element.tabIndex = -1; // enable focus = enable key action
        this.element.addEventListener("keyup", this.OnKeyUp.bind(this));

        this.element.style.display = "none";
        this.toggle = false;
    }

    get Toggle() {
        return this.toggle;
    }

    OnKeyUp(event) {
        if (event.key === "Escape") {
            this.Hide();
        }
    }

    Hide() {
        this.element.style.display = "none";
        this.toggle = false;
    }

    Show() {
        if (this.Length > 0) {

            this.element.style.display = "block";
            this.toggle = true;

            let solutionView = document.getElementById("SOLUTIONVIEW");
            let solutionViewHead = document.getElementsByClassName("solutionView-head")[0];
            let previousItem;
            let feedbackItem = this.windows[0].element;

            let left = `${solutionView.offsetLeft + (solutionViewHead.offsetWidth / 2) - 200}px`;

            feedbackItem.style.left = left;
            feedbackItem.style.top = `${solutionView.offsetTop + solutionViewHead.offsetHeight}px`;

            let i = 1;
            while (i < this.Length) {
                previousItem = this.windows[i - 1].element;
                feedbackItem = this.windows[i].element;

                feedbackItem.style.left = left;
                feedbackItem.style.top = `${previousItem.offsetTop + previousItem.offsetHeight}px`;
                i++;
            }
        }
    }

    RemoveAllItems() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }
    }

    AddItem(text, evaluate) {
        let id = `FEEDBACKITEM${this.Length + 1}`;

        let feedbackItemElement = document.createElement("div");
        feedbackItemElement.id = id;
        feedbackItemElement.className = "feedback";
        this.element.appendChild(feedbackItemElement);

        let feedbackItem = new FeedbackItem(id, text, evaluate);
        this.Add(feedbackItem);
    }
}

class FeedbackItem extends CompositeWindow {
    constructor(id, text, evaluate) {
        super(id);

        this.element = document.getElementById(id);
        this.element.logicalObject = this;

        DraggableElement.SetElement(id);

        let feedbackHead = document.createElement("div");
        feedbackHead.className = "feedback-head";
        this.element.appendChild(feedbackHead);

        let number = document.createElement("div");
        number.className = "feedback-head-number";
        let textContent = this.element.parentNode.logicalObject.Length + 1;
        number.textContent = textContent;
        feedbackHead.appendChild(number);

        let wrapper = document.createElement("div");
        wrapper.className = "feedback-head-wrapper";
        feedbackHead.appendChild(wrapper);

        let iconDiv = document.createElement("div");
        iconDiv.className = "feedback-head-iconDiv";
        wrapper.appendChild(iconDiv);

        let icon = document.createElement("img");
        icon.className = "feedback-head-iconDiv-icon";
        iconDiv.appendChild(icon);

        let subject = document.createElement("div");
        subject.className = "feedback-head-subject";
        wrapper.appendChild(subject);

        let feedbackBody = document.createElement("div");
        feedbackBody.className = "feedback-body";
        this.element.appendChild(feedbackBody);

        let p = document.createElement("p");
        p.textContent = text;
        feedbackBody.appendChild(p);

        evaluate = parseInt(evaluate, 10);
        switch (evaluate) {
            case -2: subject.textContent = "평가 불가";
                icon.src = "../assets/none.png"; break;
            case -1: subject.textContent = "완료";
                icon.src = "../assets/ability.png"; break;
            case 1: subject.textContent = "추상화 능력";
                icon.src = "../assets/ability1.png"; break;
            case 2: subject.textContent = "논리적 사고력";
                icon.src = "../assets/ability2.png"; break;
            case 3: subject.textContent = "문제 해결 능력";
                icon.src = "../assets/ability3.png"; break;
            case 4: subject.textContent = "비판적 사고력";
                icon.src = "../assets/ability4.png"; break;
            case 5: subject.textContent = "프로그래밍 언어 구사 능력";
                icon.src = "../assets/ability5.png"; break;
            case 6: subject.textContent = "디버깅 능력";
                icon.src = "../assets/ability6.png"; break;
            default: break;
        }
    }
}