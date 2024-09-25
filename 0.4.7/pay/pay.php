<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="chan" />
    <title>결제하기</title>
    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="../assets/favicon.ico" />

    <link href="../css/PaymentForm.css" rel="stylesheet" />
    <script src="https://js.tosspayments.com/v1/payment-widget"></script>
</head>

<body id="PAYMENTFORM">
    <!-- 주문서 영역 -->
    <div class="wrapper">
        <div class="box_section" style="
          padding: 40px 30px 50px 30px;
          margin-top: 30px;
          margin-bottom: 50px;
        ">
            <!-- 결제 UI -->
            <div id="payment-method"></div>
            <!-- 이용약관 UI -->
            <div id="agreement"></div>
            <!-- 결제하기 버튼 -->
            <div class="result wrapper">
                <button class="button" id="payment-button" style="margin-top: 30px">
                    결제하기
                </button>
            </div>
        </div>
    </div>

    <script src="../js/PaymentApp.js" type="module"></script>
</body>

</html>