<?php
require_once("./Mentoring.php");

$mentoring = new Mentoring();
$result = $mentoring->CheckQuestions(
    $_POST['emailAddress'],
    $_POST['courseName'],
    $_POST['stepNumber'],
    $_POST['chapterNumber'],
    $_POST['problemNumber'],
    $_POST['solutionNumber']
);

echo $result;
