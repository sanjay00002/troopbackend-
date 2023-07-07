
const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

module.exports = async function(io,socket,stock_token) {

	const web_socket = new WebSocketV2({
		clientcode: 'P51775178',
		jwttoken: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2ODg3MTUwNzUsImV4cCI6MTY4ODgwMTQ3NX0.wlC0-dhtWDDDUOlS5mrdA8NtwOfbIJUim_AjMGBeRvglD_ChhulOjT-QJ_fLr0jTb8ua8gE4t4ECRyCox500Mw',
		apikey: 'lLDi3XyK',
		feedtype: 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsImlhdCI6MTY4ODcxNTA3NSwiZXhwIjoxNjg4ODAxNDc1fQ.LD7CCltGYKGZ-HXXe2X7EtXGNu31qww-L_g38luFWKDLYDuXhpdjNxrvXowCCe9O1PiYjtrl8JGa3nmNaq8yfw',
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
		
				function receiveTick(data) {
					console.log('receiveTick:::::', data);
					socket.emit('get-live-data',data)
				}
			});
			socket.on('disconnect', () => {
				console.log('A client disconnected');
				web_socket.close();
				console.log("connection closed");
			});
		} catch (error) {
			console.log("Error while fetching data",error);
		}
	} else {
		web_socket.close();
		console.log("connection closed");
	}
}

