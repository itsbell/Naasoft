import { EditSolutionForm } from "./EditSolutionForm.js";

const editSolutionForm = EditSolutionForm.GetInstance();
editSolutionForm.Element.dispatchEvent(new Event("load"));