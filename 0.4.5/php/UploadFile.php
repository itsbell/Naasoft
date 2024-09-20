<?php

if (isset($_POST)) {
    // $path = "../uploading/" . $_POST['emailAddress'] . '_' . $_POST['fileName'];

    if ($_POST['uploading'] == "true") {
        $ret = file_put_contents($_POST['fileName'], file_get_contents($_FILES['data']['tmp_name']), FILE_APPEND | LOCK_EX);
        echo json_encode(["result" => $ret]);
    } else {
        echo json_encode(["result" => $_POST['fileName']]);
    }
}
