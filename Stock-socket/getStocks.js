

module.exports = function(io) {
	const { WebSocketV2 } = require('./smartapi-javascript-main/lib');

	const web_socket = new WebSocketV2({
		clientcode: 'P51775178',
		jwttoken: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsInJvbGVzIjowLCJ1c2VydHlwZSI6IlVTRVIiLCJpYXQiOjE2ODgzNTk2MDMsImV4cCI6MTY4ODQ0NjAwM30.FBK5nOYSrooFohTIhrtwDdTQrYcbEksI7SJvCG0MgJYap42sgpJheSw24or-LDk7EzEv7RCA945pjkTfg76_0A',
		apikey: 'lLDi3XyK',
		feedtype: 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1MTc3NTE3OCIsImlhdCI6MTY4ODM1OTYwMywiZXhwIjoxNjg4NDQ2MDAzfQ.eZ_BAkT3VS8qr7qfyKvkyU3DGnbE8g9N-DRBCmELKub_g_eIKXcBq9ocK74IouLgkeCyFBK0aXbKm9jAJ5AUIg',
	});


	web_socket.connect().then(() => {
		const json_req = {
			correlationID: 'abcde12345',
			action: 1,
			mode: 2,
			exchangeType: 1,
			tokens: ['1594'],
		};

		web_socket.fetchData(json_req);

		web_socket.on('tick', receiveTick);

		function receiveTick(data) {
			console.log('receiveTick:::::', data);
			const stockConnection = io.of('/stockConnection');

			stockConnection.on('connection',(socket)=>{
				socket.on("smart-api-connect",()=>{
					socket.emit("Tick",data);
				})
			})
		}

		// setTimeout(() => {
		// 	web_socket.close();
		// 	console.log("connection closed");
		// }, 60000);
	});

}

