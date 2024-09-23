<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("InsertMentee");
if ($query != null) {
    $result = $query->Query($_POST['name'], $_POST['emailAddress'], $_POST['password']);
}

echo $result;