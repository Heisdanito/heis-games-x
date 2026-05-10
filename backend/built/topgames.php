<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json'); // tell client it's JSON

    require_once './connection.php';
    // $cate = $_GET['ation'];
    $category = 'banner';
    $single_Game = "SELECT * FROM posted_games WHERE type  != '$category' ORDER BY RAND() LIMIT 10  ";
    
    $result = mysqli_query($conn , $single_Game );
    //check value return
    if(mysqli_num_rows($result) > 0) {

    $game_list = [];

    while($row = mysqli_fetch_assoc($result)) { 
            $game_data = [    
                "id" => $row["id"],
                "title"=> $row["game"],
                "type" => $row["games_cat"],
                "img" => $row["image_path"],
                "accent"=> $row["colour_code"],
                "uploaded_by" => $row["upload_by"],     
                "genre" => $row["games_cat"],
                "color" => $row["colour_code"],    
                "tag" => $row["tag"],
                "rating" => $row["rating"],
                "platform" => $row["platform"],
                "description" => $row["description"],
                "year" => $row["year"],  
                "upload_by" => $row["upload_by"],
            ];
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
    };

?>
