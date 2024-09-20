import { CompositeWindow } from "./Window.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { PasswordChecker } from "./PasswordChecker.js";
import { MenteeCard, Mentee } from "./Mentee.js";
import { IndexedDB } from "./IndexedDB.js";
import { IndexForm } from "./IndexForm.js";
import { FrameController } from "./FrameController.js";

export class SignUpForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.signUpForm === undefined) {
            window.top.signUpForm = new SignUpForm("SIGNUPFORM");
        }
        return window.top.signUpForm;
    }

    OnLoaded() {
        const logoSection = document.getElementById("LOGOSECTION");
        logoSection.addEventListener("click", this.OnLogoSectionClicked);

        const passwordInput = document.getElementById("PASSWORDINPUT");
        passwordInput.addEventListener("blur", this.OnPasswordInputBlur);

        const certifyButton = document.getElementById("AUTHENTICATECODEBUTTON");
        certifyButton.addEventListener("click", this.OnAuthenticateCodeButtonClicked);

        const signUpButton = document.getElementById("SIGNUPBUTTON");
        signUpButton.addEventListener("click", this.OnSignUpButtonClicked);

        const terms = document.getElementById("TERMS");
        terms.addEventListener("click", this.OnTermsClicked);

        const privacy = document.getElementById("PRIVACY");
        privacy.addEventListener("click", this.OnPrivacyClicked);
    }

    async OnAuthenticateCodeButtonClicked() {
        const requestor = new PhpRequestor;
        window.document.body.className = "waiting";

        /** 1. 에러메세지를 지운다. */
        let emailErrorMessage = document.getElementById("EMAILERRORMESSAGE");
        if (emailErrorMessage != null) {
            let signUpMask = document.getElementById("SIGNUPMASK");
            signUpMask.removeChild(emailErrorMessage);
        }

        /** 2. 이메일주소를 읽는다. */
        const emailAddressInput = document.getElementById("EMAILADDRESSINPUT");
        let emailAddress = emailAddressInput.value;

        // 1. 서버에 무효한 회원 삭제를 요청한다.
        await requestor.Post("../php/ClearEmptyMentee.php");

        // 2. 서버에 가입여부 확인을 요청한다.
        let body = "emailAddress=" + emailAddress;
        let result = await requestor.Post("../php/CheckEmailAddress.php", body);

        // 3. 가입되지 않았으면
        if (result === '0') {
            // 3.1. 서버에 인증코드 추가를 요청한다.
            body = "emailAddress=" + emailAddress;
            let code = await requestor.Post("../php/InsertAuthentication.php", body);

            // 3.2. 서버에 이메일 전송을 요청한다.
            body = "emailAddress=" + emailAddress + "&authenticationCode=" + code;
            result = await requestor.Post("../smtp/SendEmail.php", body);

            if (result != '0') {
                alert("이메일주소로 인증코드를 발송했습니다.");
            }
            else {
                alert("인증코드를 발송하지 못했습니다.\n이메일 또는 서버 문제일 수 있습니다.");
            }
        }

        /** 5. 가입된 메일이면 에러메세지를 보여준다. */
        else {
            let signUpMask = document.getElementById("SIGNUPMASK");
            let authenticateCodeInput = document.getElementById("AUTHENTICATECODEINPUT");

            emailErrorMessage = document.createElement("div");
            emailErrorMessage.id = "EMAILERRORMESSAGE";
            emailErrorMessage.innerText = "이미 가입된 이메일주소 입니다.";
            signUpMask.insertBefore(emailErrorMessage, authenticateCodeInput);
        }
        window.document.body.className = "";
    }

    OnPasswordInputBlur() {
        let message;
        let className;
        let signUpMask = document.getElementById("SIGNUPMASK");
        let passwordInput = document.getElementById("PASSWORDINPUT");
        let passwordCheck = document.getElementById("PASSWORDCHECKINPUT");
        let password = passwordInput.value;

        /** 1. 에러메세지를 지운다. */
        let errorMessage = document.getElementById("PASSWORDERRORMESSAGE");
        if (errorMessage != null) {
            signUpMask.removeChild(errorMessage);
        }

        /** 2. 비밀번호 검사를 한다. */
        const passwordChecker = new PasswordChecker;
        let pass = true;
        let retLength = passwordChecker.CheckLength(password);
        let retAlphabet = passwordChecker.CheckAlphabet(password);
        let retNumber = passwordChecker.CheckNumber(password);
        let retSpecialChar = passwordChecker.CheckSpecialChar(password);
        let retSequentialNumber = passwordChecker.CheckSequentialNumber(password);
        let retVaildChar = passwordChecker.CheckVaildChar(password);

        errorMessage = document.createElement("div");
        if (retLength === false || retAlphabet === false || retNumber === false || retSpecialChar === false) {
            message = "8~16자의 영문, 숫자, 특수문자를 사용해 주세요.";
            className = "errorMessage";
            pass = false;
        }
        else if (retVaildChar === false) {
            message = "8~16자의 영문, 숫자, 특수문자만 사용해 주세요.";
            className = "errorMessage";
            pass = false;
        }
        else if (retSequentialNumber === false) {
            message = "연속된 숫자나 전화번호 등 추측하기 쉬운 비밀번호는 피해주세요.";
            className = "warningMessage";
            pass = false;
        }

        if (pass != true) {
            errorMessage.id = "PASSWORDERRORMESSAGE";
            errorMessage.className = className;
            errorMessage.innerText = message;
            signUpMask.insertBefore(errorMessage, passwordCheck);
        }
    }

    async OnSignUpButtonClicked() {
        const nameInput = document.getElementById("NAME");
        const emailAddressInput = document.getElementById("EMAILADDRESSINPUT");
        const authenticateCodeInput = document.getElementById("AUTHENTICATECODEINPUT");
        const passwordInput = document.getElementById("PASSWORDINPUT");
        const passwordCheckInput = document.getElementById("PASSWORDCHECKINPUT");

        let nameValue = nameInput.value;
        let emailAddressValue = emailAddressInput.value;
        let authenticateCodeValue = authenticateCodeInput.value;
        let passwordValue = passwordInput.value;
        let passwordCheckValue = passwordCheckInput.value;

        /** 1. 빈칸이 없는지 확인한다. */
        let input = true;
        let message = "";

        if (nameValue === '') {
            message = "성명을 입력하세요.";
            input = false;
        }
        else if (emailAddressValue === '') {
            message = "이메일주소를 입력하세요.";
            input = false;
        }
        else if (authenticateCodeValue === '') {
            message = "인증코드를 입력하세요.";
            input = false;
        }
        else if (passwordValue === '') {
            message = "비밀번호를 입력하세요.";
            input = false;
        }
        else if (passwordCheckValue === '') {
            message = "비밀번호를 재입력하세요.";
            input = false;
        }

        /** 2. 빈칸이 없으면 */
        if (input === true) {
            const requestor = new PhpRequestor;

            // 1. 서버에 무효한 회원 삭제를 요청한다.
            await requestor.Post("../php/ClearEmptyMentee.php");

            // 2. 서버에 가입여부 확인을 요청한다.
            let body = "emailAddress=" + emailAddressValue;
            let result = await requestor.Post("../php/CheckEmailAddress.php", body);

            // 3. 가입되지 않았으면
            message = "이미 가입된 이메일주소 입니다.";
            if (result === '0') {
                // 3.1. 서버에 인증코드 확인을 요청한다.
                body = "emailAddress=" + emailAddressValue + "&authenticationCode=" + authenticateCodeValue;
                result = await requestor.Post("../php/CheckAuthentication.php", body);

                // 3.2. 확인되었으면
                message = "입력한 인증코드가 일치하지 않습니다.";
                if (result === '1') {
                    message = "";
                    let passwordChecker = new PasswordChecker;
                    let retLength = passwordChecker.CheckLength(passwordValue);
                    let retAlphabet = passwordChecker.CheckAlphabet(passwordValue);
                    let retNumber = passwordChecker.CheckNumber(passwordValue);
                    let retSpecialChar = passwordChecker.CheckSpecialChar(passwordValue);
                    let retVaildChar = passwordChecker.CheckVaildChar(passwordValue);

                    /** 2.2.2.2. 비밀번호가 맞으면 */
                    if (passwordValue === passwordCheckValue && retLength === true &&
                        retAlphabet === true && retNumber === true &&
                        retSpecialChar === true && retVaildChar === true) {

                        // 3.2.1. indexedDB를 연다.
                        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
                        await indexedDB.Open();

                        // 3.2.2. 멘티 카드에 추가한다.
                        const menteeCard = MenteeCard.GetInstance();
                        const mentee = new Mentee(nameValue, emailAddressValue);
                        menteeCard.Add(mentee);

                        // 3.2.3. indexedDB에 멘티 카드를 저장한다.
                        await indexedDB.Put("MenteeCard", menteeCard);

                        // 3.2.4. 서버에 멘티 추가를 요청한다.
                        body = `name=${menteeCard.name}&emailAddress=${menteeCard.emailAddress}&password=${passwordValue}`;
                        await requestor.Post("../php/InsertMentee.php", body);

                        // 3.2.5. 서버에 인증코드 삭제를 요청한다.
                        body = "minute=30"
                        await requestor.Post("../php/ClearAuthentication.php", body);

                        const indexForm = IndexForm.GetInstance();
                        const frameController = new FrameController(indexForm);
                        frameController.Change("APPLYFORM");
                    }

                    /** 2.2.2.3. 비밀번호가 틀리면 */
                    else {
                        let signUpMask = document.getElementById("SIGNUPMASK");
                        let passwordCheck = document.getElementById("PASSWORDCHECKINPUT");
                        let errorMessage = document.getElementById("PASSWORDERRORMESSAGE");

                        if (errorMessage != null) {
                            signUpMask.removeChild(errorMessage);
                        }

                        errorMessage = document.createElement("div");
                        errorMessage.id = "PASSWORDERRORMESSAGE";
                        errorMessage.className = "errorMessage";

                        if (passwordValue != passwordCheckValue) {
                            message = "입력한 비밀번호가 일치하지 않습니다.";
                            errorMessage.innerText = message;
                            signUpMask.insertBefore(errorMessage, passwordCheck);
                        }

                        else if (retLength === false || retAlphabet === false ||
                            retNumber === false || retSpecialChar === false || retVaildChar === false) {
                            message = "8~16자의 영문, 숫자, 특수문자를 사용해 주세요.";
                            errorMessage.innerText = message;
                            signUpMask.insertBefore(errorMessage, passwordCheck);
                        }
                    }
                }
            }
        }

        if (message != "") {
            alert(message);
        }
    }

    OnLogoSectionClicked() {
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("INITIALFORM");
    }

    OnTermsClicked() {
        // window.top.open("/terms", "_blank");
        window.top.open("./terms.html", "_blank");
    }

    OnPrivacyClicked() {
        // window.top.open("/privacy", "_blank");
        window.top.open("./privacy.html", "_blank");
    }
}