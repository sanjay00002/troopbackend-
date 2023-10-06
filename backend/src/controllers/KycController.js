const axios = require('axios');
const crypto = require('crypto');


const baseUrl = 'https://payout-api.cashfree.com';

const baseUrl2 = 'https://api.cashfree.com';

// const baseUrl = 'https://payout-gamma.cashfree.com';


// const baseUrl = 'https://sandbox.cashfree.com/verification';

// function generateSignature(data) {
//   const hmac = crypto.createHmac('sha256', process.env.CASHFREE_API_SECRET );
//   hmac.update(data);
//   return hmac.digest('hex');
// }


// const cfSdk = require('cashfree-sdk');

// const {Payouts} = cfSdk;
// const {Validation} = Payouts;

// const config = {
//     Payouts: {
//         ClientID: "client_id",
//         ClientSecret: "client_secret",
//         ENV: "TEST",
//     }
// };

// (async () => {
//     //init
//     Payouts.Init(config.Payouts);
//     //bank validation
//     try{
//         const response = await Validation.ValidateBankDetails({
//             name: "sameera",
//             phone: "9000000000",
//             bankAccount: "026291800001191",
//             ifsc: "YESB0000262"
//         });
//         console.log("bank validation response");
//         console.log(response);
//     }
//     catch(err){
//         console.log("err caught in bank validation");
//         console.log(err);
//     }
// })();
export default {
  bankverification: async function (req, res) {
    console.log("hello")
    try {
      const { name, phone, bankAccount, ifsc } = req.query;

      // const requestData = JSON.stringify({
      //    name, phone, bankAccount, ifsc 
      //   });

        // const bearertoken = `Bearer ${req.authtoken.data.data.token}`
        // const signature = generateSignature(data);
        const headers = { 
          'Authorization': `Bearer ${req.authtoken.data.data.token}`,
          'Content-Type': 'application/json',
          'X-Client-Id': process.env.CASHFREE_API_KEY,
          'X-Client-Secret': process.env.CASHFREE_API_SECRET,
        };

        // console.log(`Bearer ${req.authtoken.data.data.token}`)
        // console.log(headers)
        // console.log(process.env.CASHFREE_API_KEY)
        // console.log(process.env.CASHFREE_API_SECRET)
        // const authtoken = await axios.post(`${baseUrl}/authorize`, {}, {headers}) 
        // console.log(req.authtoken.data.token)
        // res.json("hello")

     
      const response = await axios.get(`${baseUrl}/payout/v1/asyncValidation/bankDetails?name=${name}&phone=${phone}&bankAccount=${bankAccount}&ifsc=${ifsc}`,{headers:headers});
        
      // console.log(name)
      // console.log(phone)
      // console.log(bankAccount)
      // console.log(ifsc)
      // console.log(response.data);

      const verificationStatus = response.data.status; 
      const message = response.data.message; 

      res.json({ status: verificationStatus, message });
    } 
    catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred during bank verification.' });
    }
  },

  upiverification: async function (req, res) {
    console.log("hello")
    try {
      const { name, vpa} = req.query;

        const headers = { 
          'Authorization': `Bearer ${req.authtoken.data.data.token}`,
          'Content-Type': 'application/json',
          'X-Client-Id': process.env.CASHFREE_API_KEY,
          'X-Client-Secret': process.env.CASHFREE_API_SECRET,
        };

        // console.log(`Bearer ${req.authtoken.data.data.token}`)
        // console.log(headers)

      const response = await axios.get(`${baseUrl2}/payout/v1/validation/upiDetails?name=${name}&vpa=${vpa}`,{headers:headers});
        
      console.log(name)
      console.log(vpa)
      console.log(response.data);

      const verificationStatus = response.data.status; 
      const message = response.data.message; 

      res.json({ status: verificationStatus, message });
    } 
    catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred during UPI verification.' });
    }
  },


  otpaadharverification: async function (req, res){
    try{
      const { aadhaar_number} = req.body;

      const headers = { 
        'Authorization': `Bearer ${req.authtoken.data.data.token}`,
        'Content-Type': 'application/json',
        'X-Client-Id': process.env.CASHFREE_API_KEY,
        'X-Client-Secret': process.env.CASHFREE_API_SECRET,
      };

      console.log(process.env.CASHFREE_API_KEY)
      console.log(process.env.CASHFREE_API_SECRET)

      const requestData = {
        aadhaar_number: aadhaar_number,
      };

      // const response = await axios.post(`${baseUrl2}/verification/offline-aadhaar/otp`,{headers:headers});

      const response = await axios.post(`${baseUrl2}/verification/offline-aadhaar/otp`,requestData,{headers:headers} );

      console.log("hello")
      console.log(response.data.ref_id)

      const refid = response.data.ref_id

      res.json({refid:response.data.ref_id})
    }

    catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred during Aadhar Otp Fetching.' });
    }
  },

  aadharverification: async function (req, res){
    try{
    
      const { otp, refid } = req.body;

      const headers = { 
        'Authorization': `Bearer ${req.authtoken.data.data.token}`,
        'Content-Type': 'application/json',
        'x-client-Id': process.env.CASHFREE_API_KEY,
        'x-client-Secret': process.env.CASHFREE_API_SECRET,
      };

      const requestData = {
        otp: otp,
        ref_id: refid,
      };

      const response = await axios.post(`${baseUrl2}/verification/offline-aadhaar/verify`, requestData,{headers:headers});

      console.log(response)

      // const refid = response.data.ref_id
      res.json(response.data);
    }

    catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred during Aadhar Verification.' });
    }
  },

};
