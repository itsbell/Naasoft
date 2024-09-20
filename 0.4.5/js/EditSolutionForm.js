import { CompositeWindow } from "./Window.js";
import { MenteeCard } from "./Mentee.js";
import { ApplyBook } from "./Apply.js";
import { SolutionList, Solution } from "./Solution.js";
import { ProblemView } from "./ProblemView.js";
import { SolutionEditor } from "./SolutionEditor.js";
import { PlayForm } from "./PlayForm.js";
import { PlayShelf } from "./Play.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { DateTime } from "./DateTime.js";
import { IndexedDB } from "./IndexedDB.js";

export class EditSolutionForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
        this.element.addEventListener("load", this.OnLoaded.bind(this));
        
        this._isSubmitted = false;

        
    }

    static GetInstance() {
        if (window.top.forms["EDITSOLUTIONFORM"] === undefined) {
            window.top.forms["EDITSOLUTIONFORM"] = new EditSolutionForm("EDITSOLUTIONFORM");
        }
        return window.top.forms["EDITSOLUTIONFORM"];
    }

    async SubmitSolution(content, file) {
        if (this._isSubmitted === false) {
            this._isSubmitted = true;
            const requestor = new PhpRequestor();
            const playForm = PlayForm.GetInstance();
            const playShelf = PlayShelf.GetInstance();
            const applyBook = ApplyBook.GetInstance();
            const menteeCard = MenteeCard.GetInstance();

            const playCase = playShelf.GetAt(playShelf.current);
            const problemList = playCase.GetAt(0);
            const solutionBook = playCase.GetAt(1);

            const emailAddress = menteeCard.emailAddress;
            const applyCard = applyBook.GetAt(applyBook.current);
            const courseName = applyCard.courseName;
            const stepNumber = applyCard.stepNumber;
            const problem = problemList.GetAt(problemList.current);
            const chapterNumber = problem.chapterNumber;
            const problemNumber = problem.number;

            playForm.Element.className = "waiting";
            this.element.className = "waiting";

            let text = '';
            if (content != null) {
                text = content.replace(/\\/g, '\\\\'); // 역슬래시 하나를 역슬래시 두개로 바꾸기
                text = content.replace(/"/g, '\\"');   // escape quotes
            }

            let image = '';
            if (file != null) {
                let imageView = document.getElementById("IMAGEVIEW");
                let img = imageView.logicalObject.image;

                /** 이미지 압축 */
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext('2d');
                canvas.width = 1600; // 원하는 너비로 설정
                const aspectRatio = img.height / img.width;
                canvas.height = canvas.width * aspectRatio;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                image = canvas.toDataURL('image/jpeg'); //dataURL
            }

            let solutionList;
            let index = solutionBook.Find(chapterNumber, problemNumber);
            if (index === -1) {
                solutionList = new SolutionList(problem);
                index = solutionBook.Add(solutionList);
            }
            solutionList = solutionBook.GetAt(solutionBook.current);

            let solution = new Solution(null, "WAIT", solutionList.length + 1, text, image);
            index = solutionList.Add(solution);
            solution = solutionList.GetAt(index);

            let body = `emailAddress=${emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}&chapterNumber=${chapterNumber}&problemNumber=${problemNumber}&number=${solution.number}&content=${solution.content}&image=${solution.image}`;
            let time = await requestor.Post("../php/InsertSolution.php", body);

            playForm.Element.className = "";
            this.element.className = "";

            time = new DateTime(time);
            index = solutionList.Correct(index, time);
            solution = solutionList.GetAt(index);
            const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
            await indexedDB.Open();
            await indexedDB.Put("PlayShelf", playShelf);

            index = playForm.Find("SIDEBAR");
            if (index != -1) {
                const sideBar = playForm.GetAt(index);
                let menuId = "CHAPTER" + chapterNumber;
                let submenuId = menuId + "PROBLEM" + problemNumber;
                // 문제에 대한 드롭다운 메뉴가 없으면 만든다.
                let isExist = sideBar.IsExistMenu(submenuId);
                if (isExist === false) {
                    sideBar.AddDropdownSubmenu(menuId, "문제 " + problemNumber, submenuId);
                }

                sideBar.RemoveSwitchButtonSubmenuFromRear(submenuId);

                sideBar.AddSwitchSubmenu(submenuId, "풀이 " + solution.number, "SOLVEFORM", "./solve.html", solution);
                sideBar.AddSwitchButtonSubmenu(submenuId, "ADDBUTTON" + problemNumber, "+", "EDITSOLUTIONFORM", "./editSolution.html", problem);

                let list = sideBar.ClickMenuItemByText(chapterNumber + "장");
                list = sideBar.ClickMenuItemByText("문제 " + problemNumber, list);
                sideBar.ClickMenuItemByText("풀이 " + solution.number, list);
            }
        }
    }

    OnLoaded() {
        const playForm = PlayForm.GetInstance();
        const playShelf = PlayShelf.GetInstance();
        const playCase = playShelf.GetAt(playShelf.current);
        const problemList = playCase.GetAt(0);
        let problem;

        let index = playForm.Find("SIDEBAR");
        if (index != -1) {
            const sideBar = playForm.GetAt(index);
            let object = sideBar.GetSelectedSwitchMenuObject();
            if (object != null) {
                problemList.MoveByChapterNumberAndNumber(object.chapterNumber, object.number);
            }
            problem = problemList.GetAt(problemList.current);
            if (object === null && problem.chapterNumber === 2 && problem.number === 1) {
                let windowIndex = sideBar.Find("HELPBUTTON");
                if (windowIndex != -1) {
                    const helpButton = sideBar.GetAt(windowIndex);
                    helpButton.Element.dispatchEvent(new Event("click"));
                }
            }

            const problemView = new ProblemView("PROBLEMVIEW");
            problemView.SetTitle(problem.title);
            problemView.SetContent(problem.content);
            this.Add(problemView);
        }

        const solutionEditor = new SolutionEditor("SOLUTIONEDITOR");
        this.Add(solutionEditor);

    }
}