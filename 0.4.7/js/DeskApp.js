import { DeskForm } from "./DeskForm.js";

window.top.deskForm = undefined;
window.top.forms = []; // scan, study

const deskForm = DeskForm.GetInstance();
deskForm.Element.dispatchEvent(new Event("load"));