import { AboutForm } from "./AboutForm.js";

const aboutForm = AboutForm.GetInstance();
aboutForm.Element.dispatchEvent(new Event("load"));