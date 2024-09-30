<?php

header('Access-Control-Allow-Origin: *');
//ini_set('display_errors', 1);
// GigaWallet Server configuration

// Attenttion **
// Subscribe on GigaWallet for PAYMENT_RECEIVED to /callback/ to update payments
// Attenttion **

$config["gigawallet"] = 1; // enable GigaWallet
$config["GigaServer"][0] = "localhost"; // admin server
$config["GigaPort"][0] = 420; // admin server port
$config["GigaServer"][1] = "localhost"; // public server
$config["GigaPort"][1] = 69; // public server port
$config["GigaDust"] = 0; // GigaWallet deduct dust to the payment to be able to send it successfull because of network fees
$config["payout_address"] = "Dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Dogecoin payout address to move to a secure wallet

// MariaDB Server configuration
$config["dbhost"] = "localhost"; 
$config["dbuser"] = "shuchuser";
$config["dbpass"] = "shuchpass";
$config["dbname"] = "dogebox";
$config["dbport"] = 3306;

// SMTP Email Configuration
$config["mail_name_from"] = "DogeBox"; // name to show on all emails sent
$config["email_from"] = "no-reply@doge-box.com"; // email to show and reply on all emails sent
$config["email_reply_to"] = "no-reply@doge-box.com"; // email to reply
$config["email_port"] = 465;
$config["email_password"] = "shuchpass";
$config["email_stmp"] = "mail.doge-box.com";
