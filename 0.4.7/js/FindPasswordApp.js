import { FindPasswordForm } from "./FindPasswordForm.js";

window.top.findPasswordForm = undefined;

const findPasswordForm = FindPasswordForm.GetInstance();
findPasswordForm.Element.dispatchEvent(new Event("load"));