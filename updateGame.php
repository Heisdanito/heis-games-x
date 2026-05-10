<?php
// backend/api/updateGame_debug.php (create this debug file)
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(200); exit(); }

// Create a log file to see what's happening
$log_file = __DIR__ . '/update_debug.log';

function debug_log($message) {
    global $log_file;
    file_put_contents($log_file, date('Y-m-d H:i:s') . " - " . $message . PHP_EOL, FILE_APPEND);
}

debug_log("=== Update Game Request Started ===");
debug_log("REQUEST_METHOD: " . $_SERVER["REQUEST_METHOD"]);
debug_log("POST data: " . print_r($_POST, true));
debug_log("FILES data: " . print_r($_FILES, true));

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $response = ["status" => "failed", "message" => "Use POST method"];
    echo json_encode($response);
    debug_log("Response: " . json_encode($response));
    exit();
}

try {
    // Test database connection first
    debug_log("Attempting to load connection.php");
    
    if (!file_exists(__DIR__ . "/connection.php")) {
        throw new Exception("connection.php not found at: " . __DIR__ . "/connection.php");
    }
    
    require_once __DIR__ . "/connection.php";
    
    if (!isset($conn)) {
        throw new Exception("\$conn not set in connection.php");
    }
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    debug_log("Database connected successfully");

    // Get and validate ID
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    debug_log("Game ID: " . $id);
    
    if ($id <= 0) {
        throw new Exception("Invalid game ID. Received: " . ($_POST['id'] ?? 'null'));
    }

    // Check if game exists
    $check = $conn->prepare("SELECT * FROM posted_games WHERE id = ?");
    if (!$check) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $check->bind_param("i", $id);
    $check->execute();
    $result = $check->get_result();
    $existing = $result->fetch_assoc();
    $check->close();
    
    if (!$existing) {
        throw new Exception("Game not found with ID: " . $id);
    }
    
    debug_log("Existing game found: " . $existing['game']);

    // Simple update without file handling first (to test DB update)
    $game_name = trim($_POST['game'] ?? $existing['game']);
    $description = trim($_POST['description'] ?? $existing['description']);
    
    debug_log("Updating: game='$game_name', description='$description'");

    // Simple update query
    $sql = "UPDATE posted_games SET game = ?, description = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Update prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("ssi", $game_name, $description, $id);
    
    if (!$stmt->execute()) {
        throw new Exception("Update execution failed: " . $stmt->error);
    }
    
    $affected = $stmt->affected_rows;
    $stmt->close();
    
    debug_log("Update successful. Affected rows: " . $affected);

    $response = [
        "status" => "success",
        "message" => "Game updated successfully",
        "game_id" => $id,
        "affected_rows" => $affected
    ];
    
    echo json_encode($response);
    debug_log("Response sent: " . json_encode($response));

} catch (Exception $e) {
    $response = [
        "status" => "failed",
        "message" => $e->getMessage()
    ];
    
    echo json_encode($response);
    debug_log("ERROR Response: " . json_encode($response));
    debug_log("Stack trace: " . $e->getTraceAsString());
}

if (isset($conn)) {
    $conn->close();
}

debug_log("=== Request Complete ===");
?>`