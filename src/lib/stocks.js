const https = require('https');
const fs = require('fs');

const subCategories = ['Nifty 50', 'Nifty IT', 'Nifty Auto', 'Nifty Bank'];

// Array of Nifty 50 stocks' symbols
const nifty50Stocks = [
  'RELIANCE-EQ',
  'TATASTEEL-EQ',
  'JSWSTEEL-EQ',
  'BHARTIARTL-EQ',
  'HDFCLIFE-EQ',
  'ADANIENT-EQ',
  'BAJAJ-AUTO-EQ',
  'HINDALCO-EQ',
  'INDUSINDBK-EQ',
  'KOTAKBANK-EQ',
  'APOLLOHOSP-EQ',
  'ADANIPORTS-EQ',
  'SUNPHARMA-EQ',
  'ICICIBANK-EQ',
  'ULTRACEMCO-EQ',
  'TATAMOTORS-EQ',
  'INFY-EQ',
  'SBILIFE-EQ',
  'ASIANPAINT-EQ',
  'COALINDIA-EQ',
  'EICHERMOT-EQ',
  'HDFC-EQ',
  'GRASIM-EQ',
  'SBIN-EQ',
  'HDFCBANK-EQ',
  'UPL-EQ',
  'ONGC-EQ',
  'CIPLA-EQ',
  'ITC-EQ',
  'NTPC-EQ',
  'BRITANNIA-EQ',
  'LT-EQ',
  'DRREDDY-EQ',
  'HEROMOTOCO-EQ',
  'TECHM-EQ',
  'M&M-EQ',
  'DIVISLAB-EQ',
  'TATACONSUM-EQ',
  'BAJFINANCE-EQ',
  'MARUTI-EQ',
  'BAJAJFINSV-EQ',
  'AXISBANK-EQ',
  'NESTLEIND-EQ',
  'BPCL-EQ',
  'HINDUNILVR-EQ',
  'WIPRO-EQ',
  'TCS-EQ',
  'POWERGRID-EQ',
  'HCLTECH-EQ',
  'TITAN-EQ',
];

// Array of Nifty IT stocks' symbols
const niftyITStocks = [
  'MPHASIS-EQ',
  'INFY-EQ',
  'LTTS-EQ',
  'TECHM-EQ',
  'WIPRO-EQ',
  'PERSISTENT-EQ',
  'COFORGE-EQ',
  'TCS-EQ',
  'LTIM-EQ',
  'HCLTECH-EQ',
];

// Array of Nifty Auto stocks' symbols
const niftyAutoStocks = [
  'BAJAJ-AUTO-EQ',
  'BHARATFORG-EQ',
  'TATAMOTORS-EQ',
  'SONACOMS-EQ',
  'ASHOKLEY-EQ',
  'EICHERMOT-EQ',
  'MOTHERSON-EQ',
  'MRF-EQ',
  'HEROMOTOCO-EQ',
  'M&M-EQ',
  'TVSMOTOR-EQ',
  'MARUTI-EQ',
  'TIINDIA-EQ',
  'BOSCHLTD-EQ',
  'BALKRISIND-EQ',
];

const niftyBankStocks = [
  'INDUSINDBK-EQ',
  'KOTAKBANK-EQ',
  'PNB-EQ',
  'AUBANK-EQ',
  'ICICIBANK-EQ',
  'SBIN-EQ',
  'HDFCBANK-EQ',
  'IDFCFIRSTB-EQ',
  'BANDHANBNK-EQ',
  'FEDERALBNK-EQ',
  'AXISBANK-EQ',
  'BANKBARODA-EQ',
];

// API endpoint URL
const url =
  'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json';

