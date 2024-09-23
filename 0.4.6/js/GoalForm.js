import { CompositeWindow } from "./Window.js";

export class GoalForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }

    static GetInstance() {
        if (window.top.forms["GOALFORM"] === undefined) {
            window.top.forms["GOALFORM"] = new GoalForm("GOALFORM");
        }
        return window.top.forms["GOALFORM"];
    }
}