import { CompositeWindow } from "./Window.js";
import { CourseList } from "./Course.js";
import { StepBook } from "./Step.js";
import { MenteeCard } from "./Mentee.js";
import { ApplyBook } from "./Apply.js";
import { ProblemList } from "./Problem.js";
import { SolutionBook } from "./Solution.js";
import { FeedbackBook } from "./Feedback.js";
import { QuestionBook } from "./Question.js";
import { AnswerBook } from "./Answer.js";
import { PlayShelf, PlayCase } from "./Play.js";
import { BookmarkCard } from "./Bookmark.js";
import { MentoCard } from "./Mento.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { IndexedDB } from "./IndexedDB.js";
import { Footer } from "./Footer.js";
import { Button } from "./Buttons.js";
import { IndexForm } from "./IndexForm.js";
import { FrameController } from "./FrameController.js";

export class MainForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.forms["MAINFORM"] === undefined) {
            window.top.forms["MAINFORM"] = new MainForm("MAINFORM");
        }
        return window.top.forms["MAINFORM"];
    }

    OnLoaded() {
        window.top.document.title = "나아 소프트북";

        const signInSection = document.getElementById("SIGNIN");
        let slogan = document.createElement("p");
        slogan.className = "slogan";
        signInSection.appendChild(slogan);
        slogan.textContent = "나를 나답게, 사람답게";

        let emailAddressInput = document.createElement("input");
        emailAddressInput.id = "EMAILADDRESS";
        emailAddressInput.className = "input signInInput";
        emailAddressInput.type = "text";
        emailAddressInput.placeholder = "이메일주소";
        signInSection.appendChild(emailAddressInput);

        let passwordInput = document.createElement("input");
        passwordInput.id = "PASSWORD";
        passwordInput.className = "input signInInput";
        passwordInput.type = "password";
        passwordInput.placeholder = "비밀번호";
        signInSection.appendChild(passwordInput);
        passwordInput.addEventListener("keydown", this.OnKeyDown.bind(this));

        let signInButtonElement = document.createElement("button");
        signInButtonElement.id = "SIGNINBUTTON";
        signInButtonElement.className = "button signInButton";
        signInButtonElement.type = "button";
        signInSection.appendChild(signInButtonElement);

        const signInButton = new Button(signInButtonElement.id, "로그인", this.OnSignInButtonClicked.bind(this));
        this.Add(signInButton);

        let anchorWrapper = document.createElement("div");
        anchorWrapper.className = "signIn-anchorWrapper";
        signInSection.appendChild(anchorWrapper);

        let signUpAnchor = document.createElement("a");
        signUpAnchor.textContent = "계정 만들기";
        anchorWrapper.appendChild(signUpAnchor);
        signUpAnchor.addEventListener("click", this.OnSignUpAnchorClicked);

        let span = document.createElement("span");
        span.textContent = " | ";
        anchorWrapper.appendChild(span);

        let findPasswordAnchor = document.createElement("a");
        findPasswordAnchor.textContent = "비밀번호 재설정";
        anchorWrapper.appendChild(findPasswordAnchor);
        findPasswordAnchor.addEventListener("click", this.OnFindPasswordAnchorClicked);

        // 푸터를 만든다.
        let footerElement = document.createElement("footer");
        footerElement.id = "FOOTER";
        footerElement.className = "footer";
        this.element.appendChild(footerElement);

        const footer = new Footer("FOOTER");
        this.Add(footer);

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    OnKeyDown(event) {
        if (event.key === "Enter") {
            this.OnSignInButtonClicked();
        }
    }

    async OnSignInButtonClicked(event) {
        const requestor = new PhpRequestor;

        /** 1. 에러메세지를 지운다. */
        let signInSection = document.getElementById("SIGNIN");
        let errorMessage = document.getElementById("ERRORMESSAGE");
        if (errorMessage != null) {
            signInSection.removeChild(errorMessage);
        }

        /** 2. 이메일주소와 비밀번호를 읽는다. */
        let emailAddressInput = document.getElementById("EMAILADDRESS");
        let passwordInput = document.getElementById("PASSWORD");
        let emailAddress = emailAddressInput.value;
        let password = passwordInput.value;

        const indexForm = IndexForm.GetInstance();

        // 1. 서버에 가입여부 확인을 요청한다.
        let body = "emailAddress=" + emailAddress;
        let result = await requestor.Post("../php/CheckEmailAddress.php", body);

        // 2. 가입되었으면
        if (result === '1') {
            // 2.1. 서버에 멘티일치여부 확인을 요청한다.
            body = "emailAddress=" + emailAddress + "&password=" + password;
            result = await requestor.Post("../php/CheckMentee.php", body);

            // 2.2. 멘티이면
            if (result === '1') {
                const menteeCard = MenteeCard.GetInstance();
                const applyBook = ApplyBook.GetInstance();
                const courseList = CourseList.GetInstance();
                const stepBook = StepBook.GetInstance();
                const playShelf = PlayShelf.GetInstance();
                const bookmarkCard = BookmarkCard.GetInstance();

                // 2.2.1. indexedDB를 연다.
                const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
                await indexedDB.Open();

                // 2.2.2. 서버에 멘티 데이터를 요청한다.
                body = `emailAddress=${emailAddress}`;
                const menteeObject = await requestor.PostJson("../php/GetMentee.php", body);

                // 2.2.3. 멘티 카드에 추가한다.
                menteeCard.SetObject(menteeObject);

                // 2.2.4. indexedDB에 멘티 카드를 저장한다.
                await indexedDB.Put("MenteeCard", menteeCard);

                // 2.2.5. 서버에 신청 데이터를 요청한다.
                body = `emailAddress=${menteeCard.emailAddress}`;
                const applyBookObject = await requestor.PostJson("../php/GetAllApply.php", body);

                // 2.2.6. 신청 책에 추가한다.
                applyBook.SetObject(applyBookObject, courseList, stepBook);

                // 2.2.7. 현재 신청을 찾는다.
                let index = applyBook.FindCurrentCard();
                if (index === -1) {
                    index = applyBook.length - 1;
                }
                // 2.2.8. 신청 책에서 이동한다.
                applyBook.Move(index);

                // 2.2.9. indexedDB에 신청 책을 저장한다.
                await indexedDB.Put("ApplyBook", applyBook);

                const applyCard = applyBook.GetAt(applyBook.current);
                const courseName = applyCard.courseName;
                const stepNumber = applyCard.stepNumber;

                /** 4.3. PlayShlef를 만든다. */
                index = playShelf.Add(new PlayCase(applyCard));
                const playCase = playShelf.GetAt(index);

                // 2.2.10. 서버에 문제 데이터를 요청한다.
                const problemList = new ProblemList();
                body = `courseName=${courseName}&stepNumber=${stepNumber}`;
                const problemListObject = await requestor.PostJson("../php/GetProblems.php", body);

                // 2.2.11. 문제 목록에 추가한다.
                problemList.SetObject(problemListObject);
                playCase.Add(problemList);

                // 2.2.12. 서버에 풀이 데이터를 요청한다.
                const solutionBook = new SolutionBook();
                body = `emailAddress=${menteeCard.emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
                const solutionBookObject = await requestor.PostJson("../php/GetCurrentApplySolutions.php", body);

                // 2.2.13. 풀이 책에 추가한다.
                solutionBook.SetObject(solutionBookObject, problemList);
                playCase.Add(solutionBook);

                // 2.2.14. 서버에 피드백 데이터를 요청한다.
                const feedbackBook = new FeedbackBook();
                body = `emailAddress=${menteeCard.emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
                const feedbackBookObject = await requestor.PostJson("../php/GetCurrentApplyFeedbacks.php", body);

                // 2.2.15. 피드백 책에 추가한다.
                feedbackBook.SetObject(feedbackBookObject, problemList, solutionBook);
                playCase.Add(feedbackBook);

                // 풀이들 상태를 수정한다.
                feedbackBook.UpdateSolutionStates();
                // 신청 상태를 수정한다.
                playCase.UpdateApplyState();

                // 2.2.16. 서버에 질문 데이터를 요청한다.
                const questionBook = new QuestionBook();
                body = `emailAddress=${menteeCard.emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
                const questionBookObject = await requestor.PostJson("../php/GetCurrentApplyQuestions.php", body);

                // 2.2.17. 질문 책에 추가한다.
                questionBook.SetObject(questionBookObject, problemList, solutionBook);
                playCase.Add(questionBook);

                // 2.2.18. 서버에 답변 데이터를 요청한다.
                const answerBook = new AnswerBook();
                body = `emailAddress=${menteeCard.emailAddress}&courseName=${courseName}&stepNumber=${stepNumber}`;
                const answerBookObject = await requestor.PostJson("../php/GetCurrentApplyAnswers.php", body);

                // 2.2.19. 답변 책에 추가한다.
                answerBook.SetObject(answerBookObject, problemList, solutionBook, questionBook);
                playCase.Add(answerBook);

                // 2.2.20. indexedDB에 놀이 책장을 저장한다.
                await indexedDB.Put("PlayShelf", playShelf);

                // 2.2.21. 서버에 책갈피 데이터를 요청한다.
                body = `emailAddress=${menteeCard.emailAddress}`;
                const bookmarkCardObject = await requestor.PostJson("../php/GetBookmark.php", body);

                // 2.2.22. 책갈피 카드에 추가한다.
                bookmarkCard.SetObject(bookmarkCardObject);

                // 2.2.23. indexedDB에 책갈피 카드를 저장한다.
                await indexedDB.Put("BookmarkCard", bookmarkCard);

                // 2.2.24. 다락방으로 이동한다.
                const frameController = new FrameController(indexForm);
                frameController.Change("ATTICFORM");
            }
            /** 5. 아이디와 패스워드가 일치하지 않으면 */
            else {
                let signInButton = document.getElementById("SIGNINBUTTON");
                let errorMessage = document.createElement("div");
                errorMessage.id = "ERRORMESSAGE";
                errorMessage.className = "errorMessage";
                errorMessage.innerText = "아이디 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.";
                signInSection.insertBefore(errorMessage, signInButton);
            }
        }
        // 3. 가입되지 않았으면
        else {
            // 3.1. 서버에 멘토일치여부 확인을 요청한다.
            body = "emailAddress=" + emailAddress + "&password=" + password;
            result = await requestor.Post("../php/CheckMento.php", body);

            // 3.2. 멘토이면
            if (result === "1") {
                const mentoCard = MentoCard.GetInstance();

                // 3.2.1. indexedDB를 연다.
                const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
                await indexedDB.Open();

                // 3.2.2. 서버에 멘토 데이터를 요청한다.
                body = "emailAddress=" + emailAddress;
                let mentoObject = await requestor.PostJson("../php/GetMento.php", body);

                // 3.2.3. 멘토 카드에 추가한다.
                mentoCard.SetObject(mentoObject);

                // 3.2.4. indexedDB에 멘토 카드를 저장한다.
                await indexedDB.Put("MentoCard", mentoCard);

                // 3.2.5. 멘토 다락방으로 이동한다.
                const indexForm = IndexForm.GetInstance();
                const frameController = new FrameController(indexForm);
                frameController.Change("MENTOATTICFORM");
            }

            /** 6.3. 멘토가 아니면 에러메세지를 출력한다. */
            else {
                let signInButton = document.getElementById("SIGNINBUTTON");
                let errorMessage = document.createElement("div");
                errorMessage.id = "ERRORMESSAGE";
                errorMessage.className = "errorMessage";
                errorMessage.innerText = "아이디 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.";
                signInSection.insertBefore(errorMessage, signInButton);
            }
        }
    }

    OnSignUpAnchorClicked() {
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("SIGNUPFORM");
    }

    OnFindPasswordAnchorClicked() {
        const indexForm = IndexForm.GetInstance();
        const frameController = new FrameController(indexForm);
        frameController.Change("FINDPASSWORDFORM");
    }
}