import { CompositeWindow } from "./Window.js";
import { DeskForm } from "./DeskForm.js";
import { ApplyBook } from "./Apply.js";
import { StudyView } from "./StudyView.js";
import { ProblemNavigator } from "./ProblemNavigator.js";
import { IndexForm } from "./IndexForm.js";
import { PlayShelf } from "./Play.js";
import { IndexedDB } from "./IndexedDB.js";
import { BookmarkCard } from "./Bookmark.js";

export class StudyForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["STUDYFORM"] === undefined) {
            window.top.forms["STUDYFORM"] = new StudyForm("STUDYFORM");
        }
        return window.top.forms["STUDYFORM"];
    }

    async OnLoaded() {
        const applyBook = ApplyBook.GetInstance();
        const applyCard = applyBook.GetAt(applyBook.current);
        const stepNumber = applyCard.stepNumber;

        const playShelf = PlayShelf.GetInstance();
        const playCase = playShelf.GetAt(playShelf.current);
        playCase.Reset();

        let chapter = "";
        let chapterNumber = 0;
        let index = DeskForm.GetInstance().Find("SIDEBAR");
        if (index != -1) {
            const sideBar = DeskForm.GetInstance().GetAt(index);
            chapter = sideBar.GetSelectedMenuItemText();
            if (chapter != '살펴보기') {
                chapterNumber = parseInt(chapter.replace(/[^0-9]/g, ""));
            }
        }

        const studyView = new StudyView("STUDYVIEW");
        this.Add(studyView);
        studyView.Load(stepNumber, chapter);

        const problemNavigator = new ProblemNavigator("PROBLEMNAVIGATOR", stepNumber, chapter);
        this.Add(problemNavigator);

        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        const bookmarkCard = BookmarkCard.GetInstance();
        bookmarkCard.Correct(0, bookmarkCard.location, "DESKFORM", "STUDYFORM", "", applyCard.courseName, applyCard.stepNumber, chapterNumber, 0, 0);
        await indexedDB.Put("BookmarkCard", bookmarkCard);

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    OnNextButtonClicked() {
        const deskForm = DeskForm.GetInstance();
        let index = deskForm.Find("SIDEBAR");
        if (index != -1) {
            const sideBar = deskForm.GetAt(index);
            index = sideBar.FindSelectedMenuItem();
            if (index != -1) {
                if (index < sideBar.GetMenuItemLength() - 1) {
                    sideBar.SelectMenuItem(index + 1);
                }
                else {
                    alert("마지막 장입니다.");
                }
            }
        }
    }
}