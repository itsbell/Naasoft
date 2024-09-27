import { IndexForm } from "./IndexForm.js";

window.top.version = "0.4.8";
window.top.indexedDBVersion = "202409061110";
window.top.businessObjects = [];

window.top.initialForm = ["MAINFORM", "ABOUTFORM", "GOALFORM", "SERVICEFORM", "EVENTFORM"];
window.top.signUpForm = ["SIGNUPFORM"];
window.top.findPasswordForm = ["FINDPASSWORDFORM"];
window.top.applyForm = ["APPLYFORM"];
window.top.atticForm = ["PROGRESSFORM", "BOOKMARKFORM", "ABILITYFORM", "LEAVEFORM"];
window.top.deskForm = ["STUDYFORM"];
window.top.playForm = ["SOLVEFORM", "EDITSOLUTIONFORM"];
window.top.mentoAtticForm = ["MENTOBOOKMARKFORM", "MENTEEFORM"];
window.top.mentoDeskForm = ["MENTOPROGRESSFORM", "MENTOABILITYFORM"];
window.top.mentoPlayForm = ["MENTOSOLVEFORM"];
window.top.stringPages = ["INITIALFORM", "SIGNUPFORM", "FINDPASSWORDFORM", "APPLYFORM", "ATTICFORM", "DESKFORM", "PLAYFORM", "MENTOATTICFORM", "MENTODESKFORM", "MENTOPLAYFORM"];
window.top.pages = [window.top.initialForm, window.top.signUpForm, window.top.findPasswordForm, window.top.applyForm, window.top.atticForm, window.top.deskForm, window.top.playForm, window.top.mentoAtticForm, window.top.mentoDeskForm, window.top.mentoPlayForm];

const indexForm = IndexForm.GetInstance();
indexForm.Element.dispatchEvent(new Event("load"));