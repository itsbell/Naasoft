import { QuestionEditor } from "./QuestionEditor.js";

export class SolveGround {
    constructor(id, feedbackList) {

        this.element = document.createElement("div");
        this.element.logicalObject = this;
        this.element.id = id;

        this.element.addEventListener("mouseup", this.OnMouseup);
        this.element.addEventListener("mousemove", this.OnMousemove);
        this.element.addEventListener("mouseleave", this.OnMouseleave);
        this.element.tabIndex = -1; // enable focus = enable key action
        this.element.addEventListener("keyup", this.Onkeyup);

        this.current = null;
        this.zIndex = 100;
        this.feedbacks = [];
        this.length = 0;
        this.feedbackBinder = new FeedbackBinder;

        this.feedbackToggle = false;
        this.feedbackNeverShowed = true;
        this.qnaToggle = false;
        this.qnaNeverShowed = true;

        /** FeedbackBinder에서 적재하다. */
        this.feedbackBinder.Load(feedbackList);

        this.listCtrl = new ListCtrl("FEEDBACKLISTCTRL", "피드백");
        this.listCtrl.head.addEventListener("mousedown", this.OnListCtrlMousedown.bind(this.listCtrl.element));
        this.listCtrl.head.addEventListener("mouseleave", this.OnListCtrlMouseleave.bind(this.listCtrl.element));
        this.listCtrl.head.addEventListener("mousemove", this.OnListCtrlMousemove.bind(this.listCtrl.element));
        this.listCtrl.element.style.zIndex = this.zIndex;
        this.zIndex++;
        this.element.appendChild(this.listCtrl.element);

        /** FeedbackListCtrl에서 항목을 추가하다. */
        let feedbackCard;
        let subject;
        let src;
        let i = 0;
        while (i < this.feedbackBinder.Length) {
            this.listCtrl.InsertItem(i, i + 1);

            subject = null;
            src = null;
            feedbackCard = this.feedbackBinder.GetAt(i);
            switch (feedbackCard.Evaluation) {
                case -2: subject = "평가 불가";
                    src = "../assets/none.png"; break;
                case -1: subject = "완료";
                    src = "../assets/ability.png"; break;
                case 1: subject = "추상화 능력";
                    src = "../assets/ability1.png"; break;
                case 2: subject = "논리적 사고력";
                    src = "../assets/ability2.png"; break;
                case 3: subject = "문제 해결 능력";
                    src = "../assets/ability3.png"; break;
                case 4: subject = "비판적 사고력";
                    src = "../assets/ability4.png"; break;
                case 5: subject = "프로그래밍 언어 구사 능력";
                    src = "../assets/ability5.png"; break;
                case 6: subject = "디버깅 능력";
                    src = "../assets/ability6.png"; break;
                default: break;
            }
            if (src != null) {
                this.listCtrl.SetItemIcon(i, src);
            }
            this.listCtrl.SetItemSubject(i, subject);
            this.listCtrl.SetItemContent(i, feedbackCard.Content);

            i++;
        }

        /** 피드백 항목에 이벤트를 추가하다. */
        let feedbackItem;
        i = 0;
        while (i < this.listCtrl.Length) {
            feedbackItem = this.listCtrl.body.childNodes[i];
            feedbackItem.addEventListener("mousedown", this.OnListCtrlFeedbackItemMousedown);
            feedbackItem.addEventListener("mousemove", this.OnListCtrlFeedbackItemMousemove);
            feedbackItem.addEventListener("mouseleave", this.OnListCtrlFeedbackItemMouseleave);
            i++;
        }

        ////QnA////
        this.qnaListCtrl = new QnAItem("QNALISTCTRL", "질문/답변");
        this.qnaListCtrl.element.addEventListener("click", this.OnQnaListCtrlClicked);
        this.qnaListCtrl.head.addEventListener("mousedown", this.OnQnaListCtrlMousedown.bind(this.qnaListCtrl.element));
        this.qnaListCtrl.head.addEventListener("mouseleave", this.OnQnaListCtrlMouseleave.bind(this.qnaListCtrl.element));
        this.qnaListCtrl.head.addEventListener("mousemove", this.OnQnaListCtrlMousemove.bind(this.qnaListCtrl.element));
        this.qnaListCtrl.element.style.zIndex = this.zIndex;
        this.zIndex++;
        this.element.appendChild(this.qnaListCtrl.element);

    }

    get Current() {
        return this.current;
    }

