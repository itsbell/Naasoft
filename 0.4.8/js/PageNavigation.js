export class PageNavigation {

    constructor(id) {
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.logicalObject = this;
        this.current = 0;

        this.previousArea = document.createElement("div");
        this.previousArea.id = `${id}_PREVIOUSAREA`;
        this.element.appendChild(this.previousArea);

        this.numberArea = document.createElement("div");
        this.numberArea.id = `${id}_NUMBERAREA`;
        this.element.appendChild(this.numberArea);

        this.nextArea = document.createElement("div");
        this.nextArea.id = `${id}_NEXTAREA`;
        this.element.appendChild(this.nextArea);
    }

    get Current() {
        return this.current;
    }

    set Current(number) {
        this.current = number;
    }

    AddNext(callback, src = null) {
        let next = document.createElement("div");
        next.id = `${this.element.id}_NEXTAREA_NEXT`;
        if (src === null) {
            next.textContent = ">";
        }
        else {
            let img = document.createElement("img");
            img.id = `${this.element.id}_NEXTAREA_NEXT_IMG`;
            img.src = src;
            next.appendChild(img);
        }
        next.addEventListener("click", callback);
        this.nextArea.appendChild(next);
    }

    AddNumber(number, callback) {
        let pageNumber = document.createElement("div");
        pageNumber.id = `${this.element.id}_NUMBERAREA_PAGE${number}`;
        pageNumber.className = "unSelected";
        pageNumber.textContent = number;
        pageNumber.addEventListener("click", callback);
        this.numberArea.appendChild(pageNumber);
    }

    AddPrevious(callback, src = null) {
        let previous = document.createElement("div");
        previous.id = `${this.element.id}_PREVIOUSAREA_PREVIOUS`
        if (src === null) {
            previous.textContent = "<";
        }
        else {
            let img = document.createElement("img");
            img.id = `${this.element.id}_PREVIOUSAREA_PREVIOUS_IMG`;
            img.src = src;
            previous.appendChild(img);
        }
        previous.addEventListener("click", callback);
        this.previousArea.appendChild(previous);
    }

    DeleteAllItems() {
        let i = 0;
        let j;
        let child;
        let grandSon;

        while (i < this.element.childElementCount) {
            child = this.element.children[i];
            j = child.childElementCount - 1;
            while (j >= 0) {
                grandSon = child.children[j];
                child.removeChild(grandSon);
                j--;
            }
            i++;
        }
    }

    Select(number) {
        let previousPage = document.getElementById(`${this.element.id}_NUMBERAREA_PAGE${this.Current}`);
        if (previousPage != null) {
            previousPage.className = "unSelected";
        }

        this.current = number;

        let selectedPage = document.getElementById(`${this.element.id}_NUMBERAREA_PAGE${this.Current}`);
        if (selectedPage != null) {
            selectedPage.className = "selected";
        }
    }
}