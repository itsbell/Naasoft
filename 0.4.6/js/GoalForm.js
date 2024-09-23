import { CompositeWindow } from "./Window.js";
import { IndexForm } from "./IndexForm.js";

export class GoalForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["GOALFORM"] === undefined) {
            window.top.forms["GOALFORM"] = new GoalForm("GOALFORM");
        }
        return window.top.forms["GOALFORM"];
    }

    OnLoaded() {
        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }
}