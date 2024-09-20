import { InitialForm } from "./InitialForm.js";

window.top.initialForm = undefined;
window.top.forms = []; // main, about, goal, service

const initialForm = InitialForm.GetInstance();
initialForm.Element.dispatchEvent(new Event("load"));