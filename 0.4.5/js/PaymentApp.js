import { PaymentForm } from "./PaymentForm.js";

window.top.paymentForm = undefined;

const paymentForm = PaymentForm.GetInstance();
paymentForm.Element.dispatchEvent(new Event("load"));