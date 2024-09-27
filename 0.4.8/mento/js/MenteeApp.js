import { MenteeForm } from "./MenteeForm.js";

const menteeForm = MenteeForm.GetInstance();
menteeForm.Element.dispatchEvent(new Event("load"));