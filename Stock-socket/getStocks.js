
const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

module.exports = async function(io,socket,stock_token) {
	const web_socket = new WebSocketV2({
		clientcode: 'P51775178',
		jwttoken: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2ODk3NTU3OTMsImV4cCI6MTY4OTg0MjE5M30.5D2GR7yaCWb3OQFI_tYer0VRJgD6wC9QqZT-SQQPnwK3x3ieZX-QDeO5FJ8KtRRtsNhL1QSvIuWLTogsnyq7lQ',
		apikey: 'lLDi3XyK',
		feedtype: 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsImlhdCI6MTY4OTc1NTc5MywiZXhwIjoxNjg5ODQyMTkzfQ.io9NpS6Cs8tmx_2xC20fBCmZTIFkDhvk5kEmZDXkv3caWOo6YCfvhI5BNUolLRTEF_Sgz5eUlovKG5M1BTIovA',
	});

	
	if(stock_token[0]){

		try {
			await web_socket.connect().then(() => {
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
				function receiveTick(data) {
					// console.log("socket file");
					console.log('receiveTick:::::', data);

					io.of("/liveContest").emit('get-live-data',data)
					io.of("/normalContest").emit('get-live-data',data)
				}
			});
			// socket.on('disconnect', () => {
			// 	console.log('A client disconnected');
			// 	web_socket.close();
			// 	console.log("connection closed");
			// });
		} catch (error) {
			console.log("Error while fetching data",error);
		}
	} else {
		web_socket.close();
		console.log("connection closed");
	}
}

