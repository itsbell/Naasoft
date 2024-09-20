<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("CheckMentee");
if ($query != null) {
    $result = $query->Query($_POST['emailAddress'], $_POST['password']);
}

echo $result;