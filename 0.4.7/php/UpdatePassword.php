<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("UpdatePassword");
if ($query != null) {
    $result = $query->Query($_POST['emailAddress'], $_POST['password']);
}

echo $result;