    get FeedbackNeverShowed() {
        return this.feedbackNeverShowed;
    }

    get FeedbackToggle() {
        return this.feedbackToggle;
    }

    get Length() {
        return this.Length;
    }

    get QnaNeverShowed() {
        return this.qnaNeverShowed;
    }

    get QnAToggle() {
        return this.qnaToggle;
    }

    HideFeedbacks() {
        const listCtrl = this.listCtrl.element;
        listCtrl.id = `${listCtrl.logicalObject.id}_NONE`;

        let feedbackItems = document.getElementsByClassName("feedbackItem");
        while (feedbackItems.length > 0) {
            feedbackItems[0].className = "feedbackItem_none";
        }

        this.feedbackToggle = false;
    }

    HideQnA() {
        const qnaListCtrl = this.qnaListCtrl.element;
        qnaListCtrl.id = `${this.qnaListCtrl.id}_NONE`;

        this.qnaToggle = false;
    }

    OnFeedbackItemMousedown(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        const solveGround = this.parentNode.logicalObject;
        solveGround.current = this;
        this.style.zIndex = solveGround.zIndex;
        solveGround.zIndex++;
    }

    Onkeyup(event) {
        if (event.code === 'Escape') {
            /** zIndex가 가장 높은 개체를 숨긴다. */
            const solveGround = this.logicalObject;
            const listCtrl = solveGround.listCtrl.element;
            const qnaListCtrl = solveGround.qnaListCtrl.element;

            let display;
            let zIndex;
            let highest = null;
            let i = 0;
            while (i < this.childElementCount) {
                display = window.getComputedStyle(this.children[i], null).display;
                zIndex = this.children[i].style.zIndex;
                if (highest === null && display != 'none') {
                    highest = this.children[i];
                }
                else if (display != 'none' && highest.style.zIndex < zIndex) {
                    highest = this.children[i];
                }
                i++;
            }

            if (highest != null) {
                if (highest.logicalObject instanceof QnAItem) {
                    highest.id = `${qnaListCtrl.logicalObject.id}_NONE`;
                    solveGround.qnaToggle = false;
                }
                else {
                    listCtrl.id = `${listCtrl.logicalObject.id}_NONE`;

                    let feedbackItems = document.getElementsByClassName("feedbackItem");
                    while (feedbackItems.length > 0) {
                        feedbackItems[0].className = "feedbackItem_none";
                    }
                    let feedbackItem = document.getElementsByClassName("feedbackItem_focus");
                    if (feedbackItem.length > 0) {
                        feedbackItem[0].className = "feedbackItem_none";
                    }

                    solveGround.feedbackToggle = false;
                }
            }
        }
    }

    OnListCtrlMousedown(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        const solveGround = this.parentNode.logicalObject;
        solveGround.current = this;
        this.style.zIndex = solveGround.zIndex;
        solveGround.zIndex++;
    }

    OnListCtrlMouseleave(event) {
        if (this.id === "FEEDBACKLISTCTRL_FOCUS") {
            this.id = "FEEDBACKLISTCTRL";
        }
    }

    OnListCtrlMousemove(event) {
        if (this.id === "FEEDBACKLISTCTRL") {
            this.id = "FEEDBACKLISTCTRL_FOCUS";
        }
    }

    OnListCtrlFeedbackItemMousedown(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        let listCtrl = document.getElementById("FEEDBACKLISTCTRL");
        let body = listCtrl.logicalObject.body;
        let top = listCtrl.offsetTop + this.offsetTop - body.scrollTop;
        let left = listCtrl.offsetLeft + this.offsetLeft;

        let solveGround = document.getElementById("SOLVEGROUND").logicalObject;
        solveGround.element.appendChild(this);

        this.className = `feedbackItem_focus`;
        this.style.top = `${top}px`;
        this.style.left = `${left}px`;

        solveGround.current = this;
        this.style.zIndex = solveGround.zIndex;
        solveGround.zIndex++;

        this.removeEventListener("mousedown", solveGround.OnListCtrlFeedbackItemMousedown);
        this.addEventListener("mousedown", solveGround.OnFeedbackItemMousedown);
    }

    OnListCtrlFeedbackItemMouseleave(event) {
        if (this.className === "FEEDBACKLISTCTRL_item_focus") {
            this.className = "FEEDBACKLISTCTRL_item";
        }
        else if (this.className === "feedbackItem_focus") {
            this.className = "feedbackItem";
        }
    }

