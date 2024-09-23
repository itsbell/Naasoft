import { CompositeWindow } from "./Window.js";
// import { MenteeCard } from "./Mentee.js";
import { Button } from "./Buttons.js";
import { IndexForm } from "./IndexForm.js";
import { FrameController } from "./FrameController.js";

export class ServiceForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["SERVICEFORM"] === undefined) {
            window.top.forms["SERVICEFORM"] = new ServiceForm("SERVICEFORM");
        }
        return window.top.forms["SERVICEFORM"];
    }

    OnLoaded() {
        const button = new Button("STARTBUTTON", "시작", this.OnStartButtonClicked.bind(this));
        this.Add(button);

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    OnStartButtonClicked() {
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("SIGNUPFORM");
    }
}