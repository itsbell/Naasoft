<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("GetQuestionWorkCards");
if ($query != null) {
    $result = $query->Query();
}

echo $result;
