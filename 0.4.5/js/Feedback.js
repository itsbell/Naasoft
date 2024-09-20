import { BusinessObject, BusinessObjects } from "./BusinessObject.js";
import { DateTime } from "./DateTime.js";

export class FeedbackBook extends BusinessObjects {
    constructor() {
        super();
    }

    Find(chapterNumber, problemNumber, solutionNumber) {
        let index = -1;

        let i = 0;
        while (i < this._length &&
            (this._objects[i].chapterNumber != chapterNumber ||
                this._objects[i].problemNumber != problemNumber ||
                this._objects[i].solutionNumber != solutionNumber)) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }

    SetObject(object, problemList, solutionBook) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let feedbackList;
        let feedbackListObject;

        while (i < this._length) {
            feedbackList = new FeedbackList();
            feedbackListObject = object._objects[i];
            feedbackList.SetObject(feedbackListObject, problemList, solutionBook);
            this._objects.push(feedbackList);
            i++;
        }
    }
}

export class FeedbackList extends BusinessObjects {
    constructor(problem, solution) {
        super();

        this._problem = problem;
        this._solution = solution;
    }

    get problem() {
        return this._problem;
    }

    get solution() {
        return this._solution;
    }

    get chapterNumber() {
        return this._problem.chapterNumber;
    }

    get problemNumber() {
        return this._problem.number;
    }

    get solutionNumber() {
        return this._solution.number;
    }

    SetObject(object, problemList, solutionBook) {
        this._length = object._length;
        this._current = object._current;

        const problemObject = object._problem;
        const solutionObject = object._solution;
        const chapterNumber = parseInt(problemObject._chapterNumber);
        const problemNumber = parseInt(problemObject._number);
        const solutionNumber = parseInt(solutionObject._number);

        let index = problemList.Find(chapterNumber, problemNumber);
        const problem = problemList.GetAt(index);

        index = solutionBook.Find(chapterNumber, problemNumber);
        const solutionList = solutionBook.GetAt(index);
        index = solutionList.Find(solutionNumber);
        const solution = solutionList.GetAt(index);

        this._problem = problem;
        this._solution = solution;

        let i = 0;
        let feedback;
        let feedbackObject;

        while (i < this._length) {
            feedback = new Feedback();
            feedbackObject = object._objects[i];
            feedback.SetObject(feedbackObject);
            this._objects.push(feedback);
            i++;
        }
    }
}

export class Feedback extends BusinessObject {
    constructor(time, content, evaluate) {
        super();

        this._time = time;
        this._content = content;
        this._evaluate = evaluate;
    }

    get time() {
        return this._time;
    }

    get content() {
        return this._content;
    }

    get evaluate() {
        return this._evaluate;
    }

    SetObject(object) {
        let time = new DateTime();
        time.SetObject(object._time);

        this._time = time;
        this._content = object._content;
        this.__evaluate = parseInt(object._evaluate);
    }
}