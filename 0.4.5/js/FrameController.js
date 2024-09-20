export class FrameController {

    constructor(form) {
        this._form = form;
        this._srcMap = {
            "INITIALFORM": "./0.4.5/html/initial.html",
            "MAINFORM": "./main.html",

            "SIGNUPFORM": "./0.4.5/html/signUp.html",
            "FINDPASSWORDFORM": "./0.4.5/html/findPassword.html",
            "APPLYFORM": "./0.4.5/html/apply.html",
            "ATTICFORM": "./0.4.5/html/attic.html",
            "LEAVEFORM": "./0.4.5/html/leave.html",
            "DESKFORM": "./0.4.5/html/desk.html",
            "PLAYFORM": "./0.4.5/html/play.html",
            "MENTOATTICFORM": "./0.4.5/mento/html/attic.html",
            "MENTODESKFORM": "./0.4.5/mento/html/desk.html",
            "MENTOPLAYFORM": "./0.4.5/mento/html/play.html"
        };
    }

    get form() {
        return this._form;
    }

    /** 
     * @param {string} id - "INDEXFORM", "INITIALFORM" ...
     */
    Append(id) {
        let src = this._srcMap[id];

        this._form.frame = document.createElement("iframe");
        this._form.frame.id = id;
        this._form.frame.src = src;
        this._form.element.appendChild(this._form.frame);
    }

    /** 
     * @param {string} id - "INDEXFORM", "INITIALFORM" ...
     */
    Change(id) {
        if (this._form.frame != null) {
            this._form.element.removeChild(this._form.frame);
        }

        this._form.frame = document.createElement("iframe");
        this._form.frame.id = id;
        this._form.frame.src = this._srcMap[id];
        this._form.element.appendChild(this._form.frame);
    }

    Remove() {
        if (this._form.frame != null) {
            this._form.element.removeChild(this._form.frame);
            this._form.frame = null;
        }
    }
}