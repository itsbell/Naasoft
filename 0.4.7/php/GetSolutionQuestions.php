<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("GetSolutionQuestions");
if ($query != null) {
    $result = $query->Query(
        $_POST['emailAddress'],
        $_POST['courseName'],
        $_POST['stepNumber'],
        $_POST['chapterNumber'],
        $_POST['problemNumber'],
        $_POST['number']
    );
}

echo $result;