import { BusinessObject, BusinessObjects } from "./BusinessObject.js";

export class MenteeInfoList extends BusinessObjects {
    constructor() {
        super();

        this.id = 1;
    }

    static GetInstance() {
        if (window.top.businessObjects["MENTEEINFOLIST"] === undefined) {
            window.top.businessObjects["MENTEEINFOLIST"] = new MenteeInfoList();
        }
        return window.top.businessObjects["MENTEEINFOLIST"];
    }

    SetObject(object) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let menteeInfo;
        let menteeInfoObject;
        let i = 0;
        while (i < object._length) {
            menteeInfoObject = object._objects[i];
            menteeInfo = new MenteeInfo();
            menteeInfo.SetObject(menteeInfoObject);
            this._objects.push(menteeInfo);
            i++;
        }
    }
}

export class MenteeInfo extends BusinessObject {
    constructor(name, emailAddress, courseName, stepNumber) {
        super();

        this._name = name;
        this._emailAddress = emailAddress;
        this._courseName = courseName;
        this._stepNumber = stepNumber;
    }

    get name() {
        return this._name;
    }

    get emailAddress() {
        return this._emailAddress;
    }

    get courseName() {
        return this._courseName;
    }

    get stepNumber() {
        return this._stepNumber;
    }

    SetObject(object) {
        this._name = object._name;
        this._emailAddress = object._emailAddress;
        this._courseName = object._courseName;
        this._stepNumber = parseInt(object._stepNumber);
    }
}