<?php
// backend/api/deleteGame.php
error_reporting(0);
ini_set('display_errors', 0);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(200); exit(); }
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "failed", "message" => "Use POST."]);
    exit();
}

try {
    require_once __DIR__ . "/connection.php";

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed.");
    }

    // ── Validate ID ───────────────────────────────────────────────────────────
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    if ($id <= 0) throw new Exception("Invalid game ID.");

    // ── Fetch record first so we can delete its files ─────────────────────────
    $stmt = $conn->prepare("SELECT image_path, torrent_path FROM posted_games WHERE id = ? LIMIT 1");
    if (!$stmt) throw new Exception("DB error: " . $conn->error);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $game = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$game) throw new Exception("Game not found.");

    // ── Delete from database ──────────────────────────────────────────────────
    $del = $conn->prepare("DELETE FROM posted_games WHERE id = ?");
    if (!$del) throw new Exception("DB prepare failed: " . $conn->error);
    $del->bind_param("i", $id);

    if (!$del->execute()) {
        throw new Exception("DB delete failed: " . $del->error);
    }
    $del->close();
    $conn->close();

    // ── Delete files from disk ────────────────────────────────────────────────
    $project_root  = rtrim(dirname(dirname(__DIR__)), '/\\') . '/';
    $deleted_files = [];
    $failed_files  = [];

    if (!empty($game['image_path'])) {
        $img_path = $project_root . $game['image_path'];
        if (file_exists($img_path)) {
            @unlink($img_path) ? $deleted_files[] = $game['image_path'] : $failed_files[] = $game['image_path'];
        }
    }

    if (!empty($game['torrent_path'])) {
        $tor_path = $project_root . $game['torrent_path'];
        if (file_exists($tor_path)) {
            @unlink($tor_path) ? $deleted_files[] = $game['torrent_path'] : $failed_files[] = $game['torrent_path'];
        }
    }

    echo json_encode([
        "status"        => "success",
        "message"       => "Game deleted successfully.",
        "game_id"       => $id,
        "deleted_files" => $deleted_files,
        "failed_files"  => $failed_files,
    ]);

} catch (Exception $e) {
    error_log("[deleteGame] " . $e->getMessage());
    http_response_code(400);
    echo json_encode(["status" => "failed", "message" => $e->getMessage()]);
}