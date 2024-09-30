<?php
//header('Access-Control-Allow-Origin: *');
include("../conf.php");

// URL to send the POST request to
$url = $config["shipperHost"].'/shipping/calc';

// Read and decode the incoming JSON data from the request body
$incomingData = file_get_contents('php://input');
$data = json_decode($incomingData, true);

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    // Return an error if JSON is invalid
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Convert the updated data array to JSON
$jsonData = json_encode($data);

// Initialize cURL session
$ch = curl_init($url);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return response as a string
curl_setopt($ch, CURLOPT_POST, true);           // Specify POST request
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData); // Attach JSON data
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json', // Set the content type to JSON
    'Content-Length: ' . strlen($jsonData) // Specify the length of the content
));

// Execute the cURL request
$response = curl_exec($ch);

// Check for cURL errors
if ($response === FALSE) {
    // Output error if the request fails
    header('Content-Type: application/json');
    echo json_encode(['error' => 'cURL Error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

// Close cURL session
curl_close($ch);

// Output the response as JSON
header('Content-Type: application/json');
echo $response;
?>
