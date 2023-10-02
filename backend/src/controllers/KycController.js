
const axios = require('axios');
const crypto = require('crypto');


const baseUrl = 'https://payout-api.cashfree.com/payout/v1';

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

      const requestData = JSON.stringify({
         name, phone, bankAccount, ifsc 
        });
        const bearertoken = `${req.authtoken.data.data.token}`
        // const signature = generateSignature(data);
        const headers = { 
          'Authorization': bearertoken,
          'Content-Type': 'application/json',
          'X-Client-Id': process.env.CASHFREE_API_KEY,
          'X-Client-Secret': process.env.CASHFREE_API_SECRET,
          'ENV': "TEST",
        };
        console.log(bearertoken)
        // console.log(process.env.CASHFREE_API_KEY)
        // console.log(process.env.CASHFREE_API_SECRET)
        // const authtoken = await axios.post(`${baseUrl}/authorize`, {}, {headers}) 
        // console.log(req.authtoken.data.token)
        // res.json("hello")

     
      const response = await axios.get(`${baseUrl}/asyncValidation/bankDetails?name=johndoe&phone=1234567890&bankAccount=26291800001191&ifsc=YESB0000262`, {}, {headers});

      const verificationStatus = response.data.status; 
      const message = response.data.message; 

      res.json({ status: verificationStatus, message });
    } 
    catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred during bank verification.' });
    }
  },
  
};
