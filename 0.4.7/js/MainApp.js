import { MainForm } from "./MainForm.js";

const mainForm = MainForm.GetInstance();
mainForm.Element.dispatchEvent(new Event("load"));