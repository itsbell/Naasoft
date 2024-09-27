import { ApplyBook } from "./Apply.js";
import { ProblemList } from "./Problem.js";
import { SolutionBook } from "./Solution.js";
import { FeedbackBook } from "./Feedback.js";
import { QuestionBook } from "./Question.js";
import { AnswerBook } from "./Answer.js";

export class RequestorFactory {
    /**@param {Object} */
    constructor(object) {
        this._emailAddress = object.emailAddress;
        this._courseName = object.courseName;
        this._stepNumber = object.stepNumber;
    }

    /**@param {BusinessObject} */
    Make(businessObject) {
        let requestor = null;

        if (businessObject instanceof ApplyBook) {
            requestor = new ApplyRequestor(this._emailAddress);
        }
        else if (businessObject instanceof ProblemList) {
            requestor = new ProblemRequestor(this._courseName, this._stepNumber);
        }
        else if (businessObject instanceof SolutionBook) {
            requestor = new SolutionRequestor(this._emailAddress, this._courseName, this._stepNumber);
        }
        else if (businessObject instanceof FeedbackBook) {
            requestor = new FeedbackRequestor(this._emailAddress, this._courseName, this._stepNumber);
        }
        else if (businessObject instanceof QuestionBook) {
            requestor = new QuestionRequestor(this._emailAddress, this._courseName, this._stepNumber);
        }
        else if (businessObject instanceof AnswerBook) {
            requestor = new AnswerRequestor(this._emailAddress, this._courseName, this._stepNumber);
        }

        return requestor;
    }
}

export class Requestor {
    constructor() {
        this._link = "";
        this._body = "";
    }

    Request() {
        let body = this._body;
        let response = fetch(this._link, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
            body
        });

        return response;
    }
}

export class ApplyRequestor extends Requestor {
    constructor(emailAddress) {
        super();
        this._link = `./${window.top.version}/php/GetAllApply.php`;
        this._body = `emailAddress=${emailAddress}`;
    }
}

export class ProblemRequestor extends Requestor {
    constructor(courseName, stepNumber) {
        super();
        this._link = `./${window.top.version}/php/GetProblems.php`;
        this._body = `courseName=${courseName}&stepNumber=${stepNumber}`;
    }
}

export class SolutionRequestor extends Requestor {
    constructor(emailAddress, courseName, stepNumber) {
        super();
        this._link = `./${window.top.version}/php/GetCurrentApplySolutions.php`;
        this._body = `emailAddress=${emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
    }
}

export class FeedbackRequestor extends Requestor {
    constructor(emailAddress, courseName, stepNumber) {
        super();
        this._link = `./${window.top.version}/php/GetCurrentApplyFeedbacks.php`;
        this._body = `emailAddress=${emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
    }
}

export class QuestionRequestor extends Requestor {
    constructor(emailAddress, courseName, stepNumber) {
        super();
        this._link = `./${window.top.version}/php/GetCurrentApplyQuestions.php`;
        this._body = `emailAddress=${emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
    }
}

export class AnswerRequestor extends Requestor {
    constructor(emailAddress, courseName, stepNumber) {
        super();
        this._link = `./${window.top.version}/php/GetCurrentApplyAnswers.php`;
        this._body = `emailAddress=${emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
    }
}