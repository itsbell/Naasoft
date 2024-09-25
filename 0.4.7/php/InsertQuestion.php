<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("InsertQuestion");
if ($query != null) {
    $result = $query->Query(
        $_POST['emailAddress'],
        $_POST['courseName'],
        $_POST['stepNumber'],
        $_POST['chapterNumber'],
        $_POST['problemNumber'],
        $_POST['solutionNumber'],
        $_POST['number'],
        $_POST['content']
    );
}

echo $result;