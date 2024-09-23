<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("ClearAuthentication");
if ($query != null) {
    $result = $query->Query($_POST['minute']);
}

echo $result;