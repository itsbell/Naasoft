<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="chan" />
    <title>결제실패</title>
    <!-- Favicon-->
    <link href="../css/PaymentFailForm.css" rel="stylesheet" />
    <link rel="icon" type="image/x-icon" href="../assets/favicon.ico" />
</head>

<body id="PAYMENTFAILFORM">
    <div class="container">
        <div class="contentBox">
            <div class="payFail">
                <img class="failImg" src="../assets/Fail.png" />
                <h4 class="subject"> 결제 실패</h2>
            </div>

            <table class="table">
                <tr>
                    <td>
                        <p class="bold">Code:</p>
                    </td>
                    <td id="CODE"></td>
                </tr>
                <tr>
                    <td colspan="2" id="MESSAGE"></td>
                </tr>
            </table>

            <button id="PREVIOUSBUTTON" class="button previousButton">
                <p>돌아가기</p>
            </button>
        </div>
    </div>

    <script src="../js/PaymentFailApp.js" type="module"></script>
</body>

</html>