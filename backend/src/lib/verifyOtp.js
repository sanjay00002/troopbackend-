require('dotenv').config({ path: './.env' });

// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = require('twilio')(accountSid, authToken);

export async function generateOtp(credential, channel) {
  switch (channel) {
    case 'email':
      return await client.verify.v2
        .services(verifySid)
        .verifications.create({ to: credential, channel: 'email' });
    case 'sms':
      console.log(verifySid)
      return await client.verify.v2
        .services(verifySid)
        .verifications.create({ to: credential, channel: 'sms' });
    default:
      break;
  }
}

export async function verifyOTP(credential, otpCode) {
  console.log(credential)
  return await client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: credential, code: otpCode });
}
