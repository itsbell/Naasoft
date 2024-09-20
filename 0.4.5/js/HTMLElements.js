import { Window, CompositeWindow } from "./Window.js";

export class Section extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

export class Div extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

export class P extends Window {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

export class A extends Window {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

export class Img extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

export class Ul extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

export class Li extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}

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

export class Input extends CompositeWindow {
    constructor(id){
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }
}