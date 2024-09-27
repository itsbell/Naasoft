import { CompositeWindow } from "./Window.js";
import { IndexForm } from "./IndexForm.js";

export class AboutForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["ABOUTFORM"] === undefined) {
            window.top.forms["ABOUTFORM"] = new AboutForm("ABOUTFORM");
        }
        return window.top.forms["ABOUTFORM"];
    }

    OnLoaded() {
        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }
}