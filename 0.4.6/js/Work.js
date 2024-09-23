export class WorkList {
    constructor() {
        this._works = [];
        this._length = 0;
    }

    get length() {
        return this._length;
    }

    Add(time, type, chapterNumber, problemNumber, solutionNumber) {
        let work = new Work(time, type, chapterNumber, problemNumber, solutionNumber);
        this._works.push(work);
        this._length++;

        return this._length - 1;
    }

    Arrange() {
        let i = 1;
        let j;
        let temp = [];

        while (i < this._length) {
            temp = this._works[i];
            j = i - 1;
            while (j >= 0 && this._works[j].time.IsLessThan(temp.time)) {
                this._works[j + 1] = this._works[j];
                j--;
            }
            this._works[j + 1] = temp;
            i++;
        }
    }

    Correct(time, type, chapterNumber, problemNumber, solutionNumber) {
        let work = new Work(time, type, chapterNumber, problemNumber, solutionNumber);
        this._works.push(work);
        this._length++;
    }

    LoadAnswerBook(answerBook) {
        let i = 0;
        let j;
        let count = 0;
        let work;
        let answer;
        let answerCard;
        let problem;
        let solution;
        while (i < answerBook.length) {
            answerCard = answerBook.GetAt(i);
            problem = answerCard.problem;
            solution = answerCard.solution;
            j = 0;
            while (j < answerCard.length) {
                answer = answerCard.GetAt(j);
                work = new Work(answer, answer.time, problem.chapterNumber, problem.number, solution.number);
                this._works.push(work);
                this._length++;
                count++;
                j++;
            }
            i++;
        }
        return count;
    }

    /** 기능: 풀이의 마지막 피드백만 적재됩니다. */
    LoadFeedbackBook(feedbackBook) {
        let i = 0;
        let count = 0;
        let work;
        let feedback;
        let feedbackList;
        let problem;
        let solution;

        while (i < feedbackBook.length) {
            feedbackList = feedbackBook.GetAt(i);
            feedback = feedbackList.GetAt(feedbackList.length - 1);
            problem = feedbackList.problem;
            solution = feedbackList.solution;
            work = new Work(feedback, feedback.time, problem.chapterNumber, problem.number, solution.number);
            this._works.push(work);
            this._length++;
            count++;
            i++;
        }

        return count;
    }

    LoadSolutionBook(solutionBook) {
        let i = 0;
        let j;
        let count = 0;
        let work;
        let problem;
        let solution;
        let solutionList;

        while (i < solutionBook.length) {
            solutionList = solutionBook.GetAt(i);
            problem = solutionList.problem;
            j = 0;
            while (j < solutionList.length) {
                solution = solutionList.GetAt(j);
                work = new Work(solution, solution.time, problem.chapterNumber, problem.number, solution.number);
                this._works.push(work);
                this._length++;
                count++;
                j++;
            }
            i++;
        }

        return count;
    }

    LoadQuestionBook(questionBook) {
        let i = 0;
        let j;
        let count = 0;
        let work;
        let question;
        let questionList;
        let problem;
        let solution;

        while (i < questionBook.length) {
            questionList = questionBook.GetAt(i);
            problem = questionList.problem;
            solution = questionList.solution;

            j = 0;
            while (j < questionList.length) {
                question = questionList.GetAt(j);
                work = new Work(question, question.time, problem.chapterNumber, problem.number, solution.number);
                this._works.push(work);
                this._length++;
                count++;
                j++;
            }
            i++;
        }

        return count;
    }

    GetAt(index) {
        return this._works[index];
    }

}

export class Work {
    constructor(object, time, chapterNumber, problemNumber, solutionNumber) {
        this._object = object;
        this._time = time;
        this._chapterNumber = chapterNumber;
        this._problemNumber = problemNumber;
        this._solutionNumber = solutionNumber;
    }

    get object() {
        return this._object;
    }

    get time() {
        return this._time;
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