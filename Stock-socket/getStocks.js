
const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

module.exports = async function(io,socket,stock_token) {

	const web_socket = new WebSocketV2({
		clientcode: 'P51775178',
		jwttoken: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2ODkwNTkwMDQsImV4cCI6MTY4OTE0NTQwNH0.x32HElQiPVGpsumjzX4rPQQXep1YpGxLmonazUXIOEPmQPnfWnWWAZUAE60JF5fGA2nyeWk8j-R36VWOTfk8gg',
		apikey: 'lLDi3XyK',
		feedtype: 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsImlhdCI6MTY4OTA1OTAwNCwiZXhwIjoxNjg5MTQ1NDA0fQ.XVJRLv_gzN7E39hml-ZzvW7jiYqwGbv6tXLCKScJZt63BA0fOCOBXNm8yRH87xkTcuqqfMyGdUBQJGQw50ENBg',
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
					// console.log('receiveTick:::::', data);
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

