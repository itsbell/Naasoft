import { PaymentSuccessForm } from "./PaymentSuccessForm.js";

window.top.paymentSuccessForm = undefined;
window.top.businessObjects = [];

const paymentSuccessForm = PaymentSuccessForm.GetInstance();
paymentSuccessForm.Element.dispatchEvent(new Event("load"));