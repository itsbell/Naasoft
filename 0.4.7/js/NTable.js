export class NTable {
    constructor(id) {
        this.element = document.createElement("table");
        this.element.logicalObject = this;
        this.element.id = id;
        this.length = 0;
        this.columnLength = 0;

        // head
        let tr = document.createElement("tr");
        this.element.appendChild(tr);
    }

    AddEventListener(index, col, type, listener) {
        let tr = this.element.children[index + 1];
        let td = tr.children[col];
        td.addEventListener(type, listener);
    }

    DeleteAllItems() {
        let i = this.element.childElementCount - 1;
        let tr;

        while (i >= 1) {
            tr = this.element.children[i];
            this.element.removeChild(tr);
            this.length--;
            i--;
        }
    }

    InsertColumn(index, text) {
        let tr = this.element.children[0];
        let th = document.createElement("th");
        th.innerHTML = text;

        if (index < tr.childElementCount) {
            let next = tr.children[index];
            tr.insertBefore(th, next);
        }
        else {
            tr.appendChild(th);
        }
        this.columnLength++;
    }

    InsertItem(index, item) {
        let i = 0;
        let tr = document.createElement("tr");
        let td;

        while (i < this.columnLength) {
            td = document.createElement("td");
            tr.appendChild(td);
            i++;
        }

        tr.children[0].innerHTML = item;

        if (index < this.length) {
            let next = this.element.children[index + 1];
            this.element.insertBefore(tr, next);
        }
        else {
            this.element.appendChild(tr);
        }

        this.length++;
    }

    SetItemText(index, col, text) {
        let tr = this.element.children[index + 1];
        let td = tr.children[col];
        td.innerHTML = text;
    }

    SetItemData(index, col, data) {
        let tr = this.element.children[index + 1];
        let td = tr.children[col];
        td.data = data;
    }
}