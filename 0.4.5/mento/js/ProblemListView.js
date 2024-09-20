import { CompositeWindow } from "./Window.js";
import { Button } from "./Buttons.js";
import { ProblemCard } from "./Problem.js";

export class ProblemListView extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }

    Load(step) {
        const factory = new ListCreatorFactory(this);
        const creator = factory.Make(step);
        if (creator != null) {
            creator.Create();
        }
    }

    OnPlayButtonClicked(event) {
        const problemCard = ProblemCard.GetInstance();
        const number = event.target.id.substring(10);
        problemCard.MoveByNumber(number);

        let jsonText = JSON.stringify(problemCard);
        window.sessionStorage.setItem("ProblemCard", jsonText);

        // window.top.location.href = "/mento/play";
        window.top.location.href = "../play.php";
    }
}

class ListCreatorFactory {
    constructor(problemListView) {
        this.problemListView = problemListView;
    }

    Make(step) {
        let creator = null;
        if (step == 1) {
            creator = new Step1ListCreator(this.problemListView);
        }

        return creator;
    }
}

class ButtonCreator {
    constructor(problemListView) {
        this.problemListView = problemListView;
    }

    Create() {

    }
}

class Step1ListCreator extends ButtonCreator {
    constructor(problemListView) {
        super(problemListView);
    }

    Create() {
        let list = document.createElement("ul");
        list.className = "problemListView-list";
        this.problemListView.element.appendChild(list);

        let sources = [["2장", 2], ["3장", 1], ["4장", 1], ["5장", 3],
        ["7장", 3], ["8장", 3], ["9장", 3], ["11장", 3], ["12장", 3], ["13장", 3]];

        let item;
        let separator;
        let title;
        let control;
        let buttonElement;
        let button;
        let count = 0;
        let j;
        let i = 0;
        while (i < sources.length) {
            item = document.createElement("li");
            item.className = "problemListView-item";
            list.appendChild(item);

            separator = document.createElement("div");
            separator.className = "problemListView-separator";
            item.appendChild(separator);

            title = document.createElement("p");
            title.textContent = sources[i][0];
            item.appendChild(title);

            control = document.createElement("div");
            control.className = "problemListView-control";
            item.appendChild(control);

            j = 0;
            while (j < sources[i][1]) {
                count++;

                buttonElement = document.createElement("button");
                buttonElement.id = "PLAYBUTTON" + count;
                buttonElement.className = "playButton";
                control.appendChild(buttonElement);

                button = new Button(buttonElement.id, "문제 " + (j + 1), this.problemListView.OnPlayButtonClicked.bind(this.problemListView));
                this.problemListView.Add(button);

                j++;
            }

            i++;
        }
    }
}