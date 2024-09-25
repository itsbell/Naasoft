import { CompositeWindow } from "./Window.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { DeskForm } from "./DeskForm.js";
import { MenteeCard } from "./Mentee.js";
import { Button } from "./Buttons.js";
import { Div } from "./HTMLElements.js";
import { BookmarkCard } from "./Bookmark.js";
import { IndexedDB } from "./IndexedDB.js";

export class StudyView extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
    }

    Load(step, chapter) {
        chapter = chapter.substring(0, chapter.length - 1);
        let number = parseInt(chapter, 10);
        if (isNaN(number)) {
            number = 0;
        }

        const fileName = "../assets/study/Step" + step + "Chapter" + number + ".txt";
        const requestor = new PhpRequestor();
        requestor.Open("GET", fileName);
        requestor.Request(this.OnFileLoaded.bind(this), null);
    }

    OnFileLoaded(event) {
        const request = event.target;
        if (request.readyState === 4 && request.status === 200) {

            /**책갈피 */
            let menu = document.createElement("div");
            menu.id = "MENU";
            menu.className = "menu";
            this.element.appendChild(menu);

            let div = new Div("MENU");
            this.Add(div);

            let buttonElement = document.createElement("button");
            buttonElement.id = "BOOKMARK";
            buttonElement.className = "button bookmark";
            menu.appendChild(buttonElement);

            let button = new Button("BOOKMARK", "책갈피", this.OnBookmarkButtonClicked.bind(this));
            div.Add(button);

            let lines = request.responseText.split('\n');
            // console.log(lines);

            let list = document.createElement("ul");
            list.className = "studyView-list";
            this.element.appendChild(list);
            let separator;
            let item;
            let number;
            let content;
            const zeroPad = (num, places) => String(num).padStart(places, '0');

            let numberCount = 1;
            let i = 0;
            while (i < lines.length) {
                if (lines[i] === "A" || lines[i] === "A\r") {
                    separator = document.createElement("li");
                    separator.className = "studyView-separator";
                    list.appendChild(separator);
                }
                else if (lines[i] === "B" || lines[i] === "B\r") {
                    separator = document.createElement("li");
                    separator.className = "studyView-separator";
                    list.appendChild(separator);
                }
                else if (lines[i] === "C" || lines[i] === "C\r") {
                    separator = document.createElement("li");
                    separator.className = "studyView-separator";
                    list.appendChild(separator);
                }
                else {
                    item = document.createElement("li");
                    item.className = "studyView-item";
                    list.appendChild(item);

                    number = document.createElement("div");
                    number.className = "studyView-number";
                    number.textContent = zeroPad(numberCount, 2);
                    item.appendChild(number);

                    content = document.createElement("div");
                    content.className = "studyView-content";
                    content.textContent = lines[i];
                    item.appendChild(content);

                    numberCount++;
                }
                i++;
            }
        }
    }

    async OnBookmarkButtonClicked() {
        const phpRequestor = new PhpRequestor();
        const deskForm = DeskForm.GetInstance();
        const menteeCard = MenteeCard.GetInstance();
        const bookmarkCard = BookmarkCard.GetInstance();
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        let chapterNumber;
        let menuText;
        let index = deskForm.Find("SIDEBAR");
        if (index != -1) {
            const sideBar = deskForm.GetAt(index);
            menuText = sideBar.GetSelectedMenuItemText();
            const regex = /[^0-9]/g;
            chapterNumber = parseInt(menuText.replace(regex, ""));
            if (chapterNumber === '') {
                chapterNumber = 0;
            }
            bookmarkCard.Correct(0, chapterNumber, "", "", "bookmark", "", 0, chapterNumber, 0, 0);
            await indexedDB.Put("BookmarkCard", bookmarkCard);
        }

        let body = `emailAddress=${menteeCard.emailAddress}&location=${bookmarkCard.chapterNumber}`;
        await phpRequestor.Post("../php/SetBookmark.php", body);
        alert("책갈피가 끼워졌어요.");
    }
}