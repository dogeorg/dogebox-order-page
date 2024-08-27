import fetch from 'node-fetch';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const config = {
  apiKey: '9cbcbabe-c42c-4ab4-9a64-16693380734b', // Actual Personal API Key
  baseURL: 'https://digitalapi.auspost.com.au', // Production API
};

// Edition details
const editions = [
  { name: "Standard Edition", dimensions: { length: 15, width: 15, height: 15 }, weight: 0.7 },
  { name: "Founders Edition", dimensions: { length: 20, width: 20, height: 20 }, weight: 1 },
  { name: "Full B0rk Edition", dimensions: { length: 25, width: 25, height: 25 }, weight: 1.2 }
];

let parcel = {};

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

async function getServices(countryCode) {
  try {
    const response = await fetch(`${config.baseURL}/postage/parcel/international/service.json?country_code=${countryCode}&weight=${parcel.weight}`, {
      headers: {
        'AUTH-KEY': config.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.services.service;
  } catch (error) {
    console.error('Error fetching services:', error);
    return null;
  }
}

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runPrompt() {
  try {
    // Prompt for edition selection
    console.log("Available editions:");
    editions.forEach((edition, index) => {
      console.log(`${index + 1}. ${edition.name}`);
    });

    const editionIndex = await promptUser("\nEnter the number of the edition you want to select: ");
    const selectedEdition = editions[parseInt(editionIndex) - 1];

    if (!selectedEdition) {
      throw new Error('Invalid edition selection');
    }

    console.log(`\nYou selected: ${selectedEdition.name}`);
    parcel = { ...selectedEdition.dimensions, weight: selectedEdition.weight };

    // Prompt for country code
    const countryCode = await promptUser("Enter the country code: ");

    const countries = await getCountries();
    if (!countries) {
      throw new Error('Failed to fetch countries');
    }

    const country = countries.find(c => c.code === countryCode.toUpperCase());
    if (!country) {
      throw new Error('Country is not available for posting');
    }

    console.log(`Confirmed: Can post to ${country.name} (${country.code})`);

    // Fetch and list available services
    const services = await getServices(country.code);
    if (!services || services.length === 0) {
      throw new Error('No services available for this country');
    }

    console.log('\nAvailable services:');
    services.forEach((s, index) => {
      console.log(`${index + 1}. ${s.name} - $${s.price}`);
    });

    // Prompt user to select a service
    const serviceIndex = await promptUser("\nEnter the number of the service you want to select: ");
    const selectedService = services[parseInt(serviceIndex) - 1];

    if (!selectedService) {
      throw new Error('Invalid service selection');
    }

    // Display selected service and cost
    console.log(`\nYou selected: ${selectedEdition.name}`);
    console.log(`With postage option: ${selectedService.name}`);
    console.log(`Parcel details: ${parcel.length}x${parcel.width}x${parcel.height} cm, ${parcel.weight} kg`);
    console.log(`Total cost: $${selectedService.price}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

runPrompt();