import { Router } from 'express';
import validate from '../middleware/auth';
var encryptionModule = require('../utils/ccavenueutil')
const generateUniqueId = require("generate-unique-id");
import model from '../../../database/models';

const {
	User,
  } = model;


const router = Router();

router.route('/requestHandler').post(validate, (req, res) => {
	const orderId = generateUniqueId();
	const amount = req.body.amount;
    const billing_tel = req.body.billing_tel
    const troop_user_id = req.body.troop_user_id
	if(!troop_user_id){
		res.status(400).send({"message": "No user id sent in the request"})
	}
	console.log(amount);

	const plainText =
		"merchant_id=" +
		String(process.env.CCAVENUE_MERCHANT_ID) +
		"&order_id=" +
		String(orderId) +
		"&redirect_url=" +
		String(process.env.CCAVENUE_REDIRECT_URL) +
		"&cancel_url=" +
		String(process.env.CCAVENUE_CANCEL_URL) +
		"&amount=" +
		String(amount) +
		"&currency=INR" +
		"&language=EN" +
        "&billing_tel=" + String(billing_tel)+
        "&merchant_param1=" + String(troop_user_id)

    console.log(plainText)
	const data = {
		order_id: orderId,
		access_code: process.env.CCAVENUE_ACCESS_CODE,
		redirect_url: process.env.CCAVENUE_REDIRECT_URL,
		cancel_url: process.env.CCAVENUE_CANCEL_URL,
		enc_val: encryptionModule.encrypt(
			plainText,
			process.env.CCAVENUE_WORKING_KEY
		),
	};
    
	res.send(data);
})


router.route('/responseHandler').post(async (req, res)=>{
    const data = encryptionModule.decrypt(req.body.encResp, process.env.CCAVENUE_WORKING_KEY)
    const keyValuePairs = data.split('&');

// Initialize an empty object to store the extracted values
    const extractedData = {};

// Loop through each key-value pair and add it to the object
    keyValuePairs.forEach(pair => {
    const [key, value] = pair.split('=');
    extractedData[key] = value;
    });

// Log the extracted data
    console.log(extractedData);

    console.log("user id is" + String(extractedData.merchant_param1))
	const user = await User.increment({
		appCoins: extractedData.amount
	},{
		where:{
			id: extractedData.merchant_param1
		}
	})
    res.send("You can now close this page")
})



module.exports = router