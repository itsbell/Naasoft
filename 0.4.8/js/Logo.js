import { Window } from "./Window.js";

export class Logo extends Window {
    constructor(id, href, source, text){
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
        
        this.element.reference = href;

        let row = document.createElement("div");
        row.className = "logo-row";
        this.element.appendChild(row);

        let column = document.createElement("div");
        column.className = "logo-column";
        row.appendChild(column);

        let img = document.createElement("img");
        img.src = source;
        img.className = "logo-image";
        column.appendChild(img);

        column = document.createElement("div");
        column.className = "logo-column";
        row.appendChild(column);

        let p = document.createElement("p");
        p.textContent = text;
        p.className = "logo-text bold";
        column.appendChild(p);

        this.element.addEventListener("click", this.OnClicked.bind(this));
    }

    OnClicked() {
        window.sessionStorage.removeItem("PageCode");
        window.location.href = this.element.reference;
    }
}