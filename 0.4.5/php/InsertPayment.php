<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("InsertPayment");
if ($query != null) {
    $result = $query->Query($_POST["emailAddress"], $_POST["orderId"], $_POST["orderName"], $_POST["price"]);
}

echo $result;