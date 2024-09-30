<?php
header('Access-Control-Allow-Origin: *');
// URL of the JSON data
$url = 'http://localhost:3000/shipping/countries';

// Fetch the JSON data from the URL
$response = file_get_contents($url);

if ($response === FALSE) {
    // Handle error if fetching fails
    http_response_code(500);
    echo json_encode(['error' => 'Failed to retrieve data']);
    exit;
}

// Decode the JSON data
$data = json_decode($response, true);

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    // Handle JSON decoding error
    http_response_code(500);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Set the content type to application/json
header('Content-Type: application/json');

// Output the JSON data
echo json_encode($data);
?>