import { CompositeWindow } from "./Window.js";
import { Payment } from "./Payment.js";
import { CourseList } from "./Course.js";
import { StepBook } from "./Step.js";
import { MenteeCard } from "./Mentee.js";
import { ApplyBook } from "./Apply.js";
import { IndexedDB } from "./IndexedDB.js";
import { PhpRequestor } from "./PhpRequestor.js";
import { Button } from "./Buttons.js";

export class PaymentSuccessForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.paymentSuccessForm === undefined) {
            window.top.paymentSuccessForm = new PaymentSuccessForm("PAYMENTSUCCESSFORM");
        }
        return window.top.paymentSuccessForm;
    }

    async OnLoaded() {
        // 1. sessionStorage에서 결제 정보를 적재한다.
        let jsonText = window.top.sessionStorage.getItem("Payment");
        if (jsonText != null) {
            let obj = JSON.parse(jsonText);
            const payment = new Payment(obj._orderId, obj._orderName, obj._price);

            // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
            // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
            const orderId = payment.orderId;
            const orderName = payment.orderName;
            const price = Math.floor(payment.price);

            const urlParams = new URLSearchParams(window.location.search);

            // 서버로 결제 승인에 필요한 결제 정보를 보내세요.
            // 2. 결제 정보가 동일하면 PG 서버에 결제 승인 요청한다.
            let get_orderId = urlParams.get("orderId");
            let get_amount = urlParams.get("amount");

            let requestData = {
                paymentKey: urlParams.get("paymentKey"),
                orderId: get_orderId,
                amount: get_amount,
            };

            if (get_orderId != orderId || get_amount != price) { //여기에서 논리 비교 연산자 수정하면 결제 실패로
                requestData.paymentKey = "";
            }

            const response = await fetch("./payConfirm.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const json = await response.json();

            window.top.sessionStorage.removeItem("Payment");

            if (!response.ok) {
                // TODO: 결제 실패 비즈니스 로직을 구현하세요.
                window.location.href = "./payFail.php?message=" + json.message + "&code=" + json.code;
            }
            // 3. 승인되었으면
            else {
                // TODO: 결제 성공 비즈니스 로직을 구현하세요.
                const courseList = CourseList.GetInstance();
                const stepBook = StepBook.GetInstance();
                // 3.1. 멘티 카드를 만든다.
                const menteeCard = MenteeCard.GetInstance();
                // 3.2. 신청 책을 만든다.
                const applyBook = ApplyBook.GetInstance();
                // 3.3 indexedDB를 연다.
                const indexedDB = new IndexedDB("NaasoftBook", window.top.indexedDBVersion);
                await indexedDB.Open();

                const courseListObject = await indexedDB.Get("CourseList");
                if (courseListObject != undefined) {
                    courseList.SetObject(courseListObject);
                }
                const stepBookObject = await indexedDB.Get("StepBook");
                if (stepBookObject != undefined) {
                    stepBook.SetObject(stepBookObject, courseList);
                }

                // 3.4. indexedDB에서 멘티 카드를 적재한다.
                const menteeCardObject = await indexedDB.Get("MenteeCard");
                if (menteeCardObject != undefined) {
                    menteeCard.SetObject(menteeCardObject);
                }
                // 3.5. indexedDB에서 신청 책을 적재한다.
                const applyBookObject = await indexedDB.Get("ApplyBook");
                if (applyBookObject != undefined) {
                    applyBook.SetObject(applyBookObject, courseList, stepBook);
                }
                // 3.6. 새 신청 카드를 가져온다.
                const applyCard = applyBook.GetAt(applyBook.length - 1);

                // 3.9. 서버에 결제 추가를 요청한다.
                const emailAddress = menteeCard.emailAddress;
                const requestor = new PhpRequestor();
                let time = await requestor.Post("../php/InsertPayment.php",
                    "emailAddress=" + emailAddress + "&orderId=" + orderId +
                    "&orderName=" + orderName + "&price=" + price
                );

                // 3.7. 신청 카드에서 수정한다.
                applyCard.Pay(time);

                // 3.8. indexedDB에 신청 책을 저장한다.
                await indexedDB.Put("ApplyBook", applyBook);

                const orderNameElement = document.getElementById("COURSESTEP");
                let p = document.createElement("p");
                p.className = "bold";
                p.textContent = orderName;
                orderNameElement.appendChild(p);

                const priceElement = document.getElementById("PRICE");
                p = document.createElement("p");
                p.className = "bold";
                p.textContent = price.toLocaleString("ko-KR", { style: "currency", currency: "KRW" });
                priceElement.appendChild(p);

                const atticButton = new Button("ATTICBUTTON",
                    "다락방 들어가기", this.OnAtticButtonClicked.bind(this));
                this.Add(atticButton);
            }
        }
        else {
            alert("결제 정보를 확인할 수 없습니다. 관리자에게 문의하세요.");
        }
    }

    OnAtticButtonClicked() {
        window.sessionStorage.setItem("PageId", this.id);
        window.location.href = "../../index.php";
    }
}