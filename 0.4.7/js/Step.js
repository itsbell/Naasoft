import { BusinessObjects, BusinessObject } from "./BusinessObject.js";

export class StepBook extends BusinessObjects {
    constructor() {
        super();

        this.id = 1;
    }

    static GetInstance() {
        if (window.top.businessObjects["STEPBOOK"] === undefined) {
            window.top.businessObjects["STEPBOOK"] = new StepBook();
        }
        return window.top.businessObjects["STEPBOOK"];
    }

    SetObject(object, courseList) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let stepList;
        let stepListObject;

        while (i < this._length) {
            stepList = new StepList();
            stepListObject = object._objects[i];
            stepList.SetObject(stepListObject, courseList);
            this._objects.push(stepList);
            i++;
        }
    }

    Find(courseName) {
        let index = -1;

        let i = 0;
        while (i < this._length &&
            this._objects[i].courseName != courseName) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }
}

export class StepList extends BusinessObjects {
    constructor(course) {
        super();

        this._course = course;
    }

    get courseName() {
        return this._course.name;
    }

    Find(number) {
        let index = -1;

        let i = 0;
        while (i < this._length && this._objects[i].number != number) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }

    SetObject(object, courseList) {
        this._length = object._length;
        this._current = object._current;
        let course;
        let courseObject = object._course;

        let index = courseList.Find(courseObject._name);
        if (index != -1) {
            course = courseList.GetAt(index);
        }
        this._course = course;

        let i = 0;
        let step;
        let stepObject;

        while (i < this._length) {
            step = new Step();
            stepObject = object._objects[i];
            step.SetObject(stepObject);
            this._objects.push(step);
            i++;
        }
    }
}

export class Step extends BusinessObject {
    constructor(number, subject, price, period) {
        super();

        this._number = number;
        this._subject = subject;
        this._price = price;
        this._period = period;
    }

    get number() {
        return this._number;
    }

    get subject() {
        return this._subject;
    }

    get price() {
        return this._price;
    }

    get period() {
        return this._period;
    }

    SetObject(object) {
        this._number = (typeof object._number === "string") ? (parseInt(object._number, 10)) : (object._number);
        this._subject = object._subject;
        this._price = (typeof object._price === "string") ? (parseFloat(object._price)) : (object._price);
        this._period = (typeof object._period === "string") ? (parseInt(object._period, 10)) : (object._period);
    }
}