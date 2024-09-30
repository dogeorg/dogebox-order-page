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

// GigaWallet Bridge
class GigaWalletBridge {

    private $config;     // include GigaWallet Configurations
    public function __construct($config) {
        $this->config = $config;
    }

    // Connects to MariaDB
    public function getDbConnection() {
    
        try {
            $conn = new mysqli($this->config["dbhost"], $this->config["dbuser"], $this->config["dbpass"], $this->config["dbname"], $this->config["dbport"]);
    
            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
    
            return $conn;
        } catch (Exception $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    // Insert Shibe
    public function insertShibe($name, $email, $country, $address, $postalCode, $dogeAddress, $bname, $bemail, $bcountry, $baddress, $bpostalCode, $amount, $paytoDogeAddress, $sku) {
        $conn = $this->getDbConnection();
        $paid = 0;
        $stmt = $conn->prepare("INSERT INTO shibes (name, email, country, address, postalCode, dogeAddress, bname, bemail, bcountry, baddress, bpostalCode, amount, PaytoDogeAddress, paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssssssss", $name, $email, $country, $address, $postalCode, $dogeAddress, $bname, $bemail, $bcountry, $baddress, $bpostalCode, $amount, $paytoDogeAddress, $paid);
    
        $stmt->execute();    
        $stmt->close();
        $conn->close();



        $logo = "<img src='https://doge-box.com/order/img/dogebox-email.png' style='width:100%; max-width: 150px' alet='dogebox' />";
        $mail_subject = "Much Thanks for your order";

        $mail_message = <<<EOD
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: rgb(20, 22, 24);
                    font-family:  'Comic Sans MS', 'Comic Sans', cursive;
                    color: white;
                }
                .email-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: rgb(20, 22, 24);
                }
                .email-header {
                    text-align: center;
                    padding: 5px 0;
                }
                .email-body {
                    padding: 0 20px 20px 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header with centered logo -->
                <div class="email-header">
                    $logo
                </div>
        
                <!-- Email body with white text -->
                <div class="email-body">
                    <h2>Hello $name</h2>
                    Thank you for your recent <b>DogeBox $sku</b> purchase.
                    <br><br>
                    Please make a total payment of
                    <b>Ð $amount</b> to the Dogecoin address <b>$paytoDogeAddress</b>
                    <br><br>
                    After payment you should receive a confirmation email.
                    <br><br>
                    Much Thanks!
                </div>
            </div>
        </body>
        </html>
        EOD;
        
        $this->mailx($email,$this->config["email_from"],$this->config["mail_name_from"],$this->config["email_from"],$this->config["email_password"],$this->config["email_port"],$this->config["email_stmp"],$mail_subject,$mail_message);    

    }

    // Update Dogecoin Payment on Shibe
    public function updateDogePaidStatus($paytoDogeAddress) {
        $conn = $this->getDbConnection();
    
        $stmt = $conn->prepare("UPDATE shibes SET paid = 1 WHERE PaytoDogeAddress = ?");
        $stmt->bind_param("s", $paytoDogeAddress);
    
        $stmt->execute();
        $stmt->close();
        $conn->close();
    }

    // Creates/Gets a GigaWallet Account
    public function account($foreign_id,$payout_address = NULL,$payout_threshold = 0,$payout_frequency = 0,$method = "POST") {

        // Builds the Gigawallet Command
        //$command = "/account/" . $foreign_id . "/" . $payout_address . "/" . $payout_threshold . "/" . $payout_frequency;
        $command = "/account/" . $foreign_id;
        $data["payout_address"] = $payout_address; // address to receive payments
        $data["payout_threshold"] = strval($payout_threshold); // minimum doge value to reach to then send the payment
        $data["payout_frequency"] = strval($payout_frequency); // wen do we want the payment to be sent        

        // Sends the GigaWallet Command
        return $this->sendGigaCommand($this->config["GigaServer"][0] . ":" . $this->config["GigaPort"][0] . $command, $method, $data);
    }

    // Gets a GigaWallet Account Balance
    public function accountBalance($foreign_id) {

        // Builds the Gigawallet Command
        $command = "/account/" . $foreign_id . "/balance";

        // Sends the GigaWallet Command
        return $this->sendGigaCommand($this->config["GigaServer"][0] . ":" . $this->config["GigaPort"][0] . $command, 'GET', NULL);
    }    

    // Creates a GigaWallet Invoice
    public function invoice($foreign_id,$data) {

        // Builds the Gigawallet Command
        $command = "/account/" . $foreign_id . "/invoice/";

        // Sends the GigaWallet Command
        return $this->sendGigaCommand($this->config["GigaServer"][0]. ":" . $this->config["GigaPort"][0] . $command, 'POST', $data);
    } 

    // Gets one GigaWallet Invoice
    public function GetInvoice($foreign_id,$invoice_id) {

        // Builds the Gigawallet Command
        $command = "/account/".$foreign_id."/invoice/" . $invoice_id . "";

        // Sends the GigaWallet Command
        return $this->sendGigaCommand($this->config["GigaServer"][0] . ":" . $this->config["GigaPort"][0] . $command, 'GET', NULL);
    }      

    // Gets all GigaWallet Invoices from that shibe
    public function GetInvoices($foreign_id,$data) {

        // Builds the Gigawallet Command
        $command = "/account/" . $foreign_id . "/invoices?cursor=".$data["cursor"]."&limit=".$data["limit"]."";
        $data = null;
        // Sends the GigaWallet Command
        return $this->sendGigaCommand($this->config["GigaServer"][0] . ":" . $this->config["GigaPort"][0] . $command, 'GET', $data);
    }      

    // Gets a GigaWallet QR code Invoice
    public function qr($foreign_id,$invoice,$fg = "000000",$bg = "ffffff") {

        // Builds the Gigawallet Command
        $command = "/invoice/" . $invoice . "/qr.png?fg=".$fg."&bg=".$bg;

        // Sends the GigaWallet Command
        return  $this->sendGigaCommand($this->config["GigaServer"][1] . ":" . $this->config["GigaPort"][1] . $command, 'GET');
    } 
    
    // Pay to an address
    public function PayTo($foreign_id,$data) {

        // Builds the Gigawallet Command
        $command = "/account/" . $foreign_id . "/pay";

        // Deduct dust to the payment to be able to send it successfull because of network fees
        foreach ($data["pay"] as $key => $payment) {
            $data["pay"][$key]["amount"] = floatval($payment["amount"] - $this->config["GigaDust"]);
        }        

        // Sends the GigaWallet Command
        return $this->sendGigaCommand($this->config["GigaServer"][0] . ":" . $this->config["GigaPort"][0] . $command, 'POST', $data);
    }       

    // Sends commands to the GigaWallet Server
    public function sendGigaCommand($url, $method = 'GET', $data = array()) {
        $ch = curl_init();
    
        // Set the URL
        curl_setopt($ch, CURLOPT_URL, $url);
    
        // Set the request method
        if ($method == 'POST') {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            // Set the Content-Type header to specify JSON data
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    
        // Set the option to return the response as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
        // Execute the request
        $response = curl_exec($ch);
    
        // Check for errors
        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new Exception("GigaWallet Error: $error");
        }
        //print_r($response);

        // Close the curl handle
        curl_close($ch);
    
        // Return the response
        return $response;
    }   
    
// Send emails using SMTP
public function mailx($email_to,$email_from,$email_from_name,$email_username,$email_password,$email_port,$email_stmp,$email_subject,$email_body){

    if (!class_exists('PHPMailer\PHPMailer\Exception'))
    {
      require("PHPMailer/src/PHPMailer.php");
      require("PHPMailer/src/SMTP.php");
      require("PHPMailer/src/Exception.php");
    }

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    $mail->IsSMTP();
    $mail->SMTPOptions = array(
      'ssl' => array(
      'verify_peer' => false,
      'verify_peer_name' => false,
      'allow_self_signed' => true
      )
    );

    $mail->CharSet="UTF-8";
    $mail->Host = $email_stmp;
    $mail->SMTPDebug = 0;
    $mail->Port = $email_port ; //465 or 587

    $mail->SMTPSecure = 'ssl';
    $mail->SMTPAuth = true;
    $mail->IsHTML(true);

    //Authentication
    $mail->Username = $email_username;
    $mail->Password = $email_password;

    //Set Params
    $mail->SetFrom($email_from, $email_from_name);
    $mail->AddAddress($email_to);
    $mail->addReplyTo($this->config["email_reply_to"], $email_from_name);
    $mail->Subject = $email_subject;
    $mail->Body = $email_body;

     if(!$mail->Send()) {
      //echo "Mailer Error: " . $mail->ErrorInfo;
     } else {
      //echo "Message has been sent";
     }
  return null;
  }    

}

$G = new GigaWalletBridge($config);

// we can use callback subscribe on GigaWallet for PAYMENT_RECEIVED to /callback/ or use a cron task
if (isset($_GET["cron"])) {

    // Todo  a function to fetch MariaDB data of all orders to check only the unpaid
    // Create a cron task that sends a GET cron = 1 and paytoDogeAddress detected by GigaWallet
    $G->updateDogePaidStatus($_GET["paytoDogeAddress"])

}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Read the raw POST data from the request body
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true); // Decode the JSON request to an associative array

    // Initialize an empty response array
    $response = array();

    // Check if 'amount' is set and get its value
    if (isset($input['amount'])) {
        $amount = htmlspecialchars($input['amount']); // Sanitize the input
    } else {
        $response['error'] = 'Amount not provided';
    }

    // Check if 'dogeAddress' is set and get its value
    if (isset($input['dogeAddress'])) {
        $dogeAddress = htmlspecialchars($input['dogeAddress']); // Sanitize the input
    } else {
        $response['error'] = 'Doge Address not provided';
    }

    if (!isset($response['error'])) {
        // Create Account
        $foreign_id = $dogeAddress;
        $GigaAccountCreate = json_decode($G->account($foreign_id, payout_address: $this->config["payout_address"], 0, 0, "POST")); // create shibe

        // Get Account
        $GigaAccountGet = json_decode($G->account($foreign_id, NULL, NULL, NULL, "GET"));

        // Create Invoice
        $data["required_confirmations"] = 1; // number of confirmations to validate payment
        $i = 0; // item number 0
        $data["items"][$i]["type"] = "item"; // item type (item/tax/fee/shipping/discount/donation)
        $data["items"][$i]["name"] = $input['sku']; // item name
        $data["items"][$i]["sku"] = $input['sku']; // item sku
        $data["items"][$i]["value"] = (float)$amount; // item value
        $data["items"][$i]["quantity"] = 1; // item quantity

        $GigaInvoiceCreate = json_decode($G->invoice($GigaAccountGet->foreign_id, $data)); // create invoice

        // Get invoice
        $GigaInvoiceGet = json_decode($G->GetInvoice($GigaAccountGet->foreign_id, $GigaInvoiceCreate->id));
        $response['PaytoDogeAddress'] = $GigaInvoiceCreate->id;

        // Insert Shibe
        $G->insertShibe($input['name'], $input['email'], $input['country'], $input['address'], $input['postalCode'], $input['dogeAddress'], $input['bname'], $input['bemail'], $input['bcountry'], $input['baddress'], $input['bpostalCode'], (float)$amount, $response['PaytoDogeAddress'], $input['sku']);

        // Get QR
        $GigaQR = base64_encode($G->qr($GigaAccountGet->foreign_id, $GigaInvoiceGet->id, "000000", "ffffff"));
        $response['GigaQR'] = '<a href="dogecoin:' . $response['PaytoDogeAddress'] . '?amount=' . (float)$amount . '" target="_blank"><doge-qr address="' . $response['PaytoDogeAddress'] . '" amount=' . (float)$amount . ' theme="such-doge"></doge-qr></a>';
    }

    // Send a JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    // Respond with an error if the request method is not POST
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid request method']);
}

?>