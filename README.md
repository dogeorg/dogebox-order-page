# DogeBox Order Page

###Requirements:
- PHP 8.X
- MariaDB or MySQL (Latest)
- SMTP Server
- GigaWallet Server
- Shipper Server (https://github.com/dogeorg/shipper)

 ### Import shibes.sql to the MariaDb/MySQL
 ### Configuration needed on conf.php to connect to all servers 
 ### Subscribe on GigaWallet for INV_TOTAL_PAYMENT_DETECTED to URL/callback/ to update payments

 ### Open inc/conf.php and set:

```
// Order host URL
$config['orderHost'] = 'https://localhost/order/';

// GigaWallet Server configuration
// Attenttion **
// Subscribe on GigaWallet for INV_TOTAL_PAYMENT_DETECTED to /inc/callback/ to update payments
// Attenttion **
$config['GigaServer'][0] = 'localhost'; // admin server
$config['GigaPort'][0] = 420; // admin server port
$config['GigaServer'][1] = 'localhost'; // public server
$config['GigaPort'][1] = 69; // public server port
$config['GigaDust'] = 0; // GigaWallet deduct dust to the payment to be able to send it successfull because of network fees
$config['payout_address'] = 'Dxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Dogecoin payout address to move to a secure wallet

// MariaDB Server configuration
$config['dbHost'] = 'localhost';
$config['dbUser'] = 'suchuser';
$config['dbPass'] = 'suchpass';
$config['dbName'] = 'dogebox';
$config['dbPort'] = 3306;

// SMTP Email Server Configuration
$config['mail_name_from'] = 'DogeBox'; // name to show on all emails sent
$config['email_from'] = 'no-reply@localhost'; // email to show and reply on all emails sent
$config['email_reply_to'] = 'no-reply@localhost'; // email to reply
$config['email_port'] = 465;
$config['email_password'] = 'suchpass';
$config['email_stmp'] = 'localhost';

// Shipper Server Configuration
$config['shipperHost'] = 'http://localhost:3000';


```

###To run a test open your browser on https://localhost/inc/tests/