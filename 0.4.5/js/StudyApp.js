import { StudyForm } from "./StudyForm.js";

const studyForm = StudyForm.GetInstance();
studyForm.Element.dispatchEvent(new Event("load"));