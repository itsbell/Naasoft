import { CompositeWindow } from "./Window.js";
import { Button } from "./Buttons.js";
import { ApplyBook } from "./Apply.js";
import { BookmarkCard } from "./Bookmark.js";
import { IndexForm } from "./IndexForm.js";
import { IndexedDB } from "./IndexedDB.js";
import { FrameController } from "./FrameController.js";

export class ProblemNavigator extends CompositeWindow {
    constructor(id, step, chapter) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.style.display = "none";
        this.element.logicalObject = this;

        // let head = document.createElement("div");
        // head.className = "problemNavigator-head";
        // head.textContent = "문제를 제출해서 피드백을 받으세요.";
        // this.element.appendChild(head);

        this.body = document.createElement("div");
        this.body.className = "problemNavigator-body";
        this.element.appendChild(this.body);

        const factory = new ButtonCreatorFactory(this);
        const creator = factory.Make(step, chapter);
        if (creator != null) {
            creator.Create();
        }

        this.chapter = chapter;
    }

    async OnPlayButtonClicked(event) {
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        const applyBook = ApplyBook.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();
        const applyCard = applyBook.GetAt(applyBook.current);
        const number = parseInt(event.target.id.substring(10));
        let index = this.chapter.indexOf("장");
        const chapter = parseInt(this.chapter.substring(0, index));

        bookmarkCard.Correct(0, bookmarkCard.location, "", "", "", applyCard.courseName, applyCard.stepNumber, chapter, number, 0);
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("PLAYFORM");
    }
}

class ButtonCreatorFactory {
    constructor(navigator) {
        this.navigator = navigator;
    }

    Make(step, chapter) {
        let creator = null;
        if (step == 1) {
            if (chapter === "2장") {
                creator = new Step1Chapter2ButtonCreator(this.navigator);
            }
            else if (chapter === "3장") {
                creator = new Step1Chapter3ButtonCreator(this.navigator);
            }
            else if (chapter === "4장") {
                creator = new Step1Chapter4ButtonCreator(this.navigator);
            }
            else if (chapter === "5장") {
                creator = new Step1Chapter5ButtonCreator(this.navigator);
            }
            else if (chapter === "7장") {
                creator = new Step1Chapter7ButtonCreator(this.navigator);
            }
            else if (chapter === "8장") {
                creator = new Step1Chapter8ButtonCreator(this.navigator);
            }
            else if (chapter === "9장") {
                creator = new Step1Chapter9ButtonCreator(this.navigator);
            }
            else if (chapter === "11장") {
                creator = new Step1Chapter11ButtonCreator(this.navigator);
            }
            else if (chapter === "12장") {
                creator = new Step1Chapter12ButtonCreator(this.navigator);
            }
            else if (chapter === "13장") {
                creator = new Step1Chapter13ButtonCreator(this.navigator);
            }
        }

        return creator;
    }
}

class ButtonCreator {
    constructor(navigator) {
        this.navigator = navigator;
    }

    Create() {

    }
}

class Step1Chapter2ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON2";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON2", "문제 2", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter3ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter4ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter5ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON2";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON2", "문제 2", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON3";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON3", "문제 3", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter7ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON2";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON2", "문제 2", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON3";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON3", "문제 3", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter8ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON2";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON2", "문제 2", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON3";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON3", "문제 3", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter9ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON2";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON2", "문제 2", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON3";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON3", "문제 3", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter11ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON2";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON2", "문제 2", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON3";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON3", "문제 3", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter12ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON2";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON2", "문제 2", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON3";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON3", "문제 3", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}

class Step1Chapter13ButtonCreator extends ButtonCreator {
    constructor(navigator) {
        super(navigator);
    }

    Create() {
        let buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON1";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        let button = new Button("PLAYBUTTON1", "문제 1", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON2";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON2", "문제 2", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        buttonElement = document.createElement("button");
        buttonElement.id = "PLAYBUTTON3";
        buttonElement.className = "playButton";
        this.navigator.body.appendChild(buttonElement);

        button = new Button("PLAYBUTTON3", "문제 3", this.navigator.OnPlayButtonClicked.bind(this.navigator));
        this.navigator.Add(button);

        this.navigator.element.style.display = "flex";
    }
}