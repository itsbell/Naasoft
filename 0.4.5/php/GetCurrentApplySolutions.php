<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("GetCurrentApplySolutions");
if ($query != null) {
    $result = $query->Query($_POST['emailAddress'], $_POST['courseName'], $_POST['stepNumber']);
}

echo $result;