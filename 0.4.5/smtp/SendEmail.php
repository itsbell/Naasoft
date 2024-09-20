<?php
require("./smtp.php");

$from = 'kch7990@naver.com';

$to = $_POST["emailAddress"];
$code = $_POST["authenticationCode"];
// $to = "terryclass@daum.net";
// $code = "123456";

$smtp = new smtp_class;
$smtp->host_name = "smtp.naver.com";
$smtp->host_port = '465';
$smtp->user = 'kch7990@naver.com';
$smtp->password = 'chanhnkm132536';
$smtp->ssl = 1;
$smtp->debug = 0;       //0 here in production
$smtp->html_debug = 0; //same

$success = $smtp->SendMessage(
    $from,
    array($to),
    array(
        "From: \"나아 소프트북\"<$from>",
        "To: $to",
        "Subject: [나아 소프트북] 회원가입 인증 안내(발신전용)",
        "Content-Type: text/html;"
        // "Date: ".strftime("%a, %d %b %Y %H:%M:%S %Z")
    ),
    "
    <div
        style=\"
            background-color: rgba(245, 249, 255, 1);
            color: rgba(0, 0, 0, 1);
            font-family: 'Noto Sans KR', sans-serif;
            padding: 10px 20px;
            border-radius: 10px;
            width: fit-content;
            \">
        <a style=\"display:flex; text-decoration: none; margin-top: 18px;\" href=\"https://naasoft.co.kr\">    
            <img style=\"width: 50px; height: 50px;\" src=\"https://naasoft.co.kr/logo.png\">
            <p style=\"margin: 0; padding-left: 5px; color: rgba(0, 0, 0, 1); font-size: 39px; font-weight: bold;\">나아 소프트북</p>
        </a>
        <p style=\"font-size: 24px; margin-top: 24px; margin-bottom: 24px;\">환영합니다!</p>
        <p style=\"font-size: 18px; margin-top: 24px; margin-bottom: 24px;\">
            요청하신 나아 소프트북 인증코드를 안내드립니다.<br>
            아래 6자리 인증코드를 입력하여 회원가입을 완료하세요.
        </p>
        <p style=\"font-size: 21px; font-weight: bold; margin-top: 24px; margin-bottom: 24px;\">
            인증코드 : $code
        </p>
        <p style=\"font-size: 18px; margin-top: 24px; margin-bottom: 24px;\">
            본 인증코드는 30분 뒤에 만료됩니다.<br>
            나아 소프트북 드림
        </p>
        </div>
    </div>
    "
);
// "Hello $to,\n\nIt is just to let you know that your SMTP class is working just fine.\n\nBye.\n");

echo $success;
