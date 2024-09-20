import { SolveForm } from "./SolveForm.js";

const solveForm = SolveForm.GetInstance();
solveForm.Element.dispatchEvent(new Event("load"));