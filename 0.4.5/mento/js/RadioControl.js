import { CompositeWindow } from "../../js/Window.js";

export class RadioControl extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.list = document.createElement("ul");
        this.list.className = "radio-list";
        this.element.appendChild(this.list);
    }

    AddItem(value, text) {
        let item = document.createElement("li");
        item.className = "radio-item";
        this.list.appendChild(item);

        let number = this.list.children.length;

        let input = document.createElement("input");
        input.name = this.id;
        input.id = "RADIOITEM" + number;
        input.value = value;
        input.type = "radio";
        item.appendChild(input);

        if (number === 1) {
            input.checked = true;
        }

        let label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = text;
        item.appendChild(label);
    }

    SelectItem(index) {
        let item = this.list.children[index];
        item.children[0].checked = true;
    }

    GetValue() {
        let value = null;
        
        let i = 0;
        while (i < this.list.children.length && this.list.children[i].children[0].checked === false) {
            i++;
        }
        if (i < this.list.children.length) {
            value = this.list.children[i].children[0].value;
        }

        return value;
    }
}
