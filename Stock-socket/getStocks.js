const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

module.exports = function (io, socket, stock_token, isLive) {
  return new Promise((resolve, reject) => {
    const web_socket = new WebSocketV2({
      clientcode: 'P51775178',
      jwttoken:
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2ODk4Mjg4MzUsImV4cCI6MTY4OTkxNTIzNX0.O227_a7CSk5dn7z5Ly5ag_O7OnfBLMGeADnMGCbk6Inip3nAnwskvlacuYN6HFFxESJvBBvmG2ayKfiwjB_7Hw',
      apikey: 'lLDi3XyK',
      feedtype:
        'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsImlhdCI6MTY4OTgyODgzNSwiZXhwIjoxNjg5OTE1MjM1fQ.vFjuVrobYOiJ8v9yMrhXY1voNg8c_nIWkcjUvg97nfMrwWcjRzYrg2bjl9S_7LPHGht9lslUd_JNW9VIv4diUw',
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
};
