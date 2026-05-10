<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json'); // tell client it's JSON

    require_once './connection.php';
    // $cate = $_GET['ation'];
    $single_Game = "SELECT * FROM posted_games LIMIT 40";
    
    $result = mysqli_query($conn,$single_Game );
    //check value return
    if(mysqli_num_rows($result) > 0) {

    $game_list = [];


    while($row = mysqli_fetch_assoc($result)) { 
        //extract innitials
        $name = $row["game"];
        $words = explode(" ", $name);
        $initials = "";

        foreach($words as $w) {
            $initials .= strtoupper($w[0]);
        }

        $game_data = [    
            "id" => $row["id"],
            "title"=> $row["game"],
            "type" => $row["games_cat"],
            "img" => $row["image_path"],
            "accent"=> $row["colour_code"],
            "uploaded_by" => $row["upload_by"],
            "genre" => $row["games_cat"],
            "initials" => $initials,
            "color" => $row["colour_code"],    
            "tag" => $row["tag"],
            "rating" => $row["rating"],
            "platform" => $row["platform"],
        ];
        //add to games list
        $game_list[] = $game_data;
    };
    $response = $game_list;
    echo json_encode($response);

    }else{
        $response = [
            "message"=> "NO DATA FOUND",
            "data"  => 0,
        ];

        echo json_encode($response);
    }
}else{
    $response = [
        "message"=> "invalid",
        "data"=> 0,
    ];
    echo json_encode($response);
}
?>
