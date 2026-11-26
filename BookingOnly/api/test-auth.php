<?php
// Simple test file to check if auth.php is working
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'status' => 'ok',
    'message' => 'API endpoint is reachable',
    'php_version' => phpversion(),
    'curl_enabled' => function_exists('curl_init') ? 'yes' : 'no',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
