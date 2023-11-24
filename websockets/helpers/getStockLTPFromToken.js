const axios = require('axios');

require('dotenv').config({override:true})

// const getStockLTPFromToken = (stockToken) => {
//   return new Promise((resolve, reject) => {
//     const data = JSON.stringify({
//       "mode": "LTP",
//       "exchangeTokens": {
//         "NSE": [stockToken]
//       }
//     });

//     const config = {
//       method: 'post',
//       url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/quote/',
//       headers: {
//         'X-PrivateKey': process.env.SMARTAPI_API_KEY,
//         'Accept': 'application/json',
//         'X-SourceID': 'WEB',
//         'X-ClientLocalIP': '192.168.29.133',
//         'X-ClientPublicIP': '49.36.110.199',
//         'X-MACAddress': 'D8-5E-D3-95-66-24',
//         'X-UserType': 'USER',
//         'Authorization': 'Bearer ' + process.env.SMARTAPI_JWT,
//         'Content-Type': 'application/json'
//       },
//       data: data
//     };

//     axios(config)
//       .then(function (response) {
//         const ltp = response.data.data.fetched[0].ltp;
//         console.log(JSON.stringify(ltp));
//         resolve(ltp); // Resolve the promise with the LTP value
//       })
//       .catch(function (error) {
//         console.error(error);
//         reject(error); // Reject the promise with the error
//       });
//   });
// };

const getStockLTPFromToken = async (stockToken) => {
    console.log("trying to get stock ltp for token " + stockToken)
    return new Promise(async (resolve, reject) => {
        try {
            const apiUrl = process.env.STOCK_SERVER_BASE_URL + 'api/getStockLTP';
            const response = await axios.post(apiUrl, {
                "stockInstrumentArray": [parseInt(stockToken)]
            });
            console.log(response.data[0][stockToken])
            resolve(response.data[0][stockToken]); // Resolve with the data you need
        } catch (error) {
            reject(error); // Reject with the error if something goes wrong
        }
    });
};



export default getStockLTPFromToken;