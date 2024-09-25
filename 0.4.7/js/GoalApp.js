import { GoalForm } from "./GoalForm.js";

GoalForm.GetInstance();

const goalForm = GoalForm.GetInstance();
goalForm.Element.dispatchEvent(new Event("load"));