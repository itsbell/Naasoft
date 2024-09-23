import { CompositeWindow } from "./Window.js";

export class Table extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

export class Tr extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

export class Td extends CompositeWindow {
    constructor(id){
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}