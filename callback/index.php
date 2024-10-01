<?php
// Prevent outside access
//header('Access-Control-Allow-Origin: *');

// Caputre headers to maybe validate lather
$headers = getallheaders();

// Capture request body and decode the JSON data
$data = json_decode(file_get_contents('php://input'), true);

// We include the gigawallet-api to load all functions
include("../vendors/gigawallet-api.php");

// Check if decoding was successful and there is an EventType
if ($data !== null && isset($data['EventType'])) {

    // We decode the GigaWallet base64 message
    $message = json_decode(base64_decode($data['Message']));

    // if a new GigaWallet shibe account or invoice was created
    if ($data['EventType'] == "CREATED"){
        if (!isset($message->account)){ // if its a shibe account
            // do something awsome
            $message->id; // account id
            $message->foreign_id; // account foreign id
            $message->payout_address; // account payout dogecoin address
            $message->payout_threshold; // minimum value to send a payment to the account
            $message->payout_frequency; // frequency in ?? to send the payment to lower network fees

            $mess = $message->id."->".$message->payout_frequency;
            //fetchme("Account->".$data['EventType'],$mess); 

        }else{  // if its a shibe invoice            
            // do something awsome
            $message->id; // invoice id
            $message->account; // account id
            $message->vendor; // vendor
            //$message->items; // items
            // Loop through the "items" array
            foreach ($message->items as $item) {
                $item->type; // type
                $item->name; // name
                $item->sku; // sku
                $item->description; // description
                $item->value; // value
                $item->quantity; // quantity
                $item->image_link; // image_link
            };
            $message->confirmations; // block confirmations needed
            $message->created; // date created

            $mess = $message->id."->".$message->confirmations;
            //fetchme("Invoice->".$data['EventType'],$mess);            
        }
    }

    // if a new GigaWallet shibe account balance was changed
    if ($data['EventType'] == "BALANCE_CHANGE"){
        // do something awsome
        $message->account_id; // account id
        $message->foreign_id; // foreign id
        $message->current_balance; // current balance
        $message->incoming_balance; // incoming balance
        $message->outgoing_balance; // outgoing balance
        $mess = $message->account_id."->".$message->current_balance."->".$message->incoming_balance."->".$message->outgoing_balance;
        //fetchme($data['EventType'],$mess);        
    }   
    
    // if the GigaWallet shibe payment was received sucessfull
    if ($data['EventType'] == "PAYMENT_RECEIVED"){
        // do something awsome
        $message->account_id; // account id
        $message->foreign_id; // foreign id
        $message->invoice_id; // invoice id
        //$mess = $message->account_id."->".$message->invoice_id;
        $mess = $message->invoice_id;
        fetchme($data['EventType'],$mess);        
    } 

    // if a GigaWallet shibe payment was sent sucessfull
    if ($data['EventType'] == "PAYMENT_SENT"){
        // do something awsome 
        $message->from; // account foreign id               
        $message->pay_to; // account payout dogecoin address or any other setup              
        $message->amount; // doge money sent
        $message->txid; // dogecoin transaction id
        $mess = $message->from."->".$message->txid;
        //fetchme($data['EventType'],$mess);
    }             
}
function fetchme ($sub,$mess){
    // we update the invoice status to paid
    $G->updateDogePaidStatus($mess);
}
