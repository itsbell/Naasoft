import { CompositeWindow } from "./Window.js";
import { Button } from "./Buttons.js";

export class PaymentFailForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.paymentFailForm === undefined) {
            window.top.paymentFailForm = new PaymentFailForm("PAYMENTFAILFORM");
        }
        return window.top.paymentFailForm;
    }

    OnLoaded() {
        const urlParams = new URLSearchParams(window.location.search);

        let code = urlParams.get("code");
        let message = urlParams.get("message");

        const codeElement = document.getElementById("CODE");
        let p = document.createElement("p");
        p.textContent = code;
        codeElement.appendChild(p);

        const messageElement = document.getElementById("MESSAGE");
        p = document.createElement("p");
        p.className = "bold";
        p.textContent = message;
        messageElement.appendChild(p);

        const previousButton = new Button("PREVIOUSBUTTON",
            "돌아가기", this.OnPreviousButtonClicked);
        this.Add(previousButton);
    }

    OnPreviousButtonClicked() {
        window.top.location.href = "../../index.php";
    }
}