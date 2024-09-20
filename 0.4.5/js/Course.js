import { BusinessObject, BusinessObjects } from "./BusinessObject.js";

export class CourseList extends BusinessObjects {
    constructor() {
        super();

        this.id = 1;
    }

    static GetInstance() {
        if (window.top.businessObjects["COURSELIST"] === undefined) {
            window.top.businessObjects["COURSELIST"] = new CourseList();
        }
        return window.top.businessObjects["COURSELIST"];
    }

    SetObject(object) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let course;
        let i = 0;
        while (i < this._length) {
            course = new Course(object._objects[i]._name);
            this._objects.push(course);
            i++;
        }
    }

    Find(name) {
        let index = -1;
        let i = 0;
        while (i < this._length && this._objects[i].name != name) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }
        return index;
    }
}

export class Course extends BusinessObject {
    constructor(name) {
        super();

        this._name = name;
    }

    get name() {
        return this._name;
    }
}