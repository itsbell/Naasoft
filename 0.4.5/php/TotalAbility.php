<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("TotalAbility");
if($query != null){
    $result = $query->Query($_POST['emailAddress']);
}

echo $result;
