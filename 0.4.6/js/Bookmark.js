import { BusinessObject, BusinessObjects } from "./BusinessObject.js";

export class BookmarkCard extends BusinessObjects {
    constructor() {
        super();

        this.id = 1;
    }

    get location() {
        return this._objects[0].location;
    }

    get childForm() {
        return this._objects[0].childForm;
    }

    get grandChildForm() {
        return this._objects[0].grandChildForm;
    }

    get type() {
        return this._objects[0].type;
    }

    set type(type) {
        return this._objects[0].type = type;
    }

    get courseName() {
        return this._objects[0].courseName;
    }

    get stepNumber() {
        return this._objects[0].stepNumber;
    }

    get chapterNumber() {
        return this._objects[0].chapterNumber;
    }

    get problemNumber() {
        return this._objects[0].problemNumber;
    }

    get solutionNumber() {
        return this._objects[0].solutionNumber;
    }

    Correct(index, location, childForm, grandChildForm, type, courseName, stepNumber, chapterNumber, problemNumber, solutionNumber) {
        let bookmark = new Bookmark(location, childForm, grandChildForm, type, courseName, stepNumber, chapterNumber, problemNumber, solutionNumber);
        this._objects[index] = bookmark;
    }

    static GetInstance() {
        if (window.top.businessObjects["BOOKMARKCARD"] === undefined) {
            window.top.businessObjects["BOOKMARKCARD"] = new BookmarkCard();
        }
        return window.top.businessObjects["BOOKMARKCARD"];
    }

    GetIntegrateObject(time) {
        const integrateCard = new BookmarkCard();

        integrateCard.Add(this._objects[0]);

        return integrateCard;
    }

    SetObject(object) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let bookmark;
        let bookmarkObject;

        while (i < this._length) {
            bookmark = new Bookmark();
            bookmarkObject = object._objects[i];
            bookmark.SetObject(bookmarkObject);
            this._objects.push(bookmark);
            i++;
        }
    }    
}

export class Bookmark extends BusinessObject {
    constructor(location = 0, childForm = "", grandChildForm = "", type = "", courseName = "", stepNumber = 0, chapterNumber = -1, problemNumber = 0, solutionNumber = 0) {
        super();
        this._location = location;
        this._childForm = childForm;
        this._grandChildForm = grandChildForm;
        this._type = type;
        this._courseName = courseName;
        this._stepNumber = stepNumber;
        this._chapterNumber = chapterNumber;
        this._problemNumber = problemNumber;
        this._solutionNumber = solutionNumber;
    }

    get location() {
        return this._location;
    }

    get childForm() {
        return this._childForm;
    }

    get grandChildForm() {
        return this._grandChildForm;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        return this._type = type;
    }

    get courseName() {
        return this._courseName;
    }

    get stepNumber() {
        return this._stepNumber;
    }

    get chapterNumber() {
        return this._chapterNumber;
    }

    get problemNumber() {
        return this._problemNumber;
    }

    get solutionNumber() {
        return this._solutionNumber;
    }

    SetObject(object) {
        this._location = object._location;
        this._childForm = object._childForm;
        this._grandChildForm = object._grandChildForm;
        this._type = object._type;
        this._courseName = object._courseName;
        this._stepNumber = object._stepNumber;
        this._chapterNumber = object._chapterNumber;
        this._problemNumber = object._problemNumber;
        this._solutionNumber = object._solutionNumber;
    }
}