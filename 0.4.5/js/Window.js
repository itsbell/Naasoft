export class Window {
    constructor(id) {
        this.id = id;
        this.element = null;
    }

    get Id() {
        return this.id;
    }

    get Element() {
        return this.element;
    }
}

export class CompositeWindow extends Window {
    constructor(id) {
        super(id);
        this.windows = [];
        this.length = 0;
    }

    get Length() {
        return this.length;
    }

    Add(window) {
        let index = this.length;
        this.windows[index] = window;
        this.length++;
        return index;
    }

    Remove(index) {
        this.windows.splice(index, 1);
        this.length--;
        return -1;
    }

    GetAt(index) {
        return this.windows[index];
    }

    Find(id) {
        let index = -1;
        let i = 0;
        while (i < this.length && this.windows[i].Id != id) {
            i++;
        }
        if (i < this.length) {
            index = i;
        }
        return index;
    }

    Clear() {
        this.windows.splice(0, this.length);
        this.length = 0;
    }
}