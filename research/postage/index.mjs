import fetch from 'node-fetch';

// Configuration
const config = {
  // apiKey: '28744ed5982391881611cca6cf5c240', // Test API Key
  // baseURL: 'https://test.npe.auspost.com.au', // Non-production API
  apiKey: '9cbcbabe-c42c-4ab4-9a64-16693380734b', // Actual Personal API Key
  baseURL: 'https://digitalapi.auspost.com.au', // Production API
};

// Parcel details
const parcel = {
  weight: 0.7, // 700g in kg
  length: 15,
  width: 15,
  height: 15,
  country_code: 'PT' // Portugal
};

async function getCountries() {
  try {
    const response = await fetch(`${config.baseURL}/postage/country.json`, {
      headers: {
        'AUTH-KEY': config.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.countries.country;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return null;
  }
}

async function getPostageCost() {
  try {
    // Optional Step: Check if Country is an available country
    const countries = await getCountries();
    if (!countries) {
      throw new Error('Failed to fetch countries');
    }

    const country = countries.find(country => country.code === parcel.country_code);
    if (!country) {
      throw new Error('country is not available for posting');
    }

    console.log(`Confirmed: Can post to ${country.name} (${country.code})`);

    // Step 1: Get available international parcel services
    const servicesResponse = await fetch(`${config.baseURL}/postage/parcel/international/service.json?country_code=${parcel.country_code}&weight=${parcel.weight}`, {
      headers: {
        'AUTH-KEY': config.apiKey
      }
    });

    if (!servicesResponse.ok) {
      throw new Error(`HTTP error! status: ${servicesResponse.status}`);
    }

    const servicesData = await servicesResponse.json();
    const services = servicesData.services.service;
    console.log('Available services:', services.map(s => `${s.name} (${s.code})`).join(', '));

    // For this example, we'll use the first available service
    const selectedService = services[0];

    // Step 2: Calculate the total delivery price
    const calculationResponse = await fetch(`${config.baseURL}/postage/parcel/international/calculate.json?country_code=${parcel.country_code}&weight=${parcel.weight}&service_code=${selectedService.code}`, {
      headers: {
        'AUTH-KEY': config.apiKey
      }
    });

    if (!calculationResponse.ok) {
      throw new Error(`HTTP error! status: ${calculationResponse.status}`);
    }

    const calculationData = await calculationResponse.json();
    const result = calculationData.postage_result;
    console.log(`\nSelected service: ${result.service}`);
    console.log(`Total cost: $${result.total_cost}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

getPostageCost();