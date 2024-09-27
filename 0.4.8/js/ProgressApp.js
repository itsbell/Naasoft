import { ProgressForm } from "./ProgressForm.js";

const progressForm = ProgressForm.GetInstance();
progressForm.Element.dispatchEvent(new Event("load"));