    OnListCtrlFeedbackItemMousemove(event) {
        if (this.className === "FEEDBACKLISTCTRL_item") {
            this.className = "FEEDBACKLISTCTRL_item_focus";
        }
        else if (this.className === "feedbackItem") {
            this.className = "feedbackItem_focus";
        }
    }

    OnMouseleave(event) {
        if (this.logicalObject.current != null) {
            let element = this.logicalObject.current;

            let distanceX = event.clientX - element.x;
            let distanceY = event.clientY - element.y;

            let maxLeft = this.offsetLeft + this.offsetWidth - element.offsetWidth;
            let maxTop = this.offsetTop + this.offsetHeight - element.offsetHeight;

            let left = element.offsetLeft + distanceX;
            if (left < 0) {
                left = 0;
            }
            else if (left > maxLeft) {
                left = maxLeft;
            }
            element.style.left = `${left}px`;

            let top = element.offsetTop + distanceY;
            if (top < 0) {
                top = 0;
            }
            else if (top > maxTop) {
                top = maxTop;
            }
            element.style.top = `${top}px`;

            element.x = event.clientX;
            element.y = event.clientY;
        }
    }

    OnMousemove(event) {
        // 이동
        const solveGround = this.logicalObject;
        if (solveGround.current != null) {
            let element = this.logicalObject.current;

            let distanceX = event.clientX - element.x;
            let distanceY = event.clientY - element.y;

            let maxLeft = this.offsetLeft + this.offsetWidth - element.offsetWidth;
            let maxTop = this.offsetTop + this.offsetHeight - element.offsetHeight;

            let left = element.offsetLeft + distanceX;
            if (left < 0) {
                left = 0;
            }
            else if (left > maxLeft) {
                left = maxLeft;
            }
            element.style.left = `${left}px`;

            let top = element.offsetTop + distanceY;
            if (top < 0) {
                top = 0;
            }
            else if (top > maxTop) {
                top = maxTop;
            }
            element.style.top = `${top}px`;

            element.x = event.clientX;
            element.y = event.clientY;
        }


        if (solveGround.current != null &&
            (solveGround.current.className === "feedbackItem" || solveGround.current.className === "feedbackItem_focus")) {
            const listCtrl = solveGround.listCtrl.element;
            let left = listCtrl.offsetLeft;
            let right = left + listCtrl.offsetWidth;
            let top = listCtrl.offsetTop;
            let bottom = top + listCtrl.offsetHeight;
            if (event.clientX > left && event.clientX < right &&
                event.clientY > top && event.clientY < bottom) {
                if (listCtrl.id !== "FEEDBACKLISTCTRL_FOCUS") {
                    listCtrl.id = "FEEDBACKLISTCTRL_FOCUS";
                }
            }
            else {
                if (listCtrl.id === "FEEDBACKLISTCTRL_FOCUS") {
                    listCtrl.id = "FEEDBACKLISTCTRL";
                }
            }
        }
    }

    OnMouseup(event) {
        const solveGround = this.logicalObject;
        if (solveGround.current != null &&
            (solveGround.current.className === "feedbackItem" || solveGround.current.className === "feedbackItem_focus")) {
            const listCtrl = solveGround.listCtrl.element;
            const listBody = solveGround.listCtrl.body;
            let left = listCtrl.offsetLeft;
            let right = left + listCtrl.offsetWidth;
            let top = listCtrl.offsetTop;
            let bottom = top + listCtrl.offsetHeight;
            if (event.clientX > left && event.clientX < right &&
                event.clientY > top && event.clientY < bottom) {
                listCtrl.id = "FEEDBACKLISTCTRL";
                solveGround.current.className = `${listCtrl.logicalObject.id}_item`;
                listBody.appendChild(solveGround.current);
                listCtrl.style.zIndex = solveGround.zIndex;
                solveGround.zIndex++;

                solveGround.current.removeEventListener("mousedown", solveGround.OnFeedbackItemMousedown);
                solveGround.current.addEventListener("mousedown", solveGround.OnListCtrlFeedbackItemMousedown);
            }
        }
        solveGround.current = null;
    }

    OnQnaListCtrlClicked(event) {
        const solveGround = this.parentNode.logicalObject;
        this.style.zIndex = solveGround.zIndex;
        solveGround.zIndex++;
    }

    OnQnaListCtrlMousedown(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        const solveGround = this.parentNode.logicalObject;
        solveGround.current = this;
        this.style.zIndex = solveGround.zIndex;
        solveGround.zIndex++;
    }

