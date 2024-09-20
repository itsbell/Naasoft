import { Window } from "./Window.js";

export class Button extends Window {
    constructor(id, text, action) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.textContent = text;
        this.element.addEventListener("click", action);
    }
}

export class ImageButton extends Button {
    constructor(id, source, action, tooltip) {
        super(id, "", action);

        this.img = document.createElement("img");
        this.img.src = source;
        this.element.appendChild(this.img);

        this.element.title = tooltip;
    }

    SetSource(source){
        this.img.src = source;
    }
}