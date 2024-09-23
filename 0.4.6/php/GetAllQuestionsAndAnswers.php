<?php
require_once "./Mentoring.php";

$mentoring = new Mentoring();
$result = $mentoring->GetAllQuestionsAndAnswers(
    $_POST['emailAddress'],
    $_POST['courseName'],
    $_POST['stepNumber']
);

echo $result;

?>