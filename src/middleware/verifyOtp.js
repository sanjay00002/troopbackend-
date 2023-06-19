// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC4e72e1e13baff4b2eed76688dfb1eb4a";
const authToken = "62a7657bed1e45950526ca05d1681d97";
const verifySid = "VA292b9f76ed83e8a53fbdcda21244c54c";
const client = require("twilio")(accountSid, authToken);

export function generateOtp (phoneNumber){
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phoneNumber, channel: "sms" })
      .then((verification) => console.log(verification.status))

}

export function verifyOtp (phoneNumber,otpCode){
    return client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: phoneNumber, code: otpCode })
    .then((verification_check) => {
        console.log(verification_check);
        return verification_check.status;
    })
    
}
