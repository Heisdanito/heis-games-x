<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json'); // tell client it's JSON
    //decode
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    //grab params data
    $id = $data['id'] ?? " no value" ;

    //conections
    require_once './connection.php';

    //make an individual query

    $sql = "SELECT * FROM posted_games WHERE id = '$id' ";
    
    $result = mysqli_query($conn, $sql);
    
    $game_data = [];
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_array($result) ;
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
            "description" => $row["description"],
            "year" => $row["year"],
            "torrent" => $row["torrent_path"],
        ];


        echo json_encode($game_data);
        


    } else {


        $response = [
        'staus'=> "success",
        "message" => "No data found",
        "data" => $data,
        ];
    }




} else{
    $response = [
        'status'=> 'failed',
        'message'=> 'invalid request',
    ];
 
    echo json_encode($response);

}
?>