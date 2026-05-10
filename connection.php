<?php
    $db_user = "if0_39620547" ?? "root";
    $db_host = "sql107.infinityfree.com" ?? null;
    $db_name = "if0_39620547_heis" ?? null;
    $db_psw = "7y1f8kdw8iNy" ?? null;

    $conn;

    $conn = mysqli_connect($db_host, $db_user,  $db_psw , $db_name);

    if($conn) {
        //echo 'conected';
    } else {
        echo 'Not connected';
    }