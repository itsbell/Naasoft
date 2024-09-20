import { LeaveForm } from "./LeaveForm.js";

const leaveForm = LeaveForm.GetInstance();
leaveForm.Element.dispatchEvent(new Event("load"));