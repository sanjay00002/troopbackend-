const { SmartAPI } = require('smartapi-javascript');
const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

require('dotenv').config();

const smart_api = new SmartAPI({
  api_key: process.env.SMARTAPI_API_KEY, // PROVIDE YOUR API KEY HERE
  // OPTIONAL : If user has valid access token and refresh token then it can be directly passed to the constructor.
  access_token: process.env.SMARTAPI_JWT ?? null,
  refresh_token: process.env.SMARTAPI_REFRESH_TOKEN ?? null,
});

module.exports = function (io, socket, stock_token, isLive) {
  try {
    return new Promise((resolve, reject) => {
      const web_socket = new WebSocketV2({
        clientcode: process.env.SMARTAPI_CLIENT_CODE,
        jwttoken:
          'Bearer ' + smart_api?.access_token
            ? smart_api.access_token
            : process.env.SMARTAPI_JWT,
        apikey: process.env.SMARTAPI_API_KEY,
        feedtype: smart_api?.feed_token
          ? smart_api?.feed_token
          : process.env.SMARTAPI_FEED_TOKEN,
      });
      if (stock_token[0]) {
        try {
          web_socket.connect().then(() => {
            const json_req = {
              correlationID: 'abcde12345',
              action: 1,
              mode: 2,
              exchangeType: 1,
              tokens: stock_token,
            };

            web_socket.fetchData(json_req);

            web_socket.on('tick', receiveTick);

            // console.log(socket.nsp.name);
            const stock_data = [];

            function receiveTick(data) {
              // console.log("socket file");
              // console.log('receiveTick:::::', data);
              console.log(data)
              console.log("working")
              if (isLive) {
                io.of('/liveContest').emit('get-live-data', data);
                io.of('/normalContest').emit('get-live-data', data);
              } else {
                stock_data.push(data);
                if (stock_data.length === stock_token.length) {
                  web_socket.close();
                  console.log('Connection closed');
                  resolve(stock_data);
                }
              }
            }
          });
        } catch (error) {
          console.log('Error while fetching data', error);
          reject(error);
        }
      } else {
        web_socket.close();
        console.log('connection closed');
        reject(new Error('No stock token provided'));
      }
    });
  } catch (error) {
    smart_api.setSessionExpiryHook(() => {
      smart_api.generateToken(
        smart_api?.refresh_token
          ? smart_api.refresh_token
          : process.env.SMARTAPI_REFRESH_TOKEN,
      );
    });
  }
};
