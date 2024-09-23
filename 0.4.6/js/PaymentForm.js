import { CompositeWindow } from "./Window.js";
import { Payment } from "./Payment.js";

export class PaymentForm extends CompositeWindow {
    constructor(id) {
        super(id);

        this.paymentWidget = null;
        this.payment = null;

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        this.element.addEventListener("load", this.OnLoaded.bind(this));
    }

    static GetInstance() {
        if (window.top.paymentForm === undefined) {
            window.top.paymentForm = new PaymentForm("PAYMENTFORM");
        }
        return window.top.paymentForm;
    }

    OnLoaded() {
        // 1. 결제카드를 가져온다.
        let jsonText = window.top.sessionStorage.getItem("Payment");
        if (jsonText != null) {
            let obj = JSON.parse(jsonText);
            this.payment = new Payment(obj._orderId, obj._orderName, obj._price);

            // 2. 결제 인터페이스를 만든다.
            const button = document.getElementById("payment-button");

            // ------  결제위젯 초기화 ------
            // TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
            // TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
            // @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
            const widgetClientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
            //const customerKey = generateRandomString();
            //const paymentWidget = PaymentWidget(widgetClientKey, customerKey); // 회원 결제
            // this.paymentWidget = PaymentWidget(widgetClientKey, PaymentWidget.ANONYMOUS); // 비회원 결제
            this.paymentWidget = PaymentWidget(widgetClientKey, "f0RT1ILahQSL457jwoKwO"); // 비회원 결제

            // ------  결제 UI 렌더링 ------
            // @docs https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
            this.paymentWidget.renderPaymentMethods(
                "#payment-method",
                { value: this.payment.price },
                // 렌더링하고 싶은 결제 UI의 variantKey
                // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
                // @docs https://docs.tosspayments.com/guides/payment-widget/admin#멀티-결제-ui
                { variantKey: "DEFAULT" }
            );
            // ------  이용약관 UI 렌더링 ------
            // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
            this.paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
            // @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
            button.addEventListener("click", this.OnPayButtonClicked.bind(this));
        }
        else {
            alert("결제 오류입니다: 데이터 없음");
        }
    }

    OnPayButtonClicked(event) {
        // 1. 사용자 결제를 시작한다.

        // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
        // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.

        this.paymentWidget.requestPayment({
            orderId: this.payment.orderId,
            orderName: this.payment.orderName,
            // successUrl: window.location.origin + "/pay/paySuccess",
            successUrl: window.location.origin + "/0.4.6/pay/paySuccess.php",
            // failUrl: window.location.origin + "/pay/payFail"
            failUrl: window.location.origin + "/0.4.6/pay/payFail.php"
            //customerEmail: "",
            //customerName: "",
            //customerMobilePhone: "01012341234",
        });
    }
}