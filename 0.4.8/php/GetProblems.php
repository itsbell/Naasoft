<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("GetProblems");
if ($query != null) {
    $result = $query->Query($_POST['courseName'], $_POST['stepNumber']);
}

echo $result;