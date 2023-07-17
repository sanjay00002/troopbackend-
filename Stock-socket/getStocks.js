
const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

module.exports = async function(io,socket,stock_token) {

	const web_socket = new WebSocketV2({
		clientcode: 'P51775178',
		jwttoken: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2ODk1ODY3NzEsImV4cCI6MTY4OTY3MzE3MX0.Y5cQsO6NpxG4dAB-T5xiBC3Lh0MX-TXGA9sy2o1G8DAeco0uu-XrI1hO7cLvLtsAKGzU0lGP-kH394NOs_ZePQ',
		apikey: 'lLDi3XyK',
		feedtype: 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsImlhdCI6MTY4OTU4Njc3MSwiZXhwIjoxNjg5NjczMTcxfQ.KLOkqidhO3ybOVLVGL14bs9_zl5UMOM1G0Y7Hvcr9AAvfef6JG_k-FY2OgIYYs0Wm-JEx_LgQfL1esujeGYW9Q',
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

