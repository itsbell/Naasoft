import { SignUpForm } from "./SignUpForm.js";

window.top.signUpForm = undefined;

const signUpForm = SignUpForm.GetInstance();
signUpForm.Element.dispatchEvent(new Event("load"));