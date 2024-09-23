export class Subject {
    constructor() {
        this._observers = [];
        this._length = 0;
    }

    Attach(observer) {
        let index;

        this._observers.push(observer);
        this._length++;

        return this._length - 1;
    }

    Detach(observer) {
        let i = 0;
        let index = -1;


        while (i < this._length) {
            if (this._observers[i] === observer) {
                index = i;
            }
            i++;
        }

        if (index != -1) {
            this._observers.splice(index, 1);
            this._length--;
        }

        return -1;
    }

    GetAt(index) {
        return this._observers[index];
    }

    Notify() {
        let i = 0;
        while (i < this._length) {
            this._observers[i].Update(this);
            i++;
        }
    }
};