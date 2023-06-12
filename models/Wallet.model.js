const mongoose = require("mongoose")
const {Schema} = mongoose;

const WalletSchema = new Schema(
    {
        current_ammount: Number,
        transaction_list: Array,
        profile_id: Number,
        bank_detail_id: Number,
    },{
        timestamps: true,
    }
)

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;