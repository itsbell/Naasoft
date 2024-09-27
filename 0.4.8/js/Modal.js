import { Window } from "./Window.js";

export class Modal extends Window{
    constructor(id, closeId) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        let close = document.getElementById(closeId);
        close.addEventListener("click", this.OnCloseClicked.bind(this));
    }

    DoModal() {        
        this.element.style.display = "block";
    }

    OnCloseClicked() {
        this.element.style.display = "none";
    }
}