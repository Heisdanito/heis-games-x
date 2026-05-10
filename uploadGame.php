<?php
// backend/api/uploadGame.php
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    try {
        // Database connection
        require_once __DIR__ . "/connection.php";
        
        // Check if connection exists
        if (!isset($conn) || $conn->connect_error) {
            throw new Exception("Database connection failed");
        }
        
        // Set paths for assets folder (going up from backend/api to project root)
        $project_root = __DIR__ . '/../../'; // This goes to HIDGAMES folder
        $assets_dir = $project_root . 'assets/';
        $images_dir = $assets_dir . 'images/';
        $torrent_dir = $assets_dir . 'torrent/';
        
        // Create directories if they don't exist
        if (!file_exists($assets_dir)) {
            mkdir($assets_dir, 0777, true);
        }
        if (!file_exists($images_dir)) {
            mkdir($images_dir, 0777, true);
        }
        if (!file_exists($torrent_dir)) {
            mkdir($torrent_dir, 0777, true);
        }
        
        // Get form data
        $game_name = trim($_POST['game'] ?? '');
        $game_category = $_POST['games_cat'] ?? 'adventure';
        $game_type = $_POST['type'] ?? 'normal';
        $game_platform = $_POST['platform'] ?? 'PC';
        $game_rating = (int)($_POST['rating'] ?? 0);
        $game_year = $_POST['year'] ?? date('Y');
        $game_tag = $_POST['tag'] ?? '';
        $description = trim($_POST['description'] ?? '');
        $colour_code = $_POST['colour_code'] ?? '#4f7fff';
        $ram = $_POST['ram'] ?? '';
        $gpu = $_POST['gpu'] ?? '';
        $cpu = $_POST['cpu'] ?? '';
        $windows = $_POST['windows'] ?? '';
        $uploaded_by = 'HEIS';
        
        // Validate required fields
        if (empty($game_name)) {
            throw new Exception("Game name is required");
        }
        
        // Handle torrent file
        $torrent_path = '';
        if (!isset($_FILES['torrent_file']) || $_FILES['torrent_file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Torrent file is required or upload failed");
        }
        
        $torrent_file = $_FILES['torrent_file'];
        $original_name = $torrent_file['name'];
        
        // Generate unique filename for torrent
        $safe_game_name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $game_name);
        $torrent_filename = time() . '_' . $safe_game_name . '.torrent';
        $torrent_target = $torrent_dir . $torrent_filename;
        
        // Move uploaded file (whether .bin or .torrent)
        if (!move_uploaded_file($torrent_file['tmp_name'], $torrent_target)) {
            throw new Exception("Failed to save torrent file");
        }
        
        $torrent_path =  $torrent_filename;
        
        // Handle image file
        $image_path = '';
        if (!isset($_FILES['image_file']) || $_FILES['image_file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Game cover image is required");
        }
        
        $image_file = $_FILES['image_file'];
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        $image_ext = strtolower(pathinfo($image_file['name'], PATHINFO_EXTENSION));
        
        if (!in_array($image_file['type'], $allowed_types)) {
            throw new Exception("Invalid image type. Allowed: JPG, PNG, WEBP");
        }
        
        if ($image_file['size'] > 5 * 1024 * 1024) {
            throw new Exception("Image too large. Maximum 5MB");
        }
        
        $image_filename = time() . '_' . $safe_game_name . '.' . $image_ext;
        $image_target = $images_dir . $image_filename;
        
        if (!move_uploaded_file($image_file['tmp_name'], $image_target)) {
            throw new Exception("Failed to save image file");
        }
        
        $image_path =  $image_filename;
        
        // Insert into database
        $sql = 'INSERT INTO posted_games (
                    game, games_cat, type, platform, rating, year, tag,
                    description, colour_code, image_path, torrent_path , ram, gpu, cpu, 
                    windows, upload_by, created_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
                )';
        
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            throw new Exception("Database prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param(
            "ssssiissssssssss",
            $game_name, $game_category, $game_type, $game_platform,
            $game_rating, $game_year, $game_tag, $description,
            $colour_code, $image_path, $torrent_path,  $ram, $gpu, $cpu,
            $windows, $uploaded_by
        );
        
        if ($stmt->execute()) {
            $response = [
                "status" => "success",
                "message" => "Game uploaded successfully",
                "game_id" => $conn->insert_id,
                "torrent_path" => $torrent_path,
                "image_path" => $image_path
            ];
            http_response_code(200);
            echo json_encode($response);
        } else {
            throw new Exception("Failed to save game data: " . $stmt->error);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        $response = [
            "status" => "failed",
            "message" => $e->getMessage()
        ];
        http_response_code(400);
        echo json_encode($response);
    }
    
} else {
    $response = [
        "status" => "failed",
        "message" => "Invalid request method. Use POST."
    ];
    http_response_code(405);
    echo json_encode($response);
}

if (isset($conn)) {
    $conn->close();
}
?>