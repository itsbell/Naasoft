import { ApplyForm } from "./ApplyForm.js";

window.top.applyForm = undefined;

const applyForm = ApplyForm.GetInstance();
applyForm.Element.dispatchEvent(new Event("load"));