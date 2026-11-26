<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in output
ini_set('log_errors', 1);

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed', 'method' => $_SERVER['REQUEST_METHOD']]);
    exit();
}

// Check if cURL is available
if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL is not enabled on this server']);
    exit();
}

// Optional: Rate limiting to prevent brute force
// Uncomment to enable (requires session support)
/*
session_start();
$max_attempts = 5;
$time_window = 300; // 5 minutes

if (!isset($_SESSION['auth_attempts'])) {
    $_SESSION['auth_attempts'] = 0;
    $_SESSION['auth_first_attempt'] = time();
}

if (time() - $_SESSION['auth_first_attempt'] < $time_window) {
    if ($_SESSION['auth_attempts'] >= $max_attempts) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests. Try again later.']);
        exit();
    }
    $_SESSION['auth_attempts']++;
} else {
    $_SESSION['auth_attempts'] = 1;
    $_SESSION['auth_first_attempt'] = time();
}
*/

// OAuth Configuration (Stored securely on server-side)
$OAUTH_CONFIG = [
    'client_id' => '2',
    'client_secret' => 'L6sMQAHkVwhMJRHcYqlj12BRrIwAFpfoaXn49vwm',
    'grant_type' => 'password',
    'username' => 'admin',
    'password' => 'MSCARSERVPRO123',
    'scope' => '*'
];

// No need to receive credentials from frontend anymore
// Frontend just calls this endpoint without sending sensitive data

try {
    // Log request for debugging
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'attempting_auth' => true
    ];
    
    // Initialize cURL
    $ch = curl_init('https://erp.legendprotek.com/oauth/token');
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($OAUTH_CONFIG));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false); // Don't follow redirects
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    
    $logData['http_code'] = $httpCode;
    $logData['curl_error'] = $curlError;
    
    curl_close($ch);
    
    // Check for cURL errors
    if ($curlError) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Connection failed',
            'message' => $curlError,
            'debug' => $logData
        ]);
        exit();
    }
    
    // Check HTTP status code
    if ($httpCode === 302 || $httpCode === 301) {
        http_response_code(401);
        echo json_encode([
            'error' => 'Authentication failed',
            'message' => 'Server redirected - invalid credentials',
            'debug' => $logData
        ]);
        exit();
    }
    
    // Parse response
    $responseData = json_decode($response, true);
    $logData['has_access_token'] = isset($responseData['access_token']);
    
    // Return response with same status code
    http_response_code($httpCode);
    
    // Add debug info if auth failed
    if ($httpCode !== 200 || !isset($responseData['access_token'])) {
        $responseData['debug'] = $logData;
    }
    
    echo json_encode($responseData);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error',
        'message' => $e->getMessage()
    ]);
}
?>
