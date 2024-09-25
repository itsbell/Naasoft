import { CompositeWindow } from "./Window.js";
import { Button } from "./Buttons.js";
import { ImageView } from "./ImageView.js";
import { BookmarkCard } from "./Bookmark.js";
import { PlayShelf } from "./Play.js";
import { IndexForm } from "./IndexForm.js"
import { IndexedDB } from "./IndexedDB.js";
import { FrameController } from "./FrameController.js";

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

        let button = new Button("FEEDBACKBUTTON", "피드백", this.OnFeedbackButtonClicked.bind(this));
        this.Add(button);

        let QnAButton = document.createElement("button");
        QnAButton.id = "QNABUTTON";
        QnAButton.className = "solutionView-head-menu-QnAButton";
        menu.appendChild(QnAButton);

        button = new Button("QNABUTTON", "질문", this.OnQnAButtonClicked.bind(this));
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

    AddNextProblem() {
        let nextButton = document.createElement("button");
        nextButton.id = "NEXTBUTTON";
        nextButton.className = "solutionView-head-menu-nextButton";
        nextButton.textContent = "다음 문제";
        nextButton.addEventListener("click", this.OnNextProblemButtonClicked);

        let menu = document.getElementsByClassName("solutionView-head-menu")[0];
        menu.prepend(nextButton);
    }

    AddNextChapter() {
        let nextButton = document.createElement("button");
        nextButton.id = "NEXTBUTTON";
        nextButton.className = "solutionView-head-menu-nextButton";
        nextButton.textContent = "다음 장";
        nextButton.addEventListener("click", this.OnNextChapterButtonClicked);

        let menu = document.getElementsByClassName("solutionView-head-menu")[0];
        menu.prepend(nextButton);
    }

    AddNextBook() {
        let nextButton = document.createElement("button");
        nextButton.id = "NEXTBUTTON";
        nextButton.className = "solutionView-head-menu-nextButton";
        nextButton.textContent = "다음 책";
        nextButton.addEventListener("click", this.OnNextBookButtonClicked);

        let menu = document.getElementsByClassName("solutionView-head-menu")[0];
        menu.prepend(nextButton);
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
        const solveGround = document.getElementById("SOLVEGROUND").logicalObject;

        if (solveGround.FeedbackToggle === true) {
            solveGround.HideFeedbacks();
        }
        else {
            solveGround.ShowFeedbacks();
        }
    }

    OnQnAButtonClicked() {
        const solveGround = document.getElementById("SOLVEGROUND").logicalObject;

        if (solveGround.QnAToggle === true) {
            solveGround.HideQnA();
        }
        else {
            solveGround.ShowQnA();
        }
    }

    async OnNextProblemButtonClicked() {
        const playShelf = PlayShelf.GetInstance();
        let playCase = playShelf.GetAt(playShelf.current);
        let problemList = playCase.GetAt(0);
        let problem = problemList.GetAt(problemList.current);
        let applyCard = playCase.applyCard;

        const bookmarkCard = BookmarkCard.GetInstance();
        bookmarkCard.Correct(0, bookmarkCard.location, "PLAYFORM", "SOLVEFORM", "", applyCard.courseName, applyCard.stepNumber, problem.chapterNumber, problem.number + 1, 0);

        let indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        let frameController = new FrameController(indexForm);
        frameController.Change("PLAYFORM");
    }

    async OnNextChapterButtonClicked() {
        const playShelf = PlayShelf.GetInstance();
        let playCase = playShelf.GetAt(playShelf.current);
        let problemList = playCase.GetAt(0);
        let problem = problemList.GetAt(problemList.current);
        let applyCard = playCase.applyCard;

        const bookmarkCard = BookmarkCard.GetInstance();
        bookmarkCard.Correct(0, bookmarkCard.location, "DESKFORM", "STUDYFORM", "", applyCard.courseName, applyCard.stepNumber, problem.chapterNumber + 1, 0, 0);

        let indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        let frameController = new FrameController(indexForm);
        frameController.Change("DESKFORM");
    }

    async OnNextBookButtonClicked() {
        const bookmarkCard = BookmarkCard.GetInstance();
        bookmarkCard.Correct(0, bookmarkCard.location, "ATTICFORM", "PROGRESSFORM", "", "", 0, -1, 0, 0);

        let indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        let frameController = new FrameController(indexForm);
        frameController.Change("ATTICFORM");
    }
}