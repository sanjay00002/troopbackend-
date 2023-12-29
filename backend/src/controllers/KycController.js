const axios = require('axios');
const crypto = require('crypto');

const baseUrl = 'https://payout-api.cashfree.com';

const baseUrl2 = 'https://api.cashfree.com';

export default {
  bankverification: async function (req, res) {
    console.log("hello")
    try {
      const { name, phone, bankAccount, ifsc } = req.query;

        const headers = { 
          'Authorization': `Bearer ${req.authtoken.data.data.token}`,
          'Content-Type': 'application/json',
          'X-Client-Id': process.env.CASHFREE_API_KEY,
          'X-Client-Secret': process.env.CASHFREE_API_SECRET,
        };
     
      const response = await axios.get(`${baseUrl}/payout/v1/asyncValidation/bankDetails?name=${name}&phone=${phone}&bankAccount=${bankAccount}&ifsc=${ifsc}`,{headers:headers});
        


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

      const response = await axios.post(`${baseUrl2}/verification/offline-aadhaar/otp`,requestData,{headers:headers} );

      console.log("hello")
      console.log(response.data.ref_id)

      const refid = response.data.ref_id

      res.json({refid:response.data.ref_id})
    }

    catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      console.log(error)
      res.status(500).json({ error: 'An error occurred during Aadhar Otp Fetching.',errorotp:error });
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

      res.json(response.data);
    }

    catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      console.log(error)
      res.status(500).json({ error: 'An error occurred during Aadhar Verification.',erroraadharverify:error});
    }
  },
  panverification: async function (req, res){
    try{
    
      const { verification_id } = req.body;

      const headers = { 
        'Authorization': `Bearer ${req.authtoken.data.data.token}`,
        'Content-Type': 'multipart/form-data',
        'x-client-Id': process.env.CASHFREE_API_KEY,
        'x-client-Secret': process.env.CASHFREE_API_SECRET,
      };

      const requestData = {
        front_image: req.file.buffer,
        verification_id: verification_id,
      };
      console.log(res.json(req.file.buffer))
      const response = await axios.post(`${baseUrl2}/verification/document/pan`, requestData,{headers:headers});

      console.log(response)

      res.json(response.data);
    }

    catch (error) {
      console.log(error)
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred during Pan Verification.' });
    }
  },
};
