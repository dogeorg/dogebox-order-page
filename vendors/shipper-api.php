<?php
// include configurations
include("../conf.php");

// Shipper Bridge
class ShipperBridge {

    private $config; // include Shipper Configurations
    public function __construct($config) {
        $this->config = $config;
    }
    
    // Test Shipper
    public function testShipperBridge() {

        // Test countries
        try {
            // Test fetching countries
            $countries = json_decode($this->getCountries(), true);

            if (isset($countries['error'])) {
                echo " - Countries Test Failed ❌\n";
            } else {
                echo " - Countries Test Passed ✅\n";
            }
    
        } catch (Exception $e) {
            echo " - Countries Test Failled ❌\n";
        }
                
        // Test shipping
        try {
            // Simulate shipping request body
            $shippingRequest = array(
                'sku' => 'b0rk',
                'country' => 'PT',
                'postcode' => '1000'
            );

            // Convert the shipping request to JSON and directly pass it to getShipping for testing
            $shipping = json_decode($this->getShipping(json_encode($shippingRequest)), true);

            if (isset($shipping['error'])) {
                echo " - Shipping Test Failed ❌\n";
            } else {
                echo " - Shipping Test Passed ✅\n";
            }
    
        } catch (Exception $e) {
            echo " - Shipping Test Failled ❌\n";
        }     

    }

    public function getCountries() {
        
        // URL of the JSON data
        $url = $this->config["shipperHost"] . '/shipping/countries';

        // Fetch the JSON data from the URL
        $response = file_get_contents($url);

        if ($response === FALSE) {
            // Handle error if fetching fails
            http_response_code(500);
            return json_encode(['error' => 'Failed to retrieve data']);
            exit;
        }

        // Decode the JSON data
        $data = json_decode($response, true);

        // Check if JSON decoding was successful
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Handle JSON decoding error
            http_response_code(500);
            return json_encode(['error' => 'Invalid JSON data']);
            exit;
        }

        // Set the content type to application/json
        header('Content-Type: application/json');

        // Output the JSON data
        return json_encode($data);
    }

    // Accept JSON data directly instead of relying on php://input for testing
    public function getShipping($jsonData = null) {
        // URL to send the POST request to
        $url = $this->config["shipperHost"] . '/shipping/calc';

        // Check if JSON data was passed (for testing purposes)
        if ($jsonData === null) {
            // If not, read from php://input (for real requests)
            $jsonData = file_get_contents('php://input');
        }

        // Decode the incoming JSON data
        $data = json_decode($jsonData, true);

        // Check if JSON decoding was successful
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Return an error if JSON is invalid
            header('Content-Type: application/json');
            return json_encode(['error' => 'Invalid JSON data']);
        }

        // Convert the updated data array to JSON
        $jsonData = json_encode($data);

        // Initialize cURL session
        $ch = curl_init($url);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return response as a string
        curl_setopt($ch, CURLOPT_POST, true); // Specify POST request
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
            return json_encode(['error' => 'cURL Error: ' . curl_error($ch)]);
        }

        // Close cURL session
        curl_close($ch);

        // Output the response as JSON
        header('Content-Type: application/json');
        return $response;
    }
}

// Initialize the ShipperBridge with config
$S = new ShipperBridge($config);

if (!isset($config["tests"])) {
    // Read and decode the incoming JSON data from the request body
    $incomingData = file_get_contents('php://input');
    $data = json_decode($incomingData, true);

    // Check if JSON decoding was successful
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo $S->getCountries();
    } else {
        echo $S->getShipping();
    }
}
