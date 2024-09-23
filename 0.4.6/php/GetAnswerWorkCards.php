<?php
require_once("./Mentoring.php");

$mentoring = new Mentoring();
$result = $mentoring->GetAnswerWorkCards(
    $_POST['emailAddress']
);

echo $result;
