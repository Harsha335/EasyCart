const mongoose = require("mongoose");

const addressType = new mongoose.Schema({
    receiver_name : {type: String},
    address : {type: String},
    state: {type: String},
    country: {type: String},
    pin_code: {type: String, minLength: 6, maxLength: 6},
    phone_number: {type: Number, minLength: 10, maxLength: 10},
}, { _id: false });

const UserSchema = new mongoose.Schema(
    {
        user_name: {type: String},
        email : {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
        likedProductIds: {type: [String]},    // liked id
        address: {type: addressType},
        // cartProductIds: {type: {productId : {id: String, count: Number}}},  // add to cart products : TODO
        // purchasedId: {type: [String]} // purchased id
    }
,{timestamps: true});

module.exports = new mongoose.model("User", UserSchema);