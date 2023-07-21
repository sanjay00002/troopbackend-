const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

module.exports = function (io, socket, stock_token, isLive) {
  return new Promise((resolve, reject) => {
    const web_socket = new WebSocketV2({
      clientcode: 'P51775178',
      jwttoken:
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2ODk5MjA5ODQsImV4cCI6MTY5MDAwNzM4NH0.bZDIzVWrA4wta5XYn7p5r7eiRwR29JpCv_ANYJs1y03mt2ILVyFEAOkShQCBi96OSUJaeKSoZt9SmAojvDeD7w',
      apikey: 'lLDi3XyK',
      feedtype:
        'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsImlhdCI6MTY4OTkyMDk4NCwiZXhwIjoxNjkwMDA3Mzg0fQ.NqtSlwuaYjk2tj_8NuimTIkrERxi2r2ynJC4UgYgYMpksMHXkLDX0SOp2UU4UveVALGx3O5rSt_jRVsArfxEPg',
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
