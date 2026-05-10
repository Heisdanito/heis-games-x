<?php
// backend/api/all_games.php
error_reporting(0); // Turn off error reporting to prevent HTML output
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    
    try {
        require_once './connection.php';
        
        if (!$conn || $conn->connect_error) {
            throw new Exception("Database connection failed");
        }
        
        $single_Game = "SELECT * FROM posted_games ORDER BY id DESC";
        $result = mysqli_query($conn, $single_Game);
        
        if (!$result) {
            throw new Exception("Query failed: " . mysqli_error($conn));
        }
        
        $game_list = [];
        
        while($row = mysqli_fetch_assoc($result)) { 
            // Extract initials for avatar
            $name = $row["game"];
            $words = explode(" ", $name);
            $initials = "";
            foreach($words as $w) {
                if(!empty($w)) {
                    $initials .= strtoupper($w[0]);
                }
            }
            
            $game_data = [    
                "id" => (int)$row["id"],
                "title" => $row["game"],
                "type" => $row["games_cat"],
                "img" => $row["image_path"],  // This matches frontend's {game.img}
                "game_type" => $row["type"],   // 'banner' or 'normal'
                "accent" => $row["colour_code"],
                "upload_by" => $row["upload_by"],
                "genre" => $row["games_cat"],
                "initials" => $initials,
                "color" => $row["colour_code"],    
                "tag" => $row["tag"],
                "rating" => (int)$row["rating"],
                "platform" => $row["platform"],
                "year" => $row["year"],
                "description" => $row["description"]
            ];
            
            $game_list[] = $game_data;
        }
        
        // Send success response
        echo json_encode($game_list);
        
    } catch (Exception $e) {
        error_log("All games API error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            "error" => true,
            "message" => $e->getMessage()
        ]);
    }
    
    if (isset($conn)) {
        mysqli_close($conn);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "error" => true,
        "message" => "Method not allowed. Use GET."
    ]);
}
?>  