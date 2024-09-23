<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("CheckAuthentication");
if ($query != null) {
    $result = $query->Query($_POST["emailAddress"], $_POST["authenticationCode"]);
}

echo $result;
