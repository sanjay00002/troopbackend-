import { post } from 'axios';

const baseUrl = 'https://payout-api.cashfree.com';

// const baseUrl = 'https://payout-gamma.cashfree.com';


// const baseUrl = 'https://sandbox.cashfree.com';

export default async function getcashfreetoken(req, res, next) {

const headers = { 
    'Content-Type': 'application/json',
    'X-Client-Secret': process.env.CASHFREE_API_SECRET,
    'X-Client-Id': process.env.CASHFREE_API_KEY,
  };

//   console.log(process.env.CASHFREE_API_KEY)
//   console.log(process.env.CASHFREE_API_SECRET)
try {
  const authtoken = await post(`${baseUrl}/payout/v1/authorize`, {}, {headers}) 
  console.log(authtoken.data)
  req.authtoken = authtoken
  next()
}
  catch (error) {
    console.error('Error:', error.message);
    console.log(error)
    res.status(500).json({ error: 'An error occurred while fetching the Cashfree token.',errortoken: error });
  }
}
