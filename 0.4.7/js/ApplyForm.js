import { CompositeWindow } from "./Window.js";
import { IndexedDB } from "./IndexedDB.js";
import { CourseList } from "./Course.js";
import { StepBook } from "./Step.js";
import { ApplyBook, ApplyCard, Apply } from "./Apply.js";
import { MenteeCard } from "./Mentee.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { Payment } from "./Payment.js";
import { Button } from "./Buttons.js";
import { Modal } from "./Modal.js";
import { IndexForm } from "./IndexForm.js";
import { DateTime } from "./DateTime.js";
import { FrameController } from "./FrameController.js";

export class ApplyForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.courseName = null;
        this.stepNumber = null;
        this.stepPrice = null;

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.applyForm === undefined) {
            window.top.applyForm = new ApplyForm("APPLYFORM");
        }
        return window.top.applyForm;
    }

    DoPayment() {
        const applyBook = ApplyBook.GetInstance();
        const applyCard = applyBook.GetAt(applyBook.length - 1); // 무조건 하나 이상 있음.
        if (applyCard.isPaid === false) {
            // 1.1.5. 결제 카드를 만든다.
            let orderId = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
            const charactersLength = characters.length;
            let count = 0;
            while (count < charactersLength) {
                orderId += characters.charAt(Math.floor(Math.random() * charactersLength));
                count += 1;
            }
            // let orderName = this.courseName + " " + this.stepNumber + "단계";
            let orderName = this.stepNumber + "단계";
            let price = this.stepPrice;

            const payment = new Payment(orderId, orderName, price);

            let jsonText = JSON.stringify(payment);
            window.top.sessionStorage.setItem("Payment", jsonText);

            // 1.1.6. 결제로 이동한다.
            window.top.location.href = "../pay/pay.php";
        }
        else {
            alert("오류: 이미 결제됨");
        }
    }

    OnLoaded() {
        const stepBook = StepBook.GetInstance();
        const applyBook = ApplyBook.GetInstance();

        // 1. 제목을 만든다.
        let courseIndex = 0;
        let stepIndex = 0;
        let stepList;
        // 1.1. 신청이 있으면 (최근)
        if (applyBook.length > 0) {
            const applyCard = applyBook.GetAt(applyBook.length - 1);
            const currentCourseName = applyCard.courseName;
            const currentStepNumber = applyCard.stepNumber;
            // 1.1.1. 결제가 없으면 신청의 단계로 만든다.
            if (applyCard.isPaid === false) {
                courseIndex = stepBook.Find(currentCourseName);
                if (courseIndex != -1) {
                    stepList = stepBook.GetAt(courseIndex);
                    stepIndex = stepList.Find(currentStepNumber);
                }
            }
            // 1.1.2. 결제가 있으면 신청의 다음 단계로 만든다.
            else {
                courseIndex = stepBook.Find(currentCourseName);
                if (courseIndex != -1) {
                    stepList = stepBook.GetAt(courseIndex);
                    stepIndex = stepList.Find(currentStepNumber + 1);
                    if (stepIndex == -1) {
                        courseIndex++;
                        stepIndex = 0;
                    }
                }
            }

            if (courseIndex == -1 || stepIndex == -1) {
                courseIndex = 0;
                stepIndex = 0;
            }
        }
        stepList = stepBook.GetAt(courseIndex);
        let step = stepList.GetAt(stepIndex);
        this.courseName = stepList.courseName;
        this.stepNumber = step.number;
        this.stepPrice = Math.floor(step.price);

        // 1.2. 신청이 없으면 옹알이 1단계로 만든다.
        const target = this.stepNumber + "단계";

        let titleSection = document.getElementById("TITLE");

        let row = document.createElement("div");
        row.className = "name-row";
        titleSection.appendChild(row);

        let h1 = document.createElement("h1");
        h1.textContent = "신청하기";
        row.appendChild(h1);

        let h3 = document.createElement("h3");
        h3.textContent = "- " + target;
        row.appendChild(h3);

        // 2. 전제 조건을 만든다.
        const conditionMaker = new ConditionMaker(this.courseName, this.stepNumber);
        let pres = conditionMaker.GetPreconditions();

        let precondition = document.getElementById("PRECONDITION");

        let p = document.createElement("p");
        p.className = "bold";
        p.textContent = "준비됐나요?";
        precondition.appendChild(p);

        let i = 0;
        while (i < pres.length) {
            p = document.createElement("p");
            p.textContent = pres[i];
            precondition.appendChild(p);
            i++;
        }

        let link = conditionMaker.GetLink();
        if (link != null) {
            let a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            let u = document.createElement("u");
            u.textContent = "구매하러 가기 →";
            a.appendChild(u);
            p.appendChild(a);
        }

        // 3. 사후 조건을 만든다.
        let postcondition = document.getElementById("POSTCONDITION");

        p = document.createElement("p");
        p.className = "bold";
        p.textContent = "훈련 목표";
        postcondition.appendChild(p);

        let posts = conditionMaker.GetPostconditions();

        i = 0;
        while (i < posts.length) {
            p = document.createElement("p");
            p.textContent = posts[i];
            postcondition.appendChild(p);
            i++;
        }

        // 4. 결제 정보를 만든다.
        let payment = document.getElementById("PAYMENT");

        let div = document.createElement("div");
        payment.appendChild(div);

        let priceString = this.stepPrice.toLocaleString("ko-KR", { style: "currency", currency: "KRW" });
        h1 = document.createElement("h1");
        h1.textContent = priceString;
        div.appendChild(h1);

        div = document.createElement("div");
        payment.appendChild(div);

        let button = document.createElement("button");
        button.id = "PAYBUTTON";
        button.className = "button payButton";
        button.type = "button";
        div.appendChild(button);

        const payButton = new Button("PAYBUTTON",
            "결제하기", this.OnPayButtonClicked.bind(this));
        this.Add(payButton);

        const terms = document.getElementById("TERMS");
        terms.addEventListener("click", this.OnTermsClicked.bind(this));

        const atticButton = new Button("ATTICBUTTON", "다락방 들어가기", this.OnAtticButtonClicked.bind(this));
        this.Add(atticButton);

        const indexForm = IndexForm.GetInstance();
        indexForm.Notify();
    }

    async OnPayButtonClicked() {
        const isPG = true;
        // 1. PG 결제면
        if (isPG === true) {
            // 결제하려는 신청이 없으면 신청을 추가한다.
            const applyBook = ApplyBook.GetInstance();
            let index = applyBook.Find(this.courseName, this.stepNumber);
            if (index == -1) {
                // 1.1. indexedDB를 연다.
                const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
                await indexedDB.Open();

                // 1.2. 신청 책에 신청 카드를 추가한다.
                // 1.2.1. 과정을 찾는다.
                const courseList = CourseList.GetInstance();
                index = courseList.Find(this.courseName);
                const course = courseList.GetAt(index);
                // 1.2.2. 단계를 찾는다.
                const stepBook = StepBook.GetInstance();
                index = stepBook.Find(this.courseName);
                const stepList = stepBook.GetAt(index);
                index = stepList.Find(this.stepNumber);
                const step = stepList.GetAt(index);
                // 1.2.3. 신청 카드를 만든다.
                const applyCard = new ApplyCard(course, step);
                // 1.2.4. 신청을 만든다.
                const apply = new Apply(null, "DEAD", false, null, null);
                applyCard.Add(apply);
                // 1.2.5. 추가한다.
                applyBook.Add(applyCard);

                // 1.4. 서버에 신청 추가를 요청한다.
                const requestor = new PhpRequestor();
                const emailAddress = MenteeCard.GetInstance().emailAddress;
                let time = await requestor.Post("../php/InsertApply.php",
                    "emailAddress=" + emailAddress
                    + "&courseName=" + this.courseName + "&stepNumber=" + this.stepNumber);

                apply.time = new DateTime(time);

                // 1.3. indexedDB에 신청 책을 저장한다.
                await indexedDB.Put("ApplyBook", applyBook);
            }
            // 결제한다.
            this.DoPayment();
        }
        // 2. 계좌이체면 모달을 출력한다.
        else {
            const modal = new Modal("TRANSFERMODAL", "TRANSFERMODALCLOSE");
            modal.DoModal();
        }
    }

    OnTermsClicked() {
        const modal = new Modal("TERMSMODAL", "TERMSMODALCLOSE");
        modal.DoModal();
    }

    async OnAtticButtonClicked() {
        // 1. indexedDB를 연다.
        const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
        await indexedDB.Open();

        // 2. 서버에 신청 데이터를 요청한다.
        const requestor = new PhpRequestor();
        const emailAddress = MenteeCard.GetInstance().emailAddress;
        let applyBookObject = await requestor.PostJson("../php/GetAllApply.php",
            "emailAddress=" + emailAddress
        );

        // 3. 신청 책에 추가한다.
        const applyBook = ApplyBook.GetInstance();
        applyBook.SetObject(applyBookObject);

        // 4. indexedDB에 신청 책을 저장한다.
        await indexedDB.Put("ApplyBook", applyBook);

        // 5. 접수되었으면 다락방으로 들어간다.
        let isApplied = false;
        const length = applyBook.length;
        if (length > 0) {
            const applyCard = applyBook.GetAt(length - 1);
            if (applyCard.courseName === this.courseName && applyCard.stepNumber == this.stepNumber
                && applyCard.isPaid === true) {
                isApplied = true;
            }
        }
        if (isApplied === true) {
            const indexForm = IndexForm.GetInstance();
            const frameController = new FrameController(indexForm);
            frameController.Change("ATTICFORM");
        }
        else {
            alert("아직 처리되지 않았습니다. 안내에 따라 결제 후 다시 클릭하세요.");
        }
    }
}

