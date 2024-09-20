<?php

$jsonStr = file_get_contents('php://input');
$jsonObj = json_decode($jsonStr, true);

$paymentKey = $jsonObj['paymentKey'] ?? '';
$orderId = $jsonObj['orderId'] ?? '';
$amount = $jsonObj['amount'] ?? '';

// TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
// @docs https://docs.tosspayments.com/reference/using-api/api-keys
$widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

// 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
// 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
// @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
$credential = base64_encode($widgetSecretKey . ':');


// 결제 승인 API를 호출하세요.
// 결제를 승인하면 결제수단에서 금액이 차감돼요.
// @docs https://docs.tosspayments.com/guides/payment-widget/integration#3-결제-승인하기
$url = 'https://api.tosspayments.com/v1/payments/confirm';
$data = ['paymentKey' => $paymentKey, 'orderId' => $orderId, 'amount' => $amount];

$curlHandle = curl_init($url);
curl_setopt_array($curlHandle, [
    CURLOPT_POST => TRUE,
    CURLOPT_RETURNTRANSFER => TRUE,
    CURLOPT_HTTPHEADER => [
        'Authorization: Basic ' . $credential,
        'Content-Type: application/json'
    ],
    CURLOPT_POSTFIELDS => json_encode($data)
]);

$response = curl_exec($curlHandle);
$httpCode = curl_getinfo($curlHandle, CURLINFO_HTTP_CODE);

// CHAN : 결제 승인 결과가 httpCode인 것 같다.
if ($httpCode == 200) {
    // TODO: 결제 성공 비즈니스 로직을 구현하세요.
    error_log($response);
} else {
    // TODO: 결제 실패 비즈니스 로직을 구현하세요.
    error_log($response);
}

http_response_code($httpCode);
echo $response;

?>
