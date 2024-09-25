import { CompositeWindow } from "./Window.js";

export class ProcessForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
        this.element.dispatchEvent(new Event("load"));
    }

    static GetInstance() {
        if (window.top.forms["PROCESSFORM"] === undefined) {
            window.top.forms["PROCESSFORM"] = new ProcessForm("PROCESSFORM");
        }
        return window.top.forms["PROCESSFORM"];
    }

    OnLoaded() {
        
    }
}