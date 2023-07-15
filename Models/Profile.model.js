const mongoose = require("mongoose")
const {Schema} = mongoose;


const ProfileSchema = new Schema(
    {
        ref: 'User'
    },{
        timestamps: true,
    }
)

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;