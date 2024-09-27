<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->make("SetBookmark");
if($query != null){
    $result = $query->Query($_POST['emailAddress'], $_POST['location']);
}

echo $result;