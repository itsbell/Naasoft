import { BusinessObjects, BusinessObject } from "./BusinessObject.js";
import { DateTime } from "./DateTime.js";

export class MentoCard extends BusinessObjects {
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
    set time(time) {
        this._objects[0].time = time;
    }

    static GetInstance() {
        if (window.top.businessObjects["MENTOCARD"] === undefined) {
            window.top.businessObjects["MENTOCARD"] = new MentoCard();
        }
        return window.top.businessObjects["MENTOCARD"];
    }

    SetObject(object) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let mento;
        let mentoObject;
        while (i < this._length) {
            mento = new Mento();
            mentoObject = object._objects[0];
            mento.SetObject(mentoObject);
            this._objects.push(mento);
            i++;
        }
    }
}

export class Mento extends BusinessObject {
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
    set time(time) {
        this._time = time;
    }

    SetObject(object) {
        this._name = object._name;
        this._emailAddress = object._emailAddress;

        let time = null;
        if (object._time != null) {
            time = new DateTime();
            time.SetObject(object._time);
        }
        this._time = time;
    }
}