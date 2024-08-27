Given the Australia Post API documentation provided below, write some javascript that can determine the cost of postage of a 700g parcel, 15cm x 15cm x 15cm to Portugal.
https://developers.auspost.com.au/apis/pac/getting-started

Use the non-production APIs, make that configurable.

```
For testing purposes during the integration phase of your project, non-production APIs are available at https://test.npe.auspost.com.au.

The following API key is required to access these APIs: 28744ed5982391881611cca6cf5c240
```

In this tutorial we'll cover how to calculate the postage cost for a parcel delivered internationally using the Postage Assessment API.

Optional Step: Retrieve a list of available country codes
If you don't know the country code for your destination country, you can call the Country data service to determine the currently accepted country and associated country code:

```
 // Set your API key: remember to change this to your live API key in production
$apiKey = 'your_api_key';

$urlPrefix = 'digitalapi.auspost.com.au';
$parcelTypesURL = 'https://' . $urlPrefix . '/postage/country.json';

// Retrieve the list of country codes
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $parcelTypesURL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('AUTH-KEY: ' . $apiKey));
$rawBody = curl_exec($ch);

// Check the response; if the body is empty then an error occurred
if(!$rawBody){
  die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
}

// All good, lets parse the response into a JSON object
$parcelTypesJSON = json_decode($rawBody);
```

Example Response:
```
 {
  "countries": {
    "country": [
      {
        "code": "AF",
        "name": "AFGHANISTAN"
      },
      {
        "code": "AL",
        "name": "ALBANIA"
      },
      {
        "code": "DZ",
        "name": "ALGERIA"
      },
      {
        "code": "AS",
        "name": "AMERICAN SAMOA"
      },
```

Step 1: Retrieve a list of available international parcel postage services

In this step, we’ll call the international parcel service to retrieve a list of available postage services that Australia Post provides for delivering a parcel.

It is important to retrieve the list of available services as part of your application, as over time Australia Post may change their service offerings.

Input parameters required

- Country code for the destination of the item to be sent (calculated in previous step)
- Weight of the item to be sent (in kg)

```
 // Set your API key: remember to change this to your live API key in production
$apiKey = 'your_api_key';

// Define the service input parameters
$destinationCountryCode = 'NZ';
$parcelWeightInKGs = 1.0;

// Set the query params
$queryParams = array(
  "country_code" => $destinationCountryCode,
  "weight" => $parcelWeightInKGs
);

$urlPrefix = 'digitalapi.auspost.com.au';
$postageTypesURL = 'https://' . $urlPrefix . '/postage/parcel/international/service.json?' .
http_build_query($queryParams);

// Lookup available international parcel delivery service types
curl_setopt($ch, CURLOPT_URL, $postageTypesURL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('AUTH-KEY: ' . $apiKey));
$rawBody = curl_exec($ch);

// Check the response; if the body is empty then an error has occurred
if(!$rawBody){
  die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
}

// All good, lets parse the response into a JSON object
$serviceTypesJSON = json_decode($rawBody);
```

Example response:
```
 {
  "services": {
    "service": [
      {
        "code": "INT_PARCEL_COR_OWN_PACKAGING",
        "name": "Courier",
        "price": "85.13",
        "max_extra_cover": 5000,
        "options": {
          "option": [
            {
              "code": "INT_TRACKING",
              "name": "Tracking"
            },
            {
              "code": "INT_SMS_TRACK_ADVICE",
              "name": "SMS track advice"
            },
            {
              "code": "INT_EXTRA_COVER",
              "name": "Extra Cover"
            }
          ]
        }
      },
      {
        "code": "INT_PARCEL_EXP_OWN_PACKAGING",
        "name": "Express",
        "price": "40.13",
        "max_extra_cover": 5000,
        "options": {
          "option": [
            {
              "code": "INT_TRACKING",
              "name": "Tracking"
            },
            {
              "code": "INT_SIGNATURE_ON_DELIVERY",
              "name": "Signature on delivery"
            },
            {
              "code": "INT_SMS_TRACK_ADVICE",
              "name": "SMS track advice"
            },
            {
              "code": "INT_EXTRA_COVER",
              "name": "Extra Cover"
            }
          ]
        }
      },
      {
        "code": "INT_PARCEL_STD_OWN_PACKAGING",
        "name": "Standard",
        "price": "31.40",
        "max_extra_cover": 5000,
        "options": {
          "option": [
            {
              "code": "INT_TRACKING",
              "name": "Tracking"
            },
            {
              "code": "INT_EXTRA_COVER",
              "name": "Extra Cover"
            },
            {
              "code": "INT_SIGNATURE_ON_DELIVERY",
              "name": "Signature on delivery"
            },
            {
              "code": "INT_SMS_TRACK_ADVICE",
              "name": "SMS track advice"
            }
          ]
        }
      },
      {
        "code": "INT_PARCEL_AIR_OWN_PACKAGING",
        "name": "Economy Air Parcels",
        "price": "23.77",
        "max_extra_cover": 500,
        "options": {
          "option": [
            {
              "code": "INT_EXTRA_COVER",
              "name": "Extra Cover"
            },
            {
              "code": "INT_SIGNATURE_ON_DELIVERY",
              "name": "Signature on delivery"
            }
          ]
        }
      }
    ]
  }
}
```

Step 2. Calculate the total delivery price

In this step, we’ll call the international parcel calculate service to calculate the total delivery price. This call is similar to that made in step 1 but now includes the service ‘code’ you have chosen for your delivery.

Input parameters required

    - Country code for the destination of the item to be sent.
    - Weight of the item to be sent (in kg)
    - Service code (This code corresponds to the postal service calculated in step 1)

```
 // Set your API key: remember to change this to your live API key in production
$apiKey = 'your_api_key';

// Define the service input parameters
$destinationCountryCode = 'NZ';
$parcelWeightInKGs = 1.0;

// Set the query params
$queryParams = array(
  "country_code" => $destinationCountryCode,
  "weight" => $parcelWeightInKGs,
  "service_code" => "INT_PARCEL_STD_OWN_PACKAGING"
);

// Set the URL for the International Parcel Calculation service
$urlPrefix = 'digitalapi.auspost.com.au';
$calculateRateURL = 'https://' . $urlPrefix . '/postage/parcel/international/calculate.json?' .
http_build_query($queryParams);

// Calcuate the final international parcel delivery price
curl_setopt($ch, CURLOPT_URL, $calculateRateURL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('AUTH-KEY: ' . $apiKey));
$rawBody = curl_exec($ch);

// Check the response; if the body is empty then an error has occurred
if(!$rawBody){
  die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
}

// All good, lets parse the response into a JSON object
$priceJSON = json_decode($rawBody);
```

Example response:
```
 {
  "postage_result": {
    "service": "Standard",
    "total_cost": "31.40",
    "costs": {
      "cost": {
        "item": "Standard",
        "cost": "31.40"
      }
    }
  }
}
```