<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json'); // tell client it's JSON

    // $email = $_POST['email'] ?? '';
    // $psw   = $_POST['psw'] ?? '';
    require_once './connection.php';
    // $cate = $_GET['ation'];
    $category = 'banner';
    $single_Game = "SELECT * FROM posted_games WHERE type  = '$category' LIMIT 1 ";
    
    $result = mysqli_query($conn,$single_Game );
    //check value return
    if(mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_array($result);
        
        $data = [
            "id" => $row["id"],
            "game"=> $row["game"],
            "category" => $row["games_cat"],
            "img_url" => $row["image_path"],
            "memory"=> $row["ram"],
            "graphicProcessor"=> $row["gpu"],
            "cpu" => $row["cpu"],
            "windows" => $row["windows"],
            "uploaded_by" => $row["upload_by"],
        ];

        echo json_encode($data);
        
    }else{
        echo "No data found";
    }
};
?>
