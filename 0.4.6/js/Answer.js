import { BusinessObject, BusinessObjects } from "./BusinessObject.js";
import { DateTime } from "./DateTime.js";

export class AnswerBook extends BusinessObjects {
    constructor() {
        super();
    }

    SetObject(object, problemList, solutionBook, questionBook) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let answerCard;
        let answerCardObject;

        while (i < object._length) {
            answerCard = new AnswerCard();
            answerCardObject = object._objects[i];
            answerCard.SetObject(answerCardObject, problemList, solutionBook, questionBook);
            this._objects.push(answerCard);
            i++;
        }
    }

    SetObjectPart(object, problemList, solutionBook, questionBook) {
        let problemObject;
        let solutionObject;
        let questionObject;
        let chapterNumber;
        let problemNumber;
        let solutionNumber;
        let questionNumber;

        let index;
        let answerCardObject;
        let i = 0;
        while (i < object._length) {
            answerCardObject = object._objects[i];
            problemObject = answerCardObject._problem;
            solutionObject = answerCardObject._solution;
            questionObject = answerCardObject._question;

            chapterNumber = parseInt(problemObject._chapterNumber);
            problemNumber = parseInt(problemObject._number);
            solutionNumber = parseInt(solutionObject._number);
            questionNumber = parseInt(questionObject._number);

            index = this.Find(chapterNumber, problemNumber, solutionNumber, questionNumber);
            if (index != -1) {
                this._objects[index].SetObject(answerCardObject, problemList, solutionBook, questionBook);
            }

            i++;
        }
    }

    Find(chapterNumber, problemNumber, solutionNumber, questionNumber) {
        let index = -1;

        let i = 0;
        while (i < this._length &&
            (this._objects[i].chapterNumber != chapterNumber || this._objects[i].problemNumber != problemNumber ||
                this._objects[i].solutionNumber != solutionNumber || this._objects[i].questionNumber != questionNumber)) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }

    GetIntegrateObject(time) {
        const integrateBook = new AnswerBook();

        let answerCard;
        let integrateCard;
        let i = 0;
        while (i < this._length) {
            answerCard = this._objects[i];
            integrateCard = answerCard.GetIntegrateObject(time);
            integrateBook.Add(integrateCard);
            i++;
        }

        return integrateBook;
    }
}

export class AnswerCard extends BusinessObjects {
    constructor(problem, solution, question) {
        super();

        this._problem = problem;
        this._solution = solution;
        this._question = question;
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

    get solution() {
        return this._solution;
    }

    get solutionNumber() {
        return this._solution.number;
    }

    get question() {
        return this._question;
    }

    get questionNumber() {
        return this._question.number;
    }

    get time() {
        return this._objects[0].time;
    }

    get content() {
        return this._objects[0].content;
    }

    SetObject(object, problemList, solutionBook, questionBook) {
        this._length = object._length;
        this._current = object._current;

        const problemObject = object._problem;
        const solutionObject = object._solution;
        const questionObject = object._question;

        const chapterNumber = parseInt(problemObject._chapterNumber);
        const problemNumber = parseInt(problemObject._number);
        const solutionNumber = parseInt(solutionObject._number);
        const questionNumber = parseInt(questionObject._number);

        let index = problemList.Find(chapterNumber, problemNumber);
        const problem = problemList.GetAt(index);

        index = solutionBook.Find(chapterNumber, problemNumber);
        const solutionList = solutionBook.GetAt(index);
        index = solutionList.Find(solutionNumber);
        const solution = solutionList.GetAt(index);

        index = questionBook.Find(chapterNumber, problemNumber, solutionNumber);
        const questionList = questionBook.GetAt(index);
        index = questionList.Find(questionNumber);
        const question = questionList.GetAt(index);

        this._problem = problem;
        this._solution = solution;
        this._question = question;

        let i = 0;
        let answer;
        let answerObject;

        while (i < this._length) {
            answer = new Answer();
            answerObject = object._objects[i];
            answer.SetObject(answerObject);
            this._objects.push(answer);
            i++;
        }
    }

    Correct(time) {
        let answer = this._objects[0];
        answer = new Answer(time, answer.content);
        this._objects[0] = answer;

        return 0;
    }

    GetIntegrateObject(time) {
        const integrateCard = new AnswerCard(this._problem, this._solution, this._question);

        let answer = this._objects[0];
        if (answer.time.IsGreaterThan(time) === true) {
            integrateCard.Add(answer);
        }

        return integrateList;
    }
}

export class Answer extends BusinessObject {
    constructor(time, content) {
        super();

        this._time = time;
        this._content = content;
    }

    get time() {
        return this._time;
    }

    get content() {
        return this._content;
    }

    SetObject(object) {
        let time = new DateTime();
        time.SetObject(object._time);

        this._time = time;
        this._content = object._content;
    }
}