import { PaymentFailForm } from "./PaymentFailForm.js";

window.top.paymentFailForm = undefined;

const paymentFailForm = PaymentFailForm.GetInstance();
paymentFailForm.Element.dispatchEvent(new Event("load"));