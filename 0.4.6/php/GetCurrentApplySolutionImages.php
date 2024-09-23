<?php
require_once("./Mentoring.php");

ini_set('memory_limit', '512M');

$mentoring = new Mentoring();
// $count = $mentoring->GetCurrentApplySolutionCount($_POST['emailAddress'], $_POST['courseName'], $_POST['stepNumber']);

$images = $mentoring->GetCurrentApplySolutionImages($_POST['emailAddress'], $_POST['courseName'], $_POST['stepNumber'], $_POST['index']);
$result = json_encode($images);

// $results = array();
// $k = 0;
// $i = $_POST['index'];
// while ($i < $length) {
//     $images = $mentoring->GetCurrentApplySolutionImages($_POST['emailAddress'], $_POST['courseName'], $_POST['stepNumber'], $i);
//     $j = 0;
//     while ($j < count($images)) {
//         $results[$k++] = $images[$j];
//         $j++;
//     }
//     $i += 10;
// }
// $result = json_encode($results);

echo $result;
