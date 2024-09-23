<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="chan" />
    <title>결제성공</title>
    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="../assets/favicon.ico" />

    <link href="../css/PaymentSuccessForm.css" rel="stylesheet" />
    <!-- <script src="https://js.tosspayments.com/v1/payment-widget"></script> -->
</head>

<body id="PAYMENTSUCCESSFORM">
    <div class="container">
        <div class="contentBox">
            <div class="paySuccess">
                <img class="successImg" src="../assets/Success.png" />
                <h4 class ="subject">결제 성공</h4>
            </div>
            
            <table class ="table">
                <tr>
                    <td id="COURSESTEP"></td>
                </tr>
                <tr>
                    <td id="PRICE"></td>
                </tr>
            </table>

            <button id="ATTICBUTTON" class="button atticButton"></button>
        </div>
    </div>

    <script src="../js/PaymentSuccessApp.js" type="module"></script>
</body>

</html>