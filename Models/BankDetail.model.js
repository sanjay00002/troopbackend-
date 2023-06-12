const mongoose = require("mongoose")
const {Schema} = mongoose;

const BankDetailSchema = new Schema(
    {
        account_number: Number,
        account_holder: String,
        ifsc_code: String,
        wallet_id: String, 
    },{
        timestamps: true,
    }
)

const BankDetail = mongoose.model("BankDetail", BankDetailSchema);

module.exports = BankDetail;