class ConditionMaker {
    constructor(courseName, stepNumber) {
        this.courseName = courseName;
        this.stepNumber = stepNumber;
    }

    GetPreconditions() {
        let conditions = [];

        if (this.courseName === "다락방 1층" && this.stepNumber === 1) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 1권 노랑책을 구매했다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 2) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 2권 파랑책을 구매했다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 3) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 3권 빨강책을 구매했다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 4) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 4권 보라책을 구매했다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 5) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 5권 주황책을 구매했다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 6) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 6권 초록책을 구매했다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 7) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 7권 하늘책을 구매했다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 8) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 8권 분홍책을 구매했다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 9) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 나프잘 시리즈 9권 갈색책을 구매했다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 1) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 2) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 3) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 4) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 5) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 6) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 7) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 8) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 9) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 10) {
            conditions[0] = "① 내면의 귀차니스트를 잠재우고 아이가 언어 배우듯이 즐겁게 반복할 수 있다.";
            conditions[1] = "② 호기심과 열정, 끈기를 갖고 있다.";
        }

        return conditions;
    }

    GetLink() {
        let link = null;
        if (this.courseName === "다락방 1층" && this.stepNumber === 1) {
            link = "https://product.kyobobook.co.kr/detail/S000001615791";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 2) {
            link = "https://product.kyobobook.co.kr/detail/S000001615792";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 3) {
            link = "https://product.kyobobook.co.kr/detail/S000001615793";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 4) {
            link = "https://product.kyobobook.co.kr/detail/S000001959832";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 5) {
            link = "https://product.kyobobook.co.kr/detail/S000001959833";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 6) {
            link = "https://product.kyobobook.co.kr/detail/S000001959834";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 7) {
            link = "https://product.kyobobook.co.kr/detail/S000001959835";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 8) {
            link = "https://product.kyobobook.co.kr/detail/S000001959836";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 9) {
            link = "https://product.kyobobook.co.kr/detail/S000001959837";
        }

        return link;
    }

    GetPostconditions() {
        let conditions = [];

        if (this.courseName === "다락방 1층" && this.stepNumber === 1) {
            conditions[0] = "① 문제 해결 관점에서의 프로그래밍이란 무엇인지 이해한다.";
            conditions[1] = "② 프로그래밍을 공부하는 방법을 이해한다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 2) {
            conditions[0] = "① 반복구조가 무엇인지 이해한다.";
            conditions[1] = "② 선 검사 반복구조와 후 검사 반복구조의 차이를 이해한다.";
            conditions[2] = "③ 반복구조를 활용할 수 있다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 3) {
            conditions[0] = "① 다양한 유형의 문제에 대해 제어논리를 작성하고 표준화할 수 있다.";
            conditions[1] = "② 문제 해결 절차에 익숙해진다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 4) {
            conditions[0] = "① 알고리즘이 무엇인지 이해한다.";
            conditions[1] = "② 알고리즘은 어떻게 만드는지 이해한다.";
            conditions[2] = "③ 알고리즘을 어떻게 평가하는지 이해한다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 5) {
            conditions[0] = "① 이해하기 쉬운 알고리즘이 무엇인지 이해한다.";
            conditions[1] = "② 이해하기 쉬운 알고리즘은 어떻게 만드는지 이해한다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 6) {
            conditions[0] = "① 배열이 무엇인지 이해한다.";
            conditions[1] = "② 배열이 알고리즘을 만드는데 어떻게 사용되는지 이해한다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 7) {
            conditions[0] = "① 필드와 레코드가 무엇인지 이해한다.";
            conditions[1] = "② 레코드가 알고리즘을 만드는데 어떻게 사용되는지 이해한다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 8) {
            conditions[0] = "① 디스크 파일이 무엇인지 이해한다.";
            conditions[1] = "② 디스크 파일이 알고리즘을 만드는데 어떻게 사용되는지 이해한다.";
        }
        else if (this.courseName === "다락방 1층" && this.stepNumber === 9) {
            conditions[0] = "① 동적 기억장소가 무엇인지 이해한다.";
            conditions[1] = "② 동적 기억장소가 알고리즘을 만드는데 어떻게 사용되는지 이해한다.";
        }
        /* 선생님이 학원 수강생들 각 단계 끝나고 물어보는 질문을 여기에다 적으면 될듯. 지금은 그냥 막 적음. */
        else if (this.courseName === "뒤집기" && this.stepNumber === 1) {
            conditions[0] = "① Stack이 무엇인지, 어떤 문제점이 있는지 이해한다.";
            conditions[1] = "② 주소록의 자료구조와 알고리즘을 만들었다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 2) {
            conditions[0] = "① 문자 사용자 인터페이스가 무엇인지 이해한다.";
            conditions[1] = "② 주소록의 디스크 파일 처리를 이해한다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 3) {
            conditions[0] = "① 단어장을 만들었다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 4) {
            conditions[0] = "① Heap이 무엇인지 이해한다.";
            conditions[1] = "② 주소록의 자료구조와 알고리즘을 만들었다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 5) {
            conditions[0] = "① 그래픽 사용자 인터페이스가 무엇인지 이해한다.";
            conditions[1] = "② 라이브러리 또는 프레임워크를 활용하는 방법을 이해한다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 6) {
            conditions[0] = "① 단어장을 만들었다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 7) {
            conditions[0] = "① 배열이 무엇인지 이해한다.";
            conditions[1] = "② 라이브러리를 설계할 수 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 8) {
            conditions[0] = "① 라이브러리를 구현할 수 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 9) {
            conditions[0] = "① 라이브러리를 응용할 수 있다.";
        }
        else if (this.courseName === "뒤집기" && this.stepNumber === 10) {
            conditions[0] = "① 단어장을 만들었다.";
        }

        return conditions;
    }
}