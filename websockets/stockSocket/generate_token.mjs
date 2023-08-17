import { SmartAPI, WebSocket } from "smartapi-javascript";
// const { SmartAPI } = require("smartapi-javascript");

// require("dotenv").config();
import { config } from "dotenv";
config();

let refreshToken = null,
  jwtToken = null;

const smart_api = new SmartAPI({
  api_key: process.env.SMARTAPI_API_KEY, // PROVIDE YOUR API KEY HERE
  // OPTIONAL : If user has valid access token and refresh token then it can be directly passed to the constructor.
  access_token: process.env.SMARTAPI_JWT ?? jwtToken,
  refresh_token: process.env.SMARTAPI_REFRESH_TOKEN ?? refreshToken,
});

// If user does not have valid access token and refresh token then use generateSession method
// let feed = '';
const client_id = process.env.SMARTAPI_CLIENT_CODE;
const client_password = process.env.SMARTAPI_CLIENT_PASSWORD;
smart_api
  .generateSession(client_id, client_password, "175358")
  .then((data) => {
    // jwt = data.data.jwtToken;
    console.log("Tokens: ", data.data);
    // feed = data.data.feedToken;
    return smart_api.getProfile();
  })
  .catch((error) => {
    console.log("Error in generating the session: ", error);
  })
  .then((data) => {
    // Profile details
  })
  .catch((ex) => {
    //Log error
    console.error("Error: ", ex);
  });

// TO HANDLE SESSION EXPIRY, USERS CAN PROVIDE A CUSTOM FUNCTION AS PARAMETER TO setSessionExpiryHook METHOD
smart_api.setSessionExpiryHook(customSessionHook);

function customSessionHook() {
  // * Either the Access token expired or its an invalid token
  // * https://smartapi.angelbroking.com/docs/Exceptions
  // * https://smartapi.angelbroking.com/docs/User#Generate

  smart_api.generateToken(smart_api.refresh_token);
  smart_api.console.log("Refreshed Tokens");
  // console.log('User loggedout');
}
