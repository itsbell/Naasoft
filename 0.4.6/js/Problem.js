import { BusinessObject, BusinessObjects } from "./BusinessObject.js";

export class ProblemList extends BusinessObjects {
    constructor() {
        super();
    }

    SetObject(object) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let problem;
        let problemObject;

        while (i < this._length) {
            problem = new Problem();
            problemObject = object._objects[i];
            problem.SetObject(problemObject);
            this._objects.push(problem);
            i++;
        }
    }

    Find(chapterNumber, number) {
        let i = 0;
        let index = -1;
        let problem;

        while (i < this._length) {
            problem = this._objects[i];
            if (problem.chapterNumber == chapterNumber && problem.number == number) {
                index = i;
            }
            i++;
        }

        return index;
    }

    FindChapterRange(chapterNumber) {
        let start = -1;
        let end = -1;

        let problem;
        let i = 0;
        while (i < this._length) {
            problem = this._objects[i];
            if (problem.chapterNumber === chapterNumber) {
                if (start === -1) {
                    start = i;
                    end = i;
                }
                else {
                    end = i;
                }
            }
            i++;
        }

        return [start, end];
    }

    IsLastChapter(chapterNumber) {
        let isLast = true;

        let i = 0;
        while (i < this._length) {
            if (this._objects[i].chapterNumber > chapterNumber) {
                isLast = false;
            }
            i++;
        }

        return isLast;
    }

    IsLastProblem(chapterNumber, number) {
        let isLast = true;

        let i = 0;
        while (i < this._length) {
            if (this._objects[i].chapterNumber === chapterNumber
                && this._objects[i].number > number) {
                isLast = false;
            }
            i++;
        }

        return isLast;
    }

    MoveByChapterNumberAndNumber(chapterNumber, number) {
        let i = 0;
        let index = -1;
        let problem;

        while (i < this._length && index === -1) {
            problem = this._objects[i];
            if (problem.chapterNumber === chapterNumber && problem.number === number) {
                index = i;
            }
            i++;
        }
        if (index != -1) {
            this._current = index;
        }

        return this._current;
    }
}

export class Problem extends BusinessObject {
    constructor(chapterNumber, number, title, content, evaluate) {
        super();

        this._chapterNumber = chapterNumber;
        this._number = number;
        this._title = title;
        this._content = content;
        this._evaluate = evaluate;
    }

    get chapterNumber() {
        return this._chapterNumber;
    }

    get number() {
        return this._number;
    }

    get title() {
        return this._title;
    }

    get content() {
        return this._content;
    }

    get evaluate() {
        return this._evaluate;
    }

    SetObject(object) {
        this._chapterNumber = parseInt(object._chapterNumber);
        this._number = parseInt(object._number);
        this._title = object._title;
        this._content = object._content;
        this._evaluate = parseInt(object._evaluate);
    }
}