    OnQnaListCtrlMouseleave(event) {
        if (this.id === "QNALISTCTRL_FOCUS") {
            this.id = "QNALISTCTRL";
        }
    }

    OnQnaListCtrlMousemove(event) {
        if (this.id === "QNALISTCTRL") {
            this.id = "QNALISTCTRL_FOCUS";
        }
    }

    ShowFeedbacks() {
        const listCtrl = this.listCtrl.element;
        listCtrl.id = `${listCtrl.logicalObject.id}`;
        listCtrl.style.zIndex = this.zIndex;
        this.zIndex++;

        let feedbackItems = document.getElementsByClassName("feedbackItem_none");
        while (feedbackItems.length > 0) {
            feedbackItems[0].style.zIndex = this.zIndex;
            this.zIndex++;
            feedbackItems[0].className = "feedbackItem";
        }

        if (this.feedbackNeverShowed === true) {
            let solutionView = document.getElementById("SOLUTIONVIEW");
            let solutionViewHead = document.getElementsByClassName("solutionView-head")[0];
            let left = `${solutionView.offsetLeft + (solutionViewHead.offsetWidth / 2) - 200}px`;

            listCtrl.style.left = left;
            listCtrl.style.top = `${solutionView.offsetTop + solutionViewHead.offsetHeight}px`;
            this.feedbackNeverShowed = false;
        }
        this.feedbackToggle = true;
    }

