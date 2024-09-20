import { CompositeWindow } from "../../js/Window.js";
import { ImageButton } from "../../js/Buttons.js";

export class ProblemView extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        /**head */
        let head = document.createElement("div");
        head.className = "problemView-head";
        this.element.appendChild(head);

        let sectionName = document.createElement("p");
        sectionName.className = "problemView-head-sectionName";
        sectionName.textContent = "문제";
        head.appendChild(sectionName);

        this.title = document.createElement("p");
        this.title.className = "problemView-title";
        head.appendChild(this.title);

        let fold = document.createElement("div");
        fold.className = "problemView-fold";
        head.appendChild(fold);

        let button = document.createElement("button");
        button.id = "FOLDBUTTON";
        button.className = "foldButton";
        button.type = "button";
        fold.appendChild(button);

        const foldButton = new ImageButton("FOLDBUTTON", "../../assets/unfold.png", this.OnFoldButtonClicked.bind(this));
        this.Add(foldButton);

        /**body */
        let body = document.createElement("div");
        body.className = "problemView-body";
        this.element.appendChild(body);

        this.content = document.createElement("p");
        this.content.className = "problemView-content";
        this.content.style.display = "none";
        body.appendChild(this.content);

    }

    // RemoveAllItems() {
    //     let i = this.element.children.length - 1;
    //     while (i >= 0) {
    //         this.element.removeChild(this.element.children[i]);
    //         i--;
    //     }
    // }

    SetTitle(title) {
        this.title.textContent = title;
    }

    SetContent(content) {
        this.content.innerHTML = content;
    }

    OnFoldButtonClicked() {
        let foldButton = null;
        let index = this.Find("FOLDBUTTON");
        if(index != -1){
            foldButton = this.GetAt(index);
        }

        if (this.content.style.display === "none") {
            this.content.style.display = "block";
            foldButton.SetSource("../../assets/fold.png");
            
        }
        else if (this.content.style.display === "block") {
            this.content.style.display = "none";
            foldButton.SetSource("../../assets/unfold.png");
        }
    }
}