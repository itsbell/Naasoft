import { BusinessObject, BusinessObjects } from "./BusinessObject.js";
import { DateTime } from "./DateTime.js";

export class ApplyBook extends BusinessObjects {
    constructor() {
        super();

        this.id = 1;
    }

    static GetInstance() {
        if (window.top.businessObjects["APPLYBOOK"] === undefined) {
            window.top.businessObjects["APPLYBOOK"] = new ApplyBook();
        }
        return window.top.businessObjects["APPLYBOOK"];
    }

    SetObject(object, courseList, stepBook) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let applyCard;
        let applyCardObject;

        while (i < this._length) {
            applyCard = new ApplyCard();
            applyCardObject = object._objects[i];
            applyCard.SetObject(applyCardObject, courseList, stepBook);
            this._objects.push(applyCard);
            i++;
        }
    }

    Find(courseName, stepNumber) {
        let index = -1;

        let i = 0;
        while (i < this._length &&
            (this._objects[i].courseName != courseName
                || this._objects[i].stepNumber != stepNumber)) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }

    FindCurrentCard() {
        let index = -1;

        let i = this._length - 1;
        while (i >= 0 && this._objects[i].isPaid === false) {
            i--;
        }
        if (i >= 0) {
            index = i;
        }

        return index;
    }

    GetIntegrateObject(time) {
        const integrateBook = new ApplyBook();

        let applyCard;
        let i = 0;
        while (i < this._length) {
            applyCard = this._objects[i];
            if (applyCard.time.IsGreaterThan(time) === true) {
                integrateBook.Add(applyCard);
            }
            i++;
        }

        return integrateBook;
    }
}

export class ApplyCard extends BusinessObjects {
    constructor(course, step) {
        super();

        this._course = course;
        this._step = step;
    }

    get courseName() {
        return this._course.name;
    }

    get stepNumber() {
        return this._step.number;
    }

    get time() {
        return this._objects[0].time;
    }

    get state() {
        return this._objects[0].state;
    }
    set state(state) {
        this._objects[0].state = state;
    }

    get isPaid() {
        return this._objects[0].isPaid;
    }

    get start() {
        return this._objects[0].start;
    }

    get end() {
        return this._objects[0].end;
    }

    SetObject(object, courseList, stepBook) {
        this._length = object._length;
        this._current = object._current;

        let course;
        let stepList;
        let step;
        const courseObject = object._course;
        const stepObject = object._step;
        const courseName = courseObject._name;
        const stepNumber = stepObject._number;

        let index = courseList.Find(courseName);
        if (index != -1) {
            course = courseList.GetAt(index);
        }
        index = stepBook.Find(courseName);
        if (index != -1) {
            stepList = stepBook.GetAt(index);
            index = stepList.Find(stepNumber);
            if (index != -1) {
                step = stepList.GetAt(index);
            }
        }
        this._course = course;
        this._step = step;

        let i = 0;
        let apply;
        let applyObject;

        while (i < this._length) {
            apply = new Apply();
            applyObject = object._objects[i];
            apply.SetObject(applyObject);
            this._objects.push(apply);
            i++;
        }
    }

    Pay(time) {
        this._objects[0].state = "ALIVE";
        this._objects[0].isPaid = true;
        this._objects[0].start = new DateTime(time);
        this._objects[0].end = new DateTime(time);
        this._objects[0].end.DayAfter(this._step.period);
    }
}

export class Apply extends BusinessObject {
    constructor(time, state, isPaid, start, end) {
        super();

        this._time = time;
        this._state = state;
        this._isPaid = isPaid;
        this._start = start;
        this._end = end;
    }

    get time() {
        return this._time;
    }
    set time(time) {
        this._time = time;
    }

    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
    }

    get isPaid() {
        return this._isPaid;
    }

    set isPaid(isPaid) {
        this._isPaid = isPaid;
    }

    get start() {
        return this._start;
    }

    set start(start) {
        this._start = start;
    }

    get end() {
        return this._end;
    }

    set end(end) {
        this._end = end;
    }

    SetObject(object) {
        let time = null;
        if (object._time != null) {
            time = new DateTime();
            time.SetObject(object._time);
        }

        let isPaid = object._isPaid;
        if (typeof isPaid === "string") {
            isPaid = (isPaid === "false") ? (false) : (true);
        }

        let start = null;
        if (object._start != null) {
            start = new DateTime();
            start.SetObject(object._start);
        }

        let end = null;
        if (object._end != null) {
            end = new DateTime();
            end.SetObject(object._end);
        }

        this._time = time;
        this._state = object._state;
        this._isPaid = isPaid;
        this._start = start;
        this._end = end;
    }
}