import { CompositeWindow } from "../../js/Window.js";
import { StepBook } from "../../js/Step.js";
import { MenteeCard } from "../../js/Mentee.js";
import { ApplyBook } from "../../js/Apply.js";
import { PlayShelf, PlayCase } from "../../js/Play.js";
import { ProblemList } from "../../js/Problem.js";
import { SolutionBook } from "../../js/Solution.js";
import { FeedbackBook } from "../../js/Feedback.js";
import { QuestionBook } from "../../js/Question.js";
import { AnswerBook } from "../../js/Answer.js";
import { BookmarkCard } from "../../js/Bookmark.js";
import { PhpRequestor } from "../../js/PhpRequestor.js";
import { IndexedDB } from "../../js/IndexedDB.js";
import { Table, Tr, Td } from "../../js/Table.js";
import { Button } from "../../js/Buttons.js";
import { IndexForm } from "../../js/IndexForm.js";
import { FrameController } from "../../js/FrameController.js";

export class AbilityForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["MENTOABILITYFORM"] === undefined) {
            window.top.forms["MENTOABILITYFORM"] = new AbilityForm("MENTOABILITYFORM");
        }
        return window.top.forms["MENTOABILITYFORM"];
    }

    async OnLoaded() {        
        // 1. 이전 신청 목록을 만든다.
        const stepBook = StepBook.GetInstance();
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();
        let current = applyBook.FindCurrentCard();
        if (current != -1) {
            let applyCard = applyBook.GetAt(current);
            let index = current;
            // if (applyCard.state === "ALIVE") {
            //     index--;
            // }
            const pastTable = document.getElementById("PASTTABLE");
            const table = new Table("PASTTABLE");
            this.Add(table);
            let trElement;
            let tr;
            let tdElement;
            let td;
            let j;
            let columnCount = 6;
            let stepIndex;
            let step;
            let buttonElement;
            let button;
            let i = 0;
            while (i <= index) {
                applyCard = applyBook.GetAt(i);
                stepIndex = stepBook.Find(applyCard.courseName, applyCard.stepNumber);
                step = stepBook.GetAt(stepIndex).GetAt(0);
                trElement = document.createElement("tr");
                trElement.id = "TR" + i;
                trElement.className = "contentBox";
                pastTable.appendChild(trElement);
                tr = new Tr("TR" + i);
                table.Add(tr);

                j = 1;
                while (j <= columnCount) {
                    tdElement = document.createElement("td");
                    tdElement.id = "TR" + i + "TD" + j;
                    tdElement.className = "stepColumn";
                    trElement.appendChild(tdElement);
                    td = new Td("TR" + i + "TD" + j);
                    tr.Add(td);

                    switch (j) {
                        case 1: tdElement.textContent = (i + 1) + "권"; break;
                        case 2: tdElement.textContent = step.subject; break;
                        case 3: tdElement.textContent = applyCard.start.date; break;
                        case 4: tdElement.textContent = applyCard.end.date; break;
                        case 5: break;
                        case 6:
                            buttonElement = document.createElement("button");
                            buttonElement.id = "VIEWBUTTON" + (i + 1);
                            buttonElement.className = "completeButton";
                            tdElement.appendChild(buttonElement);
                            button = new Button("VIEWBUTTON" + (i + 1), "보기", this.OnViewButtonClicked.bind(this));
                            table.windows[i].windows[j - 1].Add(button);
                            break;
                        default: break;
                    }
                    j++;
                }
                i++;
            }
        }

        // 2. 서버에 평가 집계를 요청한다.
        const emailAddress = menteeCard.emailAddress;

        const requestor = new PhpRequestor();
        const totalListObject = await requestor.PostJson("../../php/TotalAbility.php",
            "emailAddress=" + emailAddress);

        // 3. 그래프를 만든다.
        let fullScore = 5;
        let abilityCount = 6;
        let scores = [];
        let i = 0;
        while (i < totalListObject._length) {
            scores[i] = [];
            scores[i][0] = (totalListObject._objects[i]._abstract != null) ?
                (totalListObject._objects[i]._abstract) : (-1);
            scores[i][1] = (totalListObject._objects[i]._logical != null) ?
                (totalListObject._objects[i]._logical) : (-1);
            scores[i][2] = (totalListObject._objects[i]._solve != null) ?
                (totalListObject._objects[i]._solve) : (-1);
            scores[i][3] = (totalListObject._objects[i]._critical != null) ?
                (totalListObject._objects[i]._critical) : (-1);
            scores[i][4] = (totalListObject._objects[i]._language != null) ?
                (totalListObject._objects[i]._language) : (-1);
            scores[i][5] = (totalListObject._objects[i]._debugging != null) ?
                (totalListObject._objects[i]._debugging) : (-1);

            i++;
        }

        let graph = document.getElementById("GRAPH");
        if (totalListObject._length > 0) {
            let list = document.createElement("div");
            list.className = "graph-list";
            graph.appendChild(list);
            let item;
            let name;
            let box;
            let bar;
            let fill;
            let percentage;
            let j = 0;
            while (j < abilityCount) {
                item = document.createElement("div");
                item.className = "list-item";
                list.appendChild(item);

                box = document.createElement("div");
                box.className = "item-box";
                item.appendChild(box);
                i = 0;
                while (i < totalListObject._length) {
                    bar = document.createElement("div");
                    bar.className = "item-bar";
                    box.appendChild(bar);
                    fill = document.createElement("div");
                    fill.className = "bar-fill";
                    percentage = scores[i][j] / fullScore * 100;
                    if (percentage < 0) {
                        percentage = 100;
                        fill.className += " none";
                    }
                    fill.style.height = percentage + '%';
                    bar.appendChild(fill);
                    i++;
                }

                name = document.createElement("p");
                name.className = "item-name";
                switch (j) {
                    case 0: name.textContent = "추상화 능력"; break;
                    case 1: name.textContent = "논리적 사고력"; break;
                    case 2: name.textContent = "문제 해결 능력"; break;
                    case 3: name.textContent = "비판적 사고력"; break;
                    case 4: name.innerHTML = "프로그래밍<br>언어 구사 능력"; break;
                    case 5: name.textContent = "디버깅 능력"; break;
                    default: break;
                }
                item.appendChild(name);

                j++;
            }

            let legend = document.createElement("div");
            legend.className = "graph-legend";
            graph.appendChild(legend);
            let mark;
            i = 0;
            while (i < totalListObject._length) {
                box = document.createElement("div");
                box.className = "legend-box";
                legend.appendChild(box);
                mark = document.createElement("div");
                mark.className = "legend-mark";
                box.appendChild(mark);
                name = document.createElement("div");
                name.className = "legend-name";
                name.textContent = (totalListObject._length - (i + 1)) + "번째 전 평가";
                box.appendChild(name);
                i++;
            }
        }
        else {
            let notice = document.createElement("div");
            notice.className = "graph-notice";
            notice.textContent = "능력 평가 기록이 없습니다.";
            graph.appendChild(notice);
        }

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    async OnViewButtonClicked(event) {
        const menteeCard = MenteeCard.GetInstance();
        const applyBook = ApplyBook.GetInstance();
        const playShelf = PlayShelf.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();

        const id = event.currentTarget.id;
        const stepNumber = parseInt(id.substring(10, id.length), 10);

        let current = applyBook.FindCurrentCard();
        if (current != -1) {
            let applyCard = applyBook.GetAt(current);
            // 1. 이전 놀이 케이스를 지운다.
            let index = playShelf.Find(applyCard.courseName, stepNumber);
            if (index != -1) {
                playShelf.Remove(index);
            }

            // 2. 신청 책에서 선택된 신청 카드를 찾는다.
            index = applyBook.Find(applyCard.courseName, stepNumber);
            if (index != -1) {
                applyCard = applyBook.GetAt(index);
                const emailAddress = menteeCard.emailAddress;

                let playCase = new PlayCase(applyCard);

                const requestor = new PhpRequestor();
                // 3. 서버에 문제 데이터를 요청한다.
                const problemListObject = await requestor.PostJson("../../php/GetProblems.php",
                    "courseName=" + applyCard.courseName + "&stepNumber=" + stepNumber);

                // 4. 문제 목록에 추가한다.
                const problemList = new ProblemList();
                problemList.SetObject(problemListObject);
                playCase.Add(problemList);

                // 5. 서버에 풀이 데이터를 요청한다.
                const solutionBook = new SolutionBook();
                const solutionBookObject = await requestor.PostJson("../../php/GetCurrentApplySolutions.php",
                    "emailAddress=" + emailAddress + "&courseName=" + applyCard.courseName + "&stepNumber=" + stepNumber);

                // 6. 풀이 책에 추가한다.
                solutionBook.SetObject(solutionBookObject, problemList);
                playCase.Add(solutionBook);

                // 7. 서버에 피드백 데이터를 요청한다.
                const feedbackBook = new FeedbackBook();
                const feedbackBookObject = await requestor.PostJson("../../php/GetCurrentApplyFeedbacks.php",
                    "emailAddress=" + emailAddress + "&courseName=" + applyCard.courseName + "&stepNumber=" + stepNumber);

                // 8. 피드백 책에 추가한다.
                feedbackBook.SetObject(feedbackBookObject, problemList, solutionBook);
                playCase.Add(feedbackBook);

                // 9. 서버에 질문과 답변 데이터를 요청한다.
                const questionBook = new QuestionBook();
                const questionBookObject = await requestor.PostJson("../../php/GetCurrentApplyQuestions.php",
                    "emailAddress=" + emailAddress + "&courseName=" + applyCard.courseName + "&stepNumber=" + stepNumber);

                // 10. 질문 책에 추가한다.
                questionBook.SetObject(questionBookObject, problemList, solutionBook);
                playCase.Add(questionBook);

                const answerBook = new AnswerBook();
                const answerBookObject = await requestor.PostJson("../../php/GetCurrentApplyAnswers.php",
                    "emailAddress=" + emailAddress + "&courseName=" + applyCard.courseName + "&stepNumber=" + stepNumber);

                // 11. 답변 책에 추가한다.
                answerBook.SetObject(answerBookObject, problemList, solutionBook, questionBook);
                playCase.Add(answerBook);

                playShelf.Add(playCase);

                // 12. indexedDB에 놀이 책장을 저장한다.
                const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
                await indexedDB.Open();
                await indexedDB.Put("PlayShelf", playShelf);

                bookmarkCard.Correct(0, bookmarkCard.location, "PLAYFORM", "SOLVEFORM", "", applyCard.courseName, stepNumber, -1, 0, 0);
                await indexedDB.Put("BookmarkCard", bookmarkCard);

                // 13. 놀이로 이동한다.
                const indexForm = IndexForm.GetInstance();
                const frameController = new FrameController(indexForm);
                frameController.Change("MENTOPLAYFORM");
            }
        }
    }
}