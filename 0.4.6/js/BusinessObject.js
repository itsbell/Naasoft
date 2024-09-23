export class BusinessObject {
    constructor() {

    }

    Add(businessObject) {
        return -1;
    }

    // Find(key) {
    //     return -1;
    // }

    GetAt(index) {
        return null;
    }

    Modify(index, businessObject) {
        return -1;
    }

    Move(index) {
        return -1;
    }

    Remove(index) {
        return -1;
    }

    RemoveAll() {
        return -1;
    }

    Reset() {

    }
}

export class BusinessObjects extends BusinessObject {
    constructor() {
        super();
        this._objects = [];
        this._length = 0;
        this._current = -1;
    }

    get length() {
        return this._length;
    }

    get current() {
        return this._current;
    }

    Add(businessObject) {
        this._objects.push(businessObject);
        this._current = this._length;
        this._length++;

        return this._current;
    }

    // Find(key) {
    //     let i = 0;
    //     let index = -1;

    //     while (i < this._length && index === -1) {
    //         if (this._objects[i] === key) {
    //             index = i;
    //         }
    //         i++;
    //     }

    //     return index;
    // }

    GetAt(index) {
        return this._objects[index];
    }

    Modify(index, businessObject) {
        this._objects[index] = businessObject;

        return index;
    }

    Move(index) {
        this._current = index;

        return this._current;
    }

    Remove(index) {
        this._objects.splice(index, 1);
        this._length--;

        return -1;
    }

    RemoveAll() {
        this._objects.splice(0, this._length);
        this._length = 0;
        this._current = -1;

        return -1;
    }

    Reset() {
        let i = 0;
        let businessObjects;

        while (i < this._length) {
            businessObjects = this._objects[i];
            console.log(businessObjects);
            // if (businessObjects instanceof BusinessObjects) {
            //     businessObjects.Reset();
            // }
            i++;
        }

        this._current = -1;
    }
}