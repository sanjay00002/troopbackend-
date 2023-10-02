const getStockLTPFromToken = (stockToken) =>{

    var axios = require('axios');
var data = JSON.stringify({
    "mode": "LTP",
    "exchangeTokens": {
        "NSE": [stockToken]
    }
});

var config = {
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
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data.data.fetched[0].ltp));
  return response.data.data.fetched[0].ltp
})
.catch(function (error) {
  console.log(error);
});

}

export default getStockLTPFromToken