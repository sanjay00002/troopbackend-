
const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

module.exports = async function(io,socket,stock_token) {

	const web_socket = new WebSocketV2({
		clientcode: 'P51775178',
		jwttoken: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2ODg5NjM5MTAsImV4cCI6MTY4OTA1MDMxMH0.fFh7W0kOyNrpls3fD-ejGMPDX0mgutfTpdqSYuDaCdKQ64t1zWRiC5KDMhmWGtqeTMkaV6RYdpmIqbU673Iw7g',
		apikey: 'lLDi3XyK',
		feedtype: 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsImlhdCI6MTY4ODk2MzkxMCwiZXhwIjoxNjg5MDUwMzEwfQ.IQHHfRHf230ZBdaV_8rwieNFusyDtUGmQWrIRqCoZ3iwg5a-ZaAjBWCSkx6L54yKg3NCKTMBmpuzeeNfaCw8aA',
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

