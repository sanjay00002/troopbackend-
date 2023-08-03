const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

module.exports = function (io, socket, stock_token, isLive) {
  return new Promise((resolve, reject) => {
    const web_socket = new WebSocketV2({
      clientcode: 'D52282671',
      jwttoken:
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1MjI4MjY3MSIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2OTEwNTQxMjUsImV4cCI6MTY5MTE0MDUyNX0.SllRUBNbZp0USbrYuUL-gaxrnQeY66ALlhnR70gQK4QIwl9C17U9Qw6EbtVOxNi43NUMsz4Df-AF8XNiuoKyLA',
      apikey: 'tKDaJqSN',
      feedtype:
        'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1MjI4MjY3MSIsImlhdCI6MTY5MTA1NDEyNSwiZXhwIjoxNjkxMTQwNTI1fQ.seGX93FdbYZr9q_hJatv_AcVxMSoMHgBRLcgf0XbBTcI7DcpjMz2f9uZNe9yBb5Mpg68kifwXooBaOu_7GXzPw',
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
