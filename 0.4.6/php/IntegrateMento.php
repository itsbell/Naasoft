<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("IntegrateMento");
if ($query != null) {
    $result = $query->Query(
        $_POST["emailAddress"],
        $_POST["playShelf"]
    );
}

echo $result;
