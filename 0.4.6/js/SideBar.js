import { CompositeWindow } from "./Window.js";
import { Button, ImageButton } from "./Buttons.js";
import { IndexForm } from "./IndexForm.js";
import { FrameController } from "./FrameController.js";

export class SideBar extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.top = null;
        this.bottom = null;

        this.control = document.createElement("div");
        this.control.className = "sideBar-control";
        this.element.appendChild(this.control);

        this.body = document.createElement("div");
        this.body.className = "sideBar-body";
        this.element.appendChild(this.body);

        this.list = document.createElement("ul");
        this.list.className = "sideBar-menu";
        this.body.appendChild(this.list);

        this.bottom = document.createElement("div");
        this.bottom.className = "sideBar-bottom";
        this.body.appendChild(this.bottom);

        this.edgeList = null;

        this.fold = document.createElement("button");
        this.fold.id = "SIDEBARFOLD";
        this.fold.className = "sideBar-fold";
        this.fold.addEventListener("click", this.OnFoldButtonClicked.bind(this));
        this.element.appendChild(this.fold);

        let triangle = document.createElement("div");
        this.fold.appendChild(triangle);

        this.element.className = "sideBar";
        this.shown = false;
        triangle.className = "fold-unfold";
    }

    Show() {
        if (this.shown === true) {
            this.shown = false;
            this.element.className = "sideBar sideBar-hide";
            this.fold.children[0].className = "fold-unfold";
        }
        else {
            this.shown = true;
            this.element.className = "sideBar sideBar-show";
            this.fold.children[0].className = "fold-fold";
            let height = 0;
            if (this.top != null) {
                height += this.top.offsetHeight;
            }
            height += this.control.offsetHeight;
            this.body.style.height = "calc(100% - " + height + "px)";

            // height = 0;
            // if (this.bottom != null) {
            //     height += this.bottom.offsetHeight;
            // }
            // console.log(height);
            // this.list.style.height = "calc(100% - " + height + "px)";
        }
    }

    AddTop(text, target, source) {
        this.top = document.createElement("div");
        this.top.reference = target;
        this.top.className = "sideBar-top";

        let image = document.createElement("img");
        image.src = source;
        image.className = "top-image";
        this.top.appendChild(image);

        let name = document.createElement("div");
        name.textContent = text;
        name.className = "top-name";
        this.top.appendChild(name);

        this.top.addEventListener("click", this.OnTopClicked.bind(this));
        this.element.insertBefore(this.top, this.control);
    }

    AddLocation(text, source) {
        let wrapper = document.createElement("div");
        wrapper.className = "sideBar-location";
        this.bottom.appendChild(wrapper);

        let image = document.createElement("img");
        image.src = source;
        image.className = "location-image";
        wrapper.appendChild(image);

        let location = document.createElement("div");
        location.textContent = text;
        location.className = "location-text";
        wrapper.appendChild(location);
    }

    AddControl(id, source, action, tooltip) {
        let buttonElement = document.createElement("button");
        buttonElement.id = id;
        buttonElement.className = "control-button";
        this.control.appendChild(buttonElement);

        const button = new ImageButton(id, source, action, tooltip);
        this.Add(button);
    }

    AddSwitchMenu(text, targetId, target) {
        let menu = document.createElement("li");
        menu.className = "menu-switch";
        menu.textContent = text;
        menu.targetId = targetId;
        menu.reference = target;
        menu.addEventListener("click", this.OnSwitchMenuClicked.bind(this));

        this.list.appendChild(menu);
    }

    AddActionMenu(text, action) {
        let menu = document.createElement("li");
        menu.className = "menu-action";
        menu.textContent = text;
        menu.addEventListener("click", action.bind(this));

        this.list.appendChild(menu);
    }

    AddLinkMenu(text, link) {
        let menu = document.createElement("li");
        menu.className = "menu-link";
        menu.textContent = text;
        menu.reference = link;
        menu.addEventListener("click", this.OnLinkMenuClicked.bind(this));

        this.list.appendChild(menu);
    }

    AddSwitchEdgeMenu(text, targetId, target) {
        if (this.edgeList === null) {
            this.edgeList = document.createElement("ul");
            this.edgeList.className = "sideBar-menu-edge";
            this.bottom.appendChild(this.edgeList);
        }

        let menu = document.createElement("li");
        menu.className = "menu-switch";
        menu.textContent = text;
        menu.targetId = targetId;
        menu.reference = target;
        menu.addEventListener("click", this.OnSwitchEdgeMenuClicked.bind(this));

        this.edgeList.appendChild(menu);
    }

    AddDropdownMenu(text, id) {
        let menu = document.createElement("li");
        menu.className = "menu-dropdown";
        menu.textContent = text;
        menu.id = id;
        menu.addEventListener("click", this.OnDropdownMenuClicked.bind(this));

        let sub = document.createElement("ul");
        sub.className = "dropdown-submenu";
        sub.style.display = "none";
        menu.appendChild(sub);

        let wrapper = document.createElement("div");
        wrapper.className = "dropdown-wrapper";
        menu.appendChild(wrapper);

        // let mark = document.createElement("div");
        // mark.className = "dropdown-mark1";
        // wrapper.appendChild(mark);

        let textElement = document.createElement("div");
        textElement.className = "dropdown-text";
        textElement.textContent = text;
        wrapper.appendChild(textElement);

        let fold = document.createElement("div");
        fold.className = "dropdown-fold";
        wrapper.appendChild(fold);

        this.list.appendChild(menu);
    }

    AddDropdownSubmenu(menuId, text, id) {
        let i = 0;
        while (i < this.list.children.length && this.list.children[i].id != menuId) {
            i++;
        }
        if (i < this.list.children.length) {
            let item = this.list.children[i];
            let menu = item.children[0];

            let submenu = document.createElement("li");
            submenu.className = "menu-dropdown";
            submenu.textContent = text;
            submenu.id = id;
            submenu.addEventListener("click", this.OnDropdownMenuClicked.bind(this));

            let sub = document.createElement("ul");
            sub.className = "dropdown-submenu";
            sub.style.display = "none";
            submenu.appendChild(sub);

            let wrapper = document.createElement("div");
            wrapper.className = "dropdown-wrapper";
            submenu.appendChild(wrapper);

            // let mark = document.createElement("div");
            // mark.className = "dropdown-mark2";
            // wrapper.appendChild(mark);

            let textElement = document.createElement("div");
            textElement.className = "dropdown-text";
            textElement.textContent = text;
            wrapper.appendChild(textElement);

            let fold = document.createElement("div");
            fold.className = "dropdown-fold";
            wrapper.appendChild(fold);

            menu.appendChild(submenu);
        }
    }

    AddSwitchSubmenu(menuId, text, targetId, target, object) {
        let item;
        let menu;
        let subItem;
        let submenu = null;
        let j;
        let i = 0;
        while (i < this.list.children.length && submenu === null) {
            item = this.list.children[i];
            if (item.id != menuId) {
                menu = item.children[0];
                j = 0;
                while (j < menu.children.length && menu.children[j].id != menuId) {
                    j++;
                }
                if (j < menu.children.length) {
                    subItem = menu.children[j];
                    submenu = subItem.children[0];
                }
            }
            else {
                submenu = item.children[0];
            }
            i++;
        }

        if (submenu != null) {
            let switchMenu = document.createElement("li");
            switchMenu.className = "menu-switch";
            switchMenu.textContent = text;
            switchMenu.targetId = targetId;
            switchMenu.reference = target;
            switchMenu.logicalObject = object;
            switchMenu.addEventListener("click", this.OnSwitchSubmenuClicked.bind(this));

            submenu.appendChild(switchMenu);
        }
    }

    AddSwitchButtonSubmenu(menuId, buttonId, text, targetId, target, object) {
        let item;
        let menu;
        let subItem;
        let submenu = null;
        let j;
        let i = 0;
        while (i < this.list.children.length && submenu === null) {
            item = this.list.children[i];
            if (item.id != menuId) {
                menu = item.children[0];
                j = 0;
                while (j < menu.children.length && menu.children[j].id != menuId) {
                    j++;
                }
                if (j < menu.children.length) {
                    subItem = menu.children[j];
                    submenu = subItem.children[0];
                }
            }
            else {
                submenu = item.children[0];
            }
            i++;
        }

        if (submenu != null) {
            let buttonMenu = document.createElement("li");
            buttonMenu.className = "menu-button";
            buttonMenu.targetId = targetId;
            buttonMenu.reference = target;
            buttonMenu.logicalObject = object;
            submenu.appendChild(buttonMenu);

            let buttonElement = document.createElement("button");
            buttonElement.id = buttonId;
            buttonElement.className = "menuButton";
            buttonElement.type = "button";
            buttonMenu.appendChild(buttonElement);

            const button = new Button(buttonElement.id, text, this.OnSwitchButtonSubmenuClicked.bind(this));
            this.Add(button);
        }
    }

    RemoveSwitchButtonSubmenuFromRear(menuId) {
        let item;
        let menu;
        let subItem;
        let submenu = null;
        let j;
        let i = 0;
        while (i < this.list.children.length && submenu === null) {
            item = this.list.children[i];
            if (item.id != menuId) {
                menu = item.children[0];
                j = 0;
                while (j < menu.children.length && menu.children[j].id != menuId) {
                    j++;
                }
                if (j < menu.children.length) {
                    subItem = menu.children[j];
                    submenu = subItem.children[0];
                }
            }
            else {
                submenu = item.children[0];
            }
            i++;
        }

        if (submenu != null) {
            let rear = submenu.children.length - 1;
            if (rear >= 0) {
                let child = submenu.children[rear];
                let grandChild = child.children[0];
                child.removeChild(grandChild);
                submenu.removeChild(child);
            }
        }
    }

    RemoveAll() {
        let i = this.element.children.length - 1;
        while (i >= 0) {
            this.element.removeChild(this.element.children[i]);
            i--;
        }
    }

    SelectMenuItem(index = -1) {
        this.UnselectSwitchMenu(this.list);
        if (this.edgeList != null) {
            this.UnselectSwitchMenu(this.edgeList);
        }

        if (index != -1) {
            const target = this.list.children[index];

            let parentBody = document.body;
            let children = parentBody.children;
            let i = 0;
            while (i < children.length && children[i].tagName != "IFRAME") {
                i++;
            }
            if (i < children.length) {
                window.top.forms[children[i].id] = undefined;
                parentBody.removeChild(children[i]);
            }
            target.classList.add("menu-selected");

            parentBody.logicalObject.frame = document.createElement("iframe");
            parentBody.logicalObject.frame.id = target.targetId;
            parentBody.logicalObject.frame.src = target.reference;
            parentBody.appendChild(parentBody.logicalObject.frame);
        }
    }

    SelectEdgeMenuItem(index = -1) {
        this.UnselectSwitchMenu(this.list);
        this.UnselectSwitchMenu(this.edgeList);

        if (index != -1) {
            const target = this.edgeList.children[index];

            let parentBody = document.body;
            let children = parentBody.children;
            let i = 0;
            while (i < children.length && children[i].tagName != "IFRAME") {
                i++;
            }
            if (i < children.length) {
                window.top.forms[children[i].id] = undefined;
                parentBody.removeChild(children[i]);
            }
            target.classList.add("menu-selected");

            parentBody.logicalObject.frame = document.createElement("iframe");
            parentBody.logicalObject.frame.id = target.targetId;
            parentBody.logicalObject.frame.src = target.reference;
            parentBody.appendChild(parentBody.logicalObject.frame);
        }
    }

    GetSelectedMenuItemText() {
        let text = "";

        let i = 0;
        while (i < this.list.children.length && this.list.children[i].classList.contains("menu-selected") === false) {
            i++;
        }
        if (i < this.list.children.length) {
            text = this.list.children[i].textContent;
        }

        return text;
    }

    FindSelectedMenuItem() {
        let index = -1;

        let i = 0;
        while (i < this.list.children.length && this.list.children[i].classList.contains("menu-selected") === false) {
            i++;
        }
        if (i < this.list.children.length) {
            index = i;
        }

        return index;
    }

    GetMenuItemLength() {
        return this.list.children.length;
    }

    ClickMenuItem(index) {
        const target = this.list.children[index];
        target.dispatchEvent(new Event("click"));
    }

    UnselectSwitchMenu(list) {
        let result = false;
        let i = 0;
        while (i < list.children.length && list.children[i].classList.contains("menu-selected") === false) {
            i++;
        }
        if (i < list.children.length) {
            list.children[i].classList.remove("menu-selected");
            result = true;
        }
        if (result === false) {
            i = 0;
            while (i < list.children.length && result === false) {
                if (list.children[i].className == "menu-dropdown") {
                    result = this.UnselectSwitchMenu(list.children[i].children[0]);
                }
                i++;
            }
        }

        return result;
    }

    GetSelectedSwitchMenuObject(list = null) {
        let object = null;
        if (list === null) {
            list = this.list;
        }
        let i = 0;
        while (i < list.children.length && list.children[i].classList.contains("menu-selected") === false) {
            i++;
        }
        if (i < list.children.length) {
            object = list.children[i].logicalObject;
        }
        if (object === null) {
            i = 0;
            while (i < list.children.length && object === null) {
                if (list.children[i].className == "menu-dropdown") {
                    object = this.GetSelectedSwitchMenuObject(list.children[i].children[0]);
                }
                i++;
            }
        }

        return object;
    }

    ClickMenuItemByText(text, list = null) {
        if (list === null) {
            list = this.list;
        }
        let i = 0;
        while (i < list.children.length && list.children[i].textContent.substring(0, text.length) != text) {
            i++;
        }
        if (i < list.children.length) {
            const target = list.children[i];
            list = target.children[0];
            if (list == undefined || (list != undefined && list.style.display == "none")) {
                target.dispatchEvent(new Event("click"));
            }
        }

        return list;
    }

    IsExistMenu(menuId, list = null) {
        let isExist = false;
        if (list === null) {
            list = this.list;
        }
        let i = 0;
        while (i < list.children.length && list.children[i].id != menuId) {
            i++;
        }
        if (i < list.children.length) {
            isExist = true;
        }
        if (isExist === false) {
            i = 0;
            while (i < list.children.length && isExist === false) {
                if (list.children[i].className == "menu-dropdown") {
                    isExist = this.IsExistMenu(menuId, list.children[i].children[0]);
                }
                i++;
            }
        }

        return isExist;
    }

    OnTopClicked(event) {
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change(event.currentTarget.reference);
    }

    OnSwitchMenuClicked(event) {
        let i = 0;
        while (i < this.list.children.length && this.list.children[i] != event.target) {
            i++;
        }
        if (i < this.list.children.length) {
            this.SelectMenuItem(i);
        }
    }

    OnLinkMenuClicked(event) {
        window.location.href = event.target.reference;
    }

    OnFoldButtonClicked() {
        this.Show();
    }

    OnSwitchEdgeMenuClicked(event) {
        let i = 0;
        while (i < this.edgeList.children.length && this.edgeList.children[i] != event.target) {
            i++;
        }
        if (i < this.edgeList.children.length) {
            this.SelectEdgeMenuItem(i);
        }
    }

    OnDropdownMenuClicked(event) {
        let dropdown;
        let menu;
        let fold;

        //같은 레벨의 다른 드롭다운들 접기
        let parent = event.currentTarget.parentElement;
        let i = 0;
        while (i < parent.children.length) {
            dropdown = parent.children[i];
            if (dropdown != event.currentTarget && dropdown.className === "menu-dropdown") {
                menu = dropdown.children[0];
                fold = dropdown.children[1].children[1];
                menu.style.display = "none";
                fold.className = "dropdown-fold";
            }
            i++;
        }

        dropdown = event.currentTarget;
        menu = dropdown.children[0];
        fold = dropdown.children[1].children[1];
        if (menu.style.display == "none") {
            menu.style.display = "block";
            fold.className = "dropdown-unfold";
        }
        else {
            menu.style.display = "none";
            fold.className = "dropdown-fold";
        }
        event.stopPropagation();
    }

    OnSwitchSubmenuClicked(event) {
        // 모든 다른 스위치 메뉴의 선택 상태를 해제한다.
        this.UnselectSwitchMenu(this.list);

        let parentBody = document.body;
        let children = parentBody.children;
        let i = 0;
        while (i < children.length && children[i].tagName != "IFRAME") {
            i++;
        }
        if (i < children.length) {
            window.top.forms[children[i].id] = undefined;
            parentBody.removeChild(children[i]);
        }

        event.target.classList.add("menu-selected");

        parentBody.logicalObject.frame = document.createElement("iframe");
        parentBody.logicalObject.frame.id = event.target.targetId;
        parentBody.logicalObject.frame.src = event.target.reference;
        parentBody.appendChild(parentBody.logicalObject.frame);

        event.stopPropagation();
    }

    OnSwitchButtonSubmenuClicked(event) {
        // 모든 다른 스위치 메뉴의 선택 상태를 해제한다.
        this.UnselectSwitchMenu(this.list);

        let parentBody = document.body;
        let children = parentBody.children;
        let i = 0;
        while (i < children.length && children[i].tagName != "IFRAME") {
            i++;
        }
        if (i < children.length) {
            window.top.forms[children[i].id] = undefined;
            parentBody.removeChild(children[i]);
        }

        const item = event.target.parentElement;
        item.classList.add("menu-selected");

        parentBody.logicalObject.frame = document.createElement("iframe");
        parentBody.logicalObject.frame.id = item.targetId;
        parentBody.logicalObject.frame.src = item.reference;
        parentBody.appendChild(parentBody.logicalObject.frame);

        event.stopPropagation();
    }
}