<?php
require_once("Mentoring.php");

$mentoring = new Mentoring();
$emailAddress = $_POST['emailAddress'];
$courseName = "다락방 1층";
$stepNumber = 1;
$chapterNumber = 2;
$problemNumber = 1;
$image = file_get_contents("../../uploading/image-5mb.jpg");

$i = 1;
while ($i <= 20) {
    $content = "풀이테스트" . $i;

    $stmt = $mentoring->connection->prepare(
        "CALL InsertToSolution(\"$emailAddress\", \"$courseName\", $stepNumber, 
                $chapterNumber, $problemNumber, \"$content\", ?, @result)"
    );
    
    $null = NULL;
    $stmt->bind_param("b", $null);
    $stmt->send_long_data(0, $image);
    
    $result = null;
    if ($stmt->execute()) {
        $queryResult = $mentoring->connection->query("SELECT @result");
        $array = $queryResult->fetch_array();
        $result = $array[0];
    }
    sleep(1);
    $i = $i + 1;
}