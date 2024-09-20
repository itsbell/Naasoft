import { BusinessObjects } from "./BusinessObject.js";
import { ProblemList } from "./Problem.js";
import { SolutionBook } from "./Solution.js";
import { FeedbackBook } from "./Feedback.js";
import { QuestionBook } from "./Question.js";
import { AnswerBook } from "./Answer.js";

export class PlayShelf extends BusinessObjects {
    constructor() {
        super();

        this.id = 1;
    }

    static GetInstance() {
        if (window.top.businessObjects["PLAYSHELF"] === undefined) {
            window.top.businessObjects["PLAYSHELF"] = new PlayShelf();
        }
        return window.top.businessObjects["PLAYSHELF"];
    }

    Find(courseName, stepNumber) {
        let index = -1;

        let i = 0;
        while (i < this._length &&
            (this._objects[i].applyCard.courseName != courseName ||
                this._objects[i].applyCard.stepNumber != stepNumber)) {
            i++;
        }
        if (i < this._length) {
            index = i;
        }

        return index;
    }

    SetObject(object, applyBook) {
        this._objects.splice(0, this._length);
        this._length = object._length;
        this._current = object._current;

        let i = 0;
        let playCase;
        let playCaseObject;

        while (i < this._length) {
            playCase = new PlayCase();
            playCaseObject = object._objects[i];
            playCase.SetObject(playCaseObject, applyBook);
            this._objects.push(playCase);
            i++;
        }
    }

    GetSolutionsAndQuestionsUntilNow(time) {
        let nowShelf = new PlayShelf();

        let playCase;
        let nowCase;
        let solutionBook;
        let nowSolutionBook;
        // let questionBook;
        // let nowQuestionBook;
        let i = 0;
        while (i < this._length) {
            playCase = this._objects[i];
            nowCase = new PlayCase(playCase.applyCard);

            solutionBook = playCase.GetAt(1);
            nowSolutionBook = solutionBook.GetAllUntilNow(time);
            nowCase.Add(nowSolutionBook);
            
            // questionBook = playCase.GetAt(3);
            // nowQuestionBook = questionBook.GetAllUntilNow(time);
            // nowCase.Add(nowQuestionBook);

            nowShelf.Add(nowCase);
            i++;
        }

        return nowShelf;
    }
}

export class PlayCase extends BusinessObjects {
    constructor(applyCard) {
        super();

        this._applyCard = applyCard;
    }

    get applyCard() {
        return this._applyCard;
    }

    SetObject(object, applyBook) {
        this._length = object._length;
        this._current = object._current;

        const applyCardObject = object._applyCard;
        const courseObject = applyCardObject._course;
        const stepObject = applyCardObject._step;
        const courseName = courseObject._name;
        const stepNumber = parseInt(stepObject._number);

        let index = applyBook.Find(courseName, stepNumber);
        const applyCard = applyBook.GetAt(index);
        this._applyCard = applyCard;

        let i = 0;
        let problemList;
        let solutionBook;
        let feedbackBook;
        let questionBook;
        let answerBook;

        while (i < this._length) {
            switch (i) {
                case 0: problemList = new ProblemList();
                    problemList.SetObject(object._objects[i]);
                    this._objects.push(problemList); break;
                case 1: solutionBook = new SolutionBook();
                    solutionBook.SetObject(object._objects[i], problemList);
                    this._objects.push(solutionBook); break;
                case 2: feedbackBook = new FeedbackBook();
                    feedbackBook.SetObject(object._objects[i], problemList, solutionBook);
                    this._objects.push(feedbackBook); break;
                case 3: questionBook = new QuestionBook();
                    questionBook.SetObject(object._objects[i], problemList, solutionBook);
                    this._objects.push(questionBook); break;
                case 4: answerBook = new AnswerBook();
                    answerBook.SetObject(object._objects[i], problemList, solutionBook, questionBook);
                    this._objects.push(answerBook); break;
                default: break;
            }
            i++;
        }
    }
}