    ShowQnA() {
        const qnaListCtrl = this.qnaListCtrl.element;

        qnaListCtrl.id = `${qnaListCtrl.logicalObject.id}`;
        qnaListCtrl.style.zIndex = this.zIndex;
        this.zIndex++;

        if (this.qnaNeverShowed === true) {
            const solutionView = document.getElementById("SOLUTIONVIEW");

            let middle = solutionView.offsetLeft + (solutionView.offsetWidth / 2);
            let left = middle - (qnaListCtrl.offsetWidth / 2);

            middle = solutionView.offsetTop + (solutionView.offsetHeight / 2);
            let top = middle - (qnaListCtrl.offsetHeight / 2);

            qnaListCtrl.style.left = `${left}px`;
            qnaListCtrl.style.top = `${top}px`;

            this.qnaNeverShowed = false;
        }
        this.qnaToggle = true;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ListCtrl {
    constructor(id, subject) {
        this.id = id;
        this.element = document.createElement("div");
        this.element.logicalObject = this;
        this.element.id = `${id}_NONE`;
        this.element.x = 0;
        this.element.y = 0;
        this.length = 0;

        this.head = document.createElement("div");
        this.head.id = `${this.id}_HEAD`;
        this.element.appendChild(this.head);

        this.head.subject = document.createElement("div");
        this.head.subject.id = `${this.head.id}_SUBJECT`;
        this.head.subject.textContent = subject;
        this.head.appendChild(this.head.subject);

        this.head.menu = document.createElement("div");
        this.head.menu.id = `${this.head.id}_MENU`;
        this.head.appendChild(this.head.menu);

        this.body = document.createElement("div");
        this.body.id = `${this.id}_BODY`;
        this.element.appendChild(this.body);
    }

    get Length() {
        return this.length;
    }

    InsertItem(i, number) {
        let item = document.createElement("div");
        item.className = `${this.id}_item`;
        this.body.appendChild(item);

        item.head = document.createElement("div");
        item.head.className = `${item.className}_head`;
        item.appendChild(item.head);

        item.head.number = document.createElement("div");
        item.head.number.className = `${item.head.className}_number`;
        item.head.number.textContent = number;
        item.head.appendChild(item.head.number);

        item.head.subject = document.createElement("div");
        item.head.subject.className = `${item.head.className}_subject`;
        item.head.appendChild(item.head.subject);

        item.head.icon = document.createElement("div");
        item.head.icon.className = `${item.head.className}_icon`;
        item.head.appendChild(item.head.icon);

        item.body = document.createElement("div");
        item.body.className = `${item.className}_body`;
        item.appendChild(item.body);

        this.length++;
    }

    SetItemContent(i, content) {
        let item = this.body.childNodes[i];
        item.body.textContent = content;
    }

    SetItemIcon(i, src) {
        let item = this.body.childNodes[i];
        item.head.icon.img = document.createElement("img");
        item.head.icon.img.className = `${item.head.icon.className}_img`;
        item.head.icon.img.src = src;
        item.head.icon.appendChild(item.head.icon.img);
    }

    SetItemSubject(i, subject) {
        let item = this.body.childNodes[i];
        item.head.subject.textContent = subject;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class FeedbackBinder {
    constructor() {
        this.cards = [];
        this.length = 0;
    }

    get Length() {
        return this.length;
    }

    GetAt(index) {
        return this.cards[index];
    }

    /** @return {number} */
    Load(feedbackList) {
        let i = 0;
        let feedback;
        let feedbackCard;

        if (feedbackList != null) {
            while (i < feedbackList.length) {
                feedback = feedbackList.GetAt(i);
                feedbackCard = new FeedbackCard(feedback.time, parseInt(feedback.evaluate), feedback.content);
                this.cards.push(feedbackCard);
                this.length++;
                i++;
            }
        }

        return this.length;
    }

    /** @return {number} */
    TakeIn(time, evaluation, content) {
        let feedbackCard = new FeedbackCard(time, evaluation, content);
        let index = this.cards.push(feedbackCard);
        this.length++;

        return index - 1;
    }

    /** @return {FeedbackCard} */
    TakeOut(index) {
        let feedbackCard = new FeedbackCard(this.cards[index].Time, this.cards[index].Evaluate, this.cards[index].Content);
        this.cards.splice(index, 1);
        this.length--;

        return feedbackCard;
    }

};

class FeedbackCard {
    constructor(time, evaluation, content) {
        this.time = time;
        this.evaluation = evaluation;
        this.content = content;
    }

    get Time() {
        return this.time;
    }

    get Evaluation() {
        return this.evaluation;
    }

    get Content() {
        return this.content;
    }
}

export class QnAItem {
    constructor(id, subject) {
        this.id = id;
        this.element = document.createElement("div");
        this.element.logicalObject = this;
        this.element.id = `${id}_NONE`;
        this.element.x = 0;
        this.element.y = 0;
        this.length = 0;

        this.head = document.createElement("div");
        this.head.id = `${this.id}_HEAD`;
        this.element.appendChild(this.head);

        this.head.subject = document.createElement("div");
        this.head.subject.id = `${this.head.id}_SUBJECT`;
        this.head.subject.textContent = subject;
        this.head.appendChild(this.head.subject);

        this.head.menu = document.createElement("div");
        this.head.menu.id = `${this.head.id}_MENU`;
        this.head.appendChild(this.head.menu);

        this.body = document.createElement("div");
        this.body.id = `${this.id}_BODY`;
        this.element.appendChild(this.body);

        ///////////////////////////////////////////////

        this.list = document.createElement("ul");
        this.list.className = "QNAView-body-list";
        this.body.appendChild(this.list);

        let editor = document.createElement("div");
        editor.id = "QUESTIONEDITOR";
        editor.className = "questionEditor";
        this.body.appendChild(editor);

        const questionEditor = new QuestionEditor("QUESTIONEDITOR", editor);
    }

    AddQuestion(text) {
        let item = document.createElement("li");
        item.className = "QNAView-body-list-item-question";
        this.list.appendChild(item);

        let head = document.createElement("div");
        head.className = "QNAView-body-list-item-head"
        head.textContent = "질문";
        item.appendChild(head);

        let body = document.createElement("div");
        body.className = "QNAView-body-list-item-body";
        body.textContent = text;
        item.appendChild(body);

        return this.list.children.length - 1;
    }

    AddAnswer(text) {
        let item = document.createElement("li");
        item.className = "QNAView-body-list-item-answer";
        this.list.appendChild(item);

        let head = document.createElement("div");
        head.className = "QNAView-body-list-item-head"
        head.textContent = "답변";
        item.appendChild(head);

        let body = document.createElement("div");
        body.className = "QNAView-body-list-item-body";
        body.textContent = text;
        item.appendChild(body);

        return this.list.children.length - 1;
    }

    MakeTalks(questionList, answerBook) {
        let question;
        let index;
        let answer;
        let i = 0;
        while (i < questionList.length) {
            question = questionList.GetAt(i);
            this.AddQuestion(question.content);

            index = answerBook.Find(questionList.chapterNumber, questionList.problemNumber,
                questionList.solutionNumber, question.number);
            if (index != -1) {
                answer = answerBook.GetAt(index).GetAt(0);
                if (answer.content != "") {
                    this.AddAnswer(answer.content);
                }
            }

            i++;
        }
    }
}