import { BusinessObject, BusinessObjects } from "./BusinessObject.js";
import { DateTime } from "./DateTime.js";

export class QuestionBook extends BusinessObjects {
    constructor() {
        super();
    }

    Find(chapterNumber, problemNumber, solutionNumber) {
        let i = 0;
        let index = -1;
        let questionList;
        let problem;
        let solution;
        let chapterNumber_;
        let problemNumber_;
        let solutionNumber_;

        while (i < this._length && index === -1) {
            questionList = this._objects[i];
            problem = questionList.problem;
            solution = questionList.solution;
            chapterNumber_ = problem.chapterNumber;
            problemNumber_ = problem.number;
            solutionNumber_ = solution.number;
            if (chapterNumber_ === chapterNumber && problemNumber_ === problemNumber && solutionNumber_ === solutionNumber) {
                index = i;
            }
            i++;
        }

        return index;
    }

    SetObject(object, problemList, solutionBook) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let questionList;
        let questionListObject;

        while (i < this._length) {
            questionList = new QuestionList();
            questionListObject = object._objects[i];
            questionList.SetObject(questionListObject, problemList, solutionBook);
            this._objects.push(questionList);
            i++;
        }
    }
}

export class QuestionList extends BusinessObjects {
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

    Correct(index, time) {
        let question = this._objects[index];
        question = new Question(question.number, time, question.content);
        this._objects[index] = question;

        return index;
    }

    Find(number) {
        let i = 0;
        let index = -1;
        let question;

        while (i < this._length && index === -1) {
            question = this.objects[i];
            if (question.number === number) {
                index = i;
            }
            i++;
        }

        return index;
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
        let question;
        let questionObject;

        while (i < this._length) {
            question = new Question();
            questionObject = object._objects[i];
            question.SetObject(questionObject);
            this._objects.push(question);
            i++;
        }
    }
}

export class Question extends BusinessObject {
    constructor(number, time, content) {
        super();

        this._number = number;
        this._time = time;
        this._content = content;
    }

    get number() {
        return this._number;
    }

    get time() {
        return this._time;
    }

    get content() {
        return this._content;
    }

    SetObject(object) {
        this._number = parseInt(object._number);

        let time = new DateTime();
        time.SetObject(object._time);
        this._time = time;
        this._content = object._content;
    }
}