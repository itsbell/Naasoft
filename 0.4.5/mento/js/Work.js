export class WorkList {
    constructor() {
        this._works = [];
        this._length = 0;
    }

    get length() {
        return this._length;
    }

    Add(type, time, menteeName, menteeEmailAddress, courseName, stepNumber, chapterNumber, problemNumber, solutionNumber) {
        let work = new Work(type, time, menteeName, menteeEmailAddress, courseName, stepNumber, chapterNumber, problemNumber, solutionNumber);
        this._works[this._length] = work;
        this._length++;
    }

    Correct(index, type, time, menteeName, menteeEmailAddress, courseName, stepNumber, chapterNumber, problemNumber, solutionNumber) {
        let work = new Work(type, time, menteeName, menteeEmailAddress, courseName, stepNumber, chapterNumber, problemNumber, solutionNumber);
        this._works[index] = work;
    }

    GetAt(index) {
        return this._works[index];
    }

    Arrange() {
        let i = 1;
        let j;
        let temp = [];

        while (i < this._length) {
            temp = this._works[i];
            j = i - 1;
            while (j >= 0 && this._works[j].time.IsGreaterThan(temp.time)) {
                this._works[j + 1] = this._works[j];
                j--;
            }
            this._works[j + 1] = temp;
            i++;
        }
    }
}

export class Work {
    constructor(type, time, menteeName, menteeEmailAddress, courseName, stepNumber, chapterNumber, problemNumber, solutionNumber) {
        this._type = type;
        this._time = time;
        this._menteeName = menteeName;
        this._menteeEmailAddress = menteeEmailAddress;
        this._courseName = courseName;
        this._stepNumber = stepNumber;
        this._chapterNumber = chapterNumber;
        this._problemNumber = problemNumber;
        this._solutionNumber = solutionNumber;
    }

    get type() {
        return this._type;
    }

    get time() {
        return this._time;
    }

    get menteeName() {
        return this._menteeName;
    }

    get menteeEmailAddress() {
        return this._menteeEmailAddress;
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
}