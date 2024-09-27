<?php
require_once("./DatabaseQuery.php");

$result = "";
$factory = new DatabaseQueryFactory();
$query = $factory->Make("GetSolutionImage");
if ($query != null) {
    $image = $query->Query(
        $_POST['emailAddress'],
        $_POST['courseName'],
        $_POST['stepNumber'],
        $_POST['chapterNumber'],
        $_POST['problemNumber'],
        $_POST['number']
    );

    if ($image != null) {
        $base64String = base64_encode($image);
        $result = "data:image/jpeg;base64,$base64String";
    }
}

echo $result;