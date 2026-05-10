<?php
    $db_user = "root" ??  null;
    $db_host = "localhost" ?? null;
    $db_name = "heisx" ?? null;
    $db_psw = "" ?? null;

    $conn;

    $conn = mysqli_connect($db_user, $db_host,  $db_name, $db_psw);

    if($conn) {
        echo 'conected';
    } else {
        echo 'Not connected';
    }