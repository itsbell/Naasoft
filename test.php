<?php
$directory = '/var/lib/mysql-files/';

if (is_writable($directory)) {
    echo "디렉토리에 쓰기 권한이 있습니다.";
} else {
    echo "디렉토리에 쓰기 권한이 없습니다.";
}
?>