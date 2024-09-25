<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("IntegrateMentee");
if ($query != null) {
    $result = $query->Query(
        $_POST["emailAddress"],
        $_POST["applyBook"],
        $_POST["playShelf"],
        $_POST["bookmarkCard"]
    );
}

echo $result;
