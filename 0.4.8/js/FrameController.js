export class FrameController {

    constructor(form) {
        this._form = form;
        this._srcMap = {
            "INITIALFORM": `./${window.top.version}/html/initial.html`,
            "MAINFORM": "./main.html",
            "ABOUTFORM": "./about.html",
            "GOALFORM": "./goal.html",
            "SERVICEFORM": "./service.html",

            "SIGNUPFORM": `./${window.top.version}/html/signUp.html`,
            "FINDPASSWORDFORM": `./${window.top.version}/html/findPassword.html`,
            "APPLYFORM": `./${window.top.version}/html/apply.html`,
            "ATTICFORM": `./${window.top.version}/html/attic.html`,
            "LEAVEFORM": `./${window.top.version}/html/leave.html`,
            "DESKFORM": `./${window.top.version}/html/desk.html`,
            "PLAYFORM": `./${window.top.version}/html/play.html`,
            "EDITSOLUTIONFORM": "./editSolution.html",

            "MENTOATTICFORM": `./${window.top.version}/mento/html/attic.html`,
            "MENTODESKFORM": `./${window.top.version}/mento/html/desk.html`,
            "MENTOPLAYFORM": `./${window.top.version}/mento/html/play.html`
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