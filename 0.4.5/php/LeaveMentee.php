<?php
require_once("./Mentoring.php");

$mentoring = new Mentoring();
$result = $mentoring->LeaveMentee($_POST['emailAddress']);

echo $result;

?>