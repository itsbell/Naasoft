import { BusinessObject, BusinessObjects } from "./BusinessObject.js";
import { DateTime } from "./DateTime.js";

export class SolutionBook extends BusinessObjects {
    constructor() {
        super();
    }

    SetObject(object, problemList) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let solutionList;
        let solutionListObject;

        while (i < this._length) {
            solutionList = new SolutionList();
            solutionListObject = object._objects[i];
            solutionList.SetObject(solutionListObject, problemList);
            this._objects.push(solutionList);
            i++;
        }
    }

    Find(chapterNumber, problemNumber) {
        let i = 0;
        let index = -1;
        let solutionList;
        let problem;
        let chapterNumber_;
        let problemNumber_

        while (i < this._length && index === -1) {
            solutionList = this._objects[i];
            problem = solutionList.problem;
            chapterNumber_ = problem.chapterNumber;
            problemNumber_ = problem.number;

            if (chapterNumber_ === chapterNumber && problemNumber_ === problemNumber) {
                index = i;
            }

            i++;
        }

        return index;
    }

    FindBySolution(solution) {
        let index = -1;

        let i = 0;
        while (i < this._length && this._objects[i].FindBySolution(solution) === -1) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }
    
    FindFinished() {
        let index = -1;

        let i = 0;
        while (i < this._length && this._objects[i].state != "FINISH") {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }

    GetIntegrateObject(time) {
        const integrateBook = new SolutionBook();

        let solutionList;
        let integrateList;
        let i = 0;
        while (i < this._length) {
            solutionList = this._objects[i];
            integrateList = solutionList.GetIntegrateObject(time);
            integrateBook.Add(integrateList);
            i++;
        }

        return integrateBook;
    }
}

export class SolutionList extends BusinessObjects {
    constructor(problem) {
        super();

        this._problem = problem;
    }

    get problem() {
        return this._problem;
    }

    get chapterNumber() {
        return this._problem.chapterNumber;
    }

    get problemNumber() {
        return this._problem.number;
    }

    Correct(index, time) {
        let solution = this._objects[index];
        solution = new Solution(time, solution.state, solution.number, solution.content, solution.image);
        this._objects[index] = solution;

        return index;
    }

    EncodeContent(index) {
        let solution = this._objects[index];
        solution = new Solution(solution.time, solution.state, solution.number, encodeURIComponent(solution.content), solution.image);
        this._objects[index] = solution;

        return index;
    }

    SetObject(object, problemList) {
        const problemObject = object._problem;
        const chapterNumber = parseInt(problemObject._chapterNumber);
        const problemNumber = parseInt(problemObject._number);

        let index = problemList.Find(chapterNumber, problemNumber);
        let problem = problemList.GetAt(index);
        this._problem = problem;

        let i = 0;
        let solution;
        let solutionObject;

        this._length = object._length;
        this._current = object._current;

        while (i < this._length) {
            solution = new Solution();
            solutionObject = object._objects[i];
            solution.SetObject(solutionObject);
            this._objects.push(solution);
            i++;
        }
    }

    Find(number) {
        let i = 0;
        let index = -1;
        let solution;

        while (i < this._length && index === -1) {
            solution = this._objects[i];
            if (solution.number === number) {
                index = i;
            }
            i++;
        }

        return index;
    }

    FindBySolution(solution) {
        let index = -1;

        let i = 0;
        while (i < this._length && this._objects[i] != solution) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }

    GetIntegrateObject(time) {
        const integrateList = new SolutionList(this._problem);

        let solution;
        let i = 0;
        while (i < this._length) {
            solution = this._objects[i];
            if (solution.time.IsGreaterThan(time) === true) {
                solution = solution.Clone();
                let index = integrateList.Add(solution);
                integrateList.EncodeContent(index);
            }
            i++;
        }

        return integrateList;
    }
}

export class Solution extends BusinessObject {
    constructor(time, state, number, content, image) {
        super();

        this._time = time;
        this._state = state;
        this._number = number;
        this._content = content;
        this._image = image;
    }

    get time() {
        return this._time;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;
    }

    get number() {
        return this._number;
    }

    get content() {
        return this._content;
    }

    get image() {
        return this._image;
    }

    set image(image) {
        this._image = image;
    }

    Clone() {
        return new Solution(this._time, this._state, this._number, this._content, this._image);
    }

    SetObject(object) {
        let time = new DateTime();
        time.SetObject(object._time);

        this._time = time;
        this._state = object._state;
        this._number = parseInt(object._number);
        this._content = object._content;
        this._image = object._image;
    }
}