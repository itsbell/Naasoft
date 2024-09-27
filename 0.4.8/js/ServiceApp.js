import { ServiceForm } from "./ServiceForm.js";

const serviceForm = ServiceForm.GetInstance();
serviceForm.Element.dispatchEvent(new Event("load"));