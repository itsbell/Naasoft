<?php
require_once("./Mentoring.php");

$mentoring = new Mentoring();
$result = $mentoring->GetFeedbackWorkCards(
    $_POST['emailAddress']
);

echo $result;
