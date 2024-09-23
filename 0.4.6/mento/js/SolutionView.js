import { CompositeWindow } from "../../js/Window.js";
import { ImageView } from "../../js/ImageView.js";
import { Button } from "../../js/Buttons.js";

export class SolutionView extends CompositeWindow {
    constructor(id, state) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        let head = document.createElement("div");
        head.className = "solutionView-head";
        this.element.appendChild(head);

        let sectionName = document.createElement("p");
        sectionName.className = "solutionView-head-sectionName";
        sectionName.textContent = "풀이";
        head.appendChild(sectionName);

        this.title = document.createElement("p");
        this.title.className = "solutionView-head-title";
        head.appendChild(this.title);
        
        let menu = document.createElement("div");
        menu.className = "solutionView-head-menu";
        head.appendChild(menu);

        let feedbackButton = document.createElement("button");
        feedbackButton.id = "FEEDBACKBUTTON";
        feedbackButton.className = "solutionView-head-menu-feedbackButton";
        menu.appendChild(feedbackButton);

        let button = new Button("FEEDBACKBUTTON", "피드백", this.OnFeedbackButtonClicked);
        this.Add(button);

        let QNAButton = document.createElement("button");
        QNAButton.id = "QNABUTTON";
        QNAButton.className = "solutionView-head-menu-QnAButton";
        menu.appendChild(QNAButton);

        button = new Button("QNABUTTON", "질문", this.OnQnAButtonClicked);
        this.Add(button);

        let body = document.createElement("div");
        body.className = "solutionView-body";
        this.element.appendChild(body);

        let view = document.createElement("div");
        view.id = "IMAGEVIEW";
        view.className = "imageView";
        body.appendChild(view);

        const imageView = new ImageView(view.id);
        this.Add(imageView);
        if (state === "FINISH") {
            let stamp = document.createElement("div");
            stamp.className = "solutionView-stamp";
            this.element.appendChild(stamp);
        }

        this.content = document.createElement("p");
        body.appendChild(this.content);
    }

    SetTitle(title) {
        this.title.textContent = title;
    }

    SetImage(url) {
        // const byteCharacters = atob(image);
        // const byteArrays = [];

        // for (let i = 0; i < image.length; i++) {
        //     byteArrays.push(byteCharacters.charCodeAt(i));
        // }

        // const byteArray = new Uint8Array(byteArrays);
        // let blob = new Blob([byteArray], { type: "text/plain" });

        // let url = URL.createObjectURL(blob);

        let index = this.Find("IMAGEVIEW");
        if (index != -1) {
            this.GetAt(index).SetImage(url);
        }
    }

    SetContent(content) {
        this.content.textContent = content;
    }

    ClickFeedback() {
        let buttonElement = document.getElementById("FEEDBACKBUTTON");
        buttonElement.dispatchEvent(new Event("click"));
    }

    ClickQnA() {
        let buttonElement = document.getElementById("QNABUTTON");
        buttonElement.dispatchEvent(new Event("click"));
    }

    OnFeedbackButtonClicked(event) {
        let feedbackView = document.getElementById("FEEDBACKVIEW");
        let qnaView = document.getElementById("QNAVIEW");

        if (feedbackView.className == "feedbackView-hide" && qnaView.className == "qnaView-hide") {
            feedbackView.className = "feedbackView-show-620";
        }
        else if (feedbackView.className == "feedbackView-hide" && qnaView.className == "qnaView-show-310") {
            feedbackView.className = "feedbackView-show-310";
        }
        else if (feedbackView.className == "feedbackView-hide" && qnaView.className == "qnaView-show-620") {
            feedbackView.className = "feedbackView-show-310";
            qnaView.className = "qnaView-show-310";
        }
        else if (feedbackView.className == "feedbackView-show-310") {
            feedbackView.className = "feedbackView-hide";
            qnaView.className = "qnaView-show-620";
        }
        else if (feedbackView.className == "feedbackView-show-620") {
            feedbackView.className = "feedbackView-hide";
        }
    }

    OnQnAButtonClicked(event) {
        let qnaView = document.getElementById("QNAVIEW");
        let feedbackView = document.getElementById("FEEDBACKVIEW");

        if (qnaView.className == "qnaView-hide" && feedbackView.className == "feedbackView-hide") {
            qnaView.className = "qnaView-show-620";
        }
        else if (qnaView.className == "qnaView-hide" && feedbackView.className == "feedbackView-show-310") {
            qnaView.className = "qnaView-show-310";
        }
        else if (qnaView.className == "qnaView-hide" && feedbackView.className == "feedbackView-show-620") {
            qnaView.className = "qnaView-show-310";
            feedbackView.className = "feedbackView-show-310";
        }
        else if (qnaView.className == "qnaView-show-310") {
            qnaView.className = "qnaView-hide";
            feedbackView.className = "feedbackView-show-620";
        }
        else if (qnaView.className == "qnaView-show-620") {
            qnaView.className = "qnaView-hide";
        }
    }
}