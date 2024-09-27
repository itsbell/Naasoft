<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("InsertFeedback");
if ($query != null) {
    $result = $query->Query(
        $_POST['mentoEmailAddress'],
        $_POST['menteeEmailAddress'],
        $_POST['courseName'],
        $_POST['stepNumber'],
        $_POST['chapterNumber'],
        $_POST['problemNumber'],
        $_POST['solutionNumber'],
        $_POST['evaluate'],
        $_POST['content']
    );
}

echo $result;
