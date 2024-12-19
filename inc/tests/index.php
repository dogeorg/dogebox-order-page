<?php
//header('Content-Type: text/html; charset=UTF-8');
// activate tests
$config["tests"] = 1;

// Load classes
include("../vendors/gigawallet-api.php");
include("../vendors/shipper-api.php");

echo $G->testGigaWallet(); // Test GigaWallet
echo $S->testShipperBridge(); // Test Shipper
echo $G->testDbConnection(); // Test DB
echo $G->testtSMTPConnection(); // Test SMTP