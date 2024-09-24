import { ApplyBook } from "./Apply.js";
import { BookmarkCard } from "./Bookmark.js";
import { PlayShelf } from "./Play.js";

export class Observer {

}

export class HistoryController extends Observer {
    constructor(form) {
        super();
        this._form = form;
        this._history = window.top.history;
        this._isPushed = false;
    }

    get form() {
        return this._form;
    }

    get history() {
        return this._history;
    }

    get state() {
        return this._history.state;
    }

    get isPushed() {
        return this._isPushed;
    }

    set isPushed(isPushed) {
        this._isPushed = isPushed;
    }

    Update() {
        if (this._isPushed === false) {
            let formId = "";
            let childFormId = "";
            let grandChildFormId = "";
            let type = "";
            let courseName = "";
            let stepNumber = 0;
            let chapterNumber = -1;
            let problemNumber = 0;
            let solutionNumber = 0;

            formId = this._form.id;
            const childForm = this._form.frame.contentDocument.getElementById(this._form.frame.id).logicalObject;
            childFormId = childForm.id;

            if (childForm.frame.contentDocument.getElementById(childForm.frame.id) != null) {
                const grandChildForm = childForm.frame.contentDocument.getElementById(childForm.frame.id).logicalObject;
                grandChildFormId = grandChildForm.id;
            }

            const bookmarkCard = BookmarkCard.GetInstance();
            if (bookmarkCard.length > 0) {
                type = bookmarkCard.type;
                chapterNumber = bookmarkCard.chapterNumber;
            }

            const applyBook = ApplyBook.GetInstance();
            let applyCard;
            if (applyBook.current != -1) {
                applyCard = applyBook.GetAt(applyBook.current);
                courseName = applyCard.courseName;
                stepNumber = applyCard.stepNumber;
            }

            const playShelf = PlayShelf.GetInstance();
            let playCase = null;
            if (playShelf.current != -1) {
                playCase = playShelf.GetAt(playShelf.current);
            }

            if (playCase != null) {
                const problemList = playCase.GetAt(0);
                let problem;
                if (problemList.current != -1) {
                    problem = problemList.GetAt(problemList.current);
                    chapterNumber = problem.chapterNumber;
                    problemNumber = problem.number;
                }

                const solutionBook = playCase.GetAt(1);
                let solutionList;
                let solution;
                if (solutionBook.current != -1) {
                    solutionList = solutionBook.GetAt(solutionBook.current);
                    if (solutionList.current != -1) {
                        solution = solutionList.GetAt(solutionList.current);
                        solutionNumber = solution.number;
                    }
                }
            }

            let state = new HistoryState(childFormId, grandChildFormId, type, courseName, stepNumber, chapterNumber, problemNumber, solutionNumber);
            this._history.pushState(state, "", "");
        }
        this._isPushed = false;
    }
}

export class HistoryState {
    constructor(childForm = "", grandChildForm = "", type = "", courseName = "", stepNumber = 0, chapterNumber = -1, problemNumber = 0, solutionNumber = 0) {
        this._childForm = childForm;
        this._grandChildForm = grandChildForm;
        this._type = type;
        this._courseName = courseName;
        this._stepNumber = stepNumber;
        this._chapterNumber = chapterNumber;
        this._problemNumber = problemNumber;
        this._solutionNumber = solutionNumber;
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