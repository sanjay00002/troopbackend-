let { SmartAPI, WebSocket} = require('smartapi-javascript');


let smart_api = new SmartAPI({
	api_key: 'lLDi3XyK', // PROVIDE YOUR API KEY HERE
	// OPTIONAL : If user has valid access token and refresh token then it can be directly passed to the constructor.
	// access_token: "YOUR_ACCESS_TOKEN",
	// refresh_token: "YOUR_REFRESH_TOKEN"
});

// If user does not have valid access token and refresh token then use generateSession method
const feed = '';
const client_id = 'P51775178';
const client_password = '9007';
smart_api
	.generateSession(client_id, client_password, '882060')
	.then((data) => {
        // jwt = data.data.jwtToken;
		console.log(data.data);
		feed = data.data.feedToken;
		console.log(feed);
		return smart_api.getProfile();
	})
	.then((data) => {
		// Profile details
	})
	.catch((ex) => {
		//Log error
	});

// TO HANDLE SESSION EXPIRY, USERS CAN PROVIDE A CUSTOM FUNCTION AS PARAMETER TO setSessionExpiryHook METHOD
smart_api.setSessionExpiryHook(customSessionHook);

function customSessionHook() {
	console.log('User loggedout');
}


	