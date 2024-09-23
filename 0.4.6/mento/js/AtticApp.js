import { AtticForm } from "./AtticForm.js";

window.top.atticForm = undefined;
window.top.forms = []; // attic

const atticForm = AtticForm.GetInstance();
atticForm.Element.dispatchEvent(new Event("load"));