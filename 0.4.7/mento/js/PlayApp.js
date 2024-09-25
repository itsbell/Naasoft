import { PlayForm } from "./PlayForm.js";

window.top.playForm = undefined;
window.top.forms = []; // 

const playForm = PlayForm.GetInstance();
playForm.Element.dispatchEvent(new Event("load"));