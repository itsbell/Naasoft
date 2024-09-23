import { CompositeWindow } from "./Window.js";

export class Footer extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        let info = document.createElement("div");
        info.className = "footer-information";

        let span = document.createElement("span");
        span.textContent = "나아 |";
        info.appendChild(span);

        span = document.createElement("span");
        span.textContent = "대표자 : 김석현 |";
        info.appendChild(span);

        span = document.createElement("span");
        span.textContent = "개인정보관리책임자 : 이종환 |";
        info.appendChild(span);

        span = document.createElement("span");
        span.textContent = "사업자등록번호 : 524-95-01817 |";
        info.appendChild(span);

        span = document.createElement("span");
        span.textContent = "통신판매업신고번호 : 1234567890";
        info.appendChild(span);

        this.element.appendChild(info);

        let contact = document.createElement("div");
        contact.className = "footer-contact";

        span = document.createElement("span");
        span.textContent = "주소 : 서울시 서초구 서리풀2길 28 201호 |";
        contact.appendChild(span);

        span = document.createElement("span");
        span.textContent = "전화번호 : 02)587-9424";
        contact.appendChild(span);

        this.element.appendChild(contact);

        let menu = document.createElement("div");
        menu.className = "footer-menu";

        span = document.createElement("span");
        span.className = "footer-link";
        span.textContent = "이용약관 |";
        span.addEventListener("click", this.OnTermsClicked.bind(this));
        menu.appendChild(span);

        span = document.createElement("span");
        span.className = "footer-link bold";
        span.textContent = "개인정보처리방침";
        span.addEventListener("click", this.OnPrivacyClicked.bind(this));
        menu.appendChild(span);

        span = document.createElement("span");
        span.textContent = "| ver 0.4.6 |";
        menu.appendChild(span);

        span = document.createElement("span");
        span.textContent = "Copyright (c) 2024 나아 All right reserved.";
        menu.appendChild(span);

        this.element.appendChild(menu);
    }

    OnTermsClicked() {
        window.open("../terms.html", "_blank");
    }

    OnPrivacyClicked() {
        window.open("../privacy.html", "_blank");
    }
}