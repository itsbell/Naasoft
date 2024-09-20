import { BusinessObject, BusinessObjects } from "./BusinessObject.js";

export class MenteeCard extends BusinessObjects {
    constructor() {
        super();

        this.id = 1;
    }

    get name() {
        return this._objects[0].name;
    }

    get emailAddress() {
        return this._objects[0].emailAddress;
    }

    get time() {
        return this._objects[0].time;
    }

    static GetInstance() {
        if (window.top.businessObjects["MENTEECARD"] === undefined) {
            window.top.businessObjects["MENTEECARD"] = new MenteeCard();
        }
        return window.top.businessObjects["MENTEECARD"];
    }

    SetObject(object) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let mentee;
        let menteeObject;

        while (i < this._length) {
            mentee = new Mentee();
            menteeObject = object._objects[0];
            mentee.SetObject(menteeObject);
            this._objects.push(mentee);
            i++;
        }
    }
}

export class Mentee extends BusinessObject {
    constructor(name, emailAddress, time) {
        super();

        this._name = name;
        this._emailAddress = emailAddress;
        this._time = time;
    }

    get name() {
        return this._name;
    }

    get emailAddress() {
        return this._emailAddress;
    }

    get time() {
        return this._time;
    }

    SetObject(object) {
        this._name = object._name;
        this._emailAddress = object._emailAddress;
        this._time = object._time;
    }
}