// Function to fetch data from the API and filter based on Nifty stocks
function fetchData(niftyStocks, subCategory) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const jsonData = JSON.parse(data);

            // Filter the response based on Nifty stocks
            const filteredData = jsonData.filter((stock) => {
              return niftyStocks.includes(stock.symbol);
            });

            // Convert the filtered data into the desired JSON template
            const formattedData = filteredData.map((stock) => {
              return {
                name: stock.symbol,
                token: stock.token,
                exchangeType: 1,
                subCategory: subCategory,
              };
            });

            // Check if the input array length matches the filtered array length
            const inputLength = niftyStocks.length;
            const filteredLength = formattedData.length;
            const missingStocks = niftyStocks.filter((stock) => {
              return !filteredData.some((data) => data.symbol === stock);
            });

            resolve({
              formattedData: formattedData,
              inputLength: inputLength,
              filteredLength: filteredLength,
              missingStocks: missingStocks,
            });
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Fetch Nifty 50 data
fetchData(nifty50Stocks, subCategories[0])
  .then((data) => {
    console.log(
      `Filtered Nifty 50 data: ${JSON.stringify(data.formattedData)}`,
    );
    console.log(`Input array length: ${data.inputLength}`);
    console.log(`Filtered array length: ${data.filteredLength}`);
    console.log(`Missing stocks: ${JSON.stringify(data.missingStocks)}`);

    if (data.missingStocks.length === 0) {
      const jsonData = JSON.stringify(data.formattedData, null, 2);
      fs.writeFile('./data/json/nifty50_data.json', jsonData, (err) => {
        if (err) {
          console.error('Error writing to JSON file:', err);
        } else {
          console.log('Nifty 50 data saved to nifty50_data.json');
        }
      });
    }
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });

// Fetch Nifty IT data
fetchData(niftyITStocks, subCategories[1])
  .then((data) => {
    console.log(
      `Filtered Nifty IT data: ${JSON.stringify(data.formattedData)}`,
    );
    console.log(`Input array length: ${data.inputLength}`);
    console.log(`Filtered array length: ${data.filteredLength}`);
    console.log(`Missing stocks: ${JSON.stringify(data.missingStocks)}`);

    if (data.missingStocks.length === 0) {
      const jsonData = JSON.stringify(data.formattedData, null, 2);
      fs.writeFile('./data/json/niftyIT_data.json', jsonData, (err) => {
        if (err) {
          console.error('Error writing to JSON file:', err);
        } else {
          console.log('Nifty IT data saved to niftyIT_data.json');
        }
      });
    }
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });

// Fetch Nifty Auto data
fetchData(niftyAutoStocks, subCategories[2])
  .then((data) => {
    console.log(
      `Filtered Nifty Auto data: ${JSON.stringify(data.formattedData)}`,
    );
    console.log(`Input array length: ${data.inputLength}`);
    console.log(`Filtered Array length: ${data.filteredLength}`);
    console.log(`Missing stocks: ${JSON.stringify(data.missingStocks)}`);

    if (data.missingStocks.length === 0) {
      const jsonData = JSON.stringify(data.formattedData, null, 2);
      fs.writeFile('./data/json/niftyAuto_data.json', jsonData, (err) => {
        if (err) {
          console.error('Error writing to JSON file:', err);
        } else {
          console.log('Nifty Auto data saved to niftyAuto_data.json');
        }
      });
    }
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });

// Fetch Nifty Bank data
fetchData(niftyBankStocks, subCategories[3])
  .then((data) => {
    console.log(
      `Filtered Nifty Bank data: ${JSON.stringify(data.formattedData)}`,
    );
    console.log(`Input array length: ${data.inputLength}`);
    console.log(`Filtered Array length: ${data.filteredLength}`);
    console.log(`Missing stocks: ${JSON.stringify(data.missingStocks)}`);

    if (data.missingStocks.length === 0) {
      const jsonData = JSON.stringify(data.formattedData, null, 2);
      fs.writeFile('./data/json/niftyBank_data.json', jsonData, (err) => {
        if (err) {
          console.error('Error writing to JSON file:', err);
        } else {
          console.log('Nifty Bank data saved to niftyBank_data.json');
        }
      });
    }
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });
