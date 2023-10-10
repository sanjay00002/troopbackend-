const axios = require('axios');

const getStockLTPFromToken = (stockToken) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      "mode": "LTP",
      "exchangeTokens": {
        "NSE": [stockToken]
      }
    });

    const config = {
      method: 'post',
      url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/quote/',
      headers: {
        'X-PrivateKey': process.env.SMARTAPI_API_KEY,
        'Accept': 'application/json',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '192.168.29.133',
        'X-ClientPublicIP': '49.36.110.199',
        'X-MACAddress': 'D8-5E-D3-95-66-24',
        'X-UserType': 'USER',
        'Authorization': 'Bearer ' + process.env.SMARTAPI_JWT,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        const ltp = response.data.data.fetched[0].ltp;
        console.log(JSON.stringify(ltp));
        resolve(ltp); // Resolve the promise with the LTP value
      })
      .catch(function (error) {
        console.error(error);
        reject(error); // Reject the promise with the error
      });
  });
};

export default getStockLTPFromToken;