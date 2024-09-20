import { CompositeWindow } from "./Window.js";
import { ApplyCardBook } from "./Apply.js";
import { ProblemCard } from "./Problem.js";
import { ProblemListView } from "./ProblemListView.js";

export class ProblemForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
        this.element.dispatchEvent(new Event("load"));
    }

    static GetInstance() {
        if (window.top.forms["PROBLEMFORM"] === undefined) {
            window.top.forms["PROBLEMFORM"] = new ProblemForm("PROBLEMFORM");
        }
        return window.top.forms["PROBLEMFORM"];
    }

    OnLoaded() {

        const applyCardBook = ApplyCardBook.GetInstance();
        let current = applyCardBook.Current;
        let stepNumber = 0;
        if (current != -1) {
            let applyCard = applyCardBook.GetAt(current);
            stepNumber = applyCard.StepNumber;
        }

        const problemListView = new ProblemListView("PROBLEMLISTVIEW");
        this.Add(problemListView);
        problemListView.Load(stepNumber);
    }
}