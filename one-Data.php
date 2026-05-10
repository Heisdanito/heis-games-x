<?php
// backend/api/get-Game-data.php
error_reporting(0);
ini_set('display_errors', 0);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

try {
    require_once __DIR__ . "/connection.php";

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed.");
    }

    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        throw new Exception("Invalid or missing game ID.");
    }

    $stmt = $conn->prepare("SELECT * FROM posted_games WHERE id = ? LIMIT 1");
    if (!$stmt) throw new Exception("Query prepare failed: " . $conn->error);

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Game not found.");
    }

    $game = $result->fetch_assoc();
    $stmt->close();
    $conn->close();

    echo json_encode([
        "status" => "success",
        "game"   => $game
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "status"  => "failed",
        "message" => $e->getMessage()
    ]);
}