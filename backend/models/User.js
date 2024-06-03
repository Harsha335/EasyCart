const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email : {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
        likedProductIds: {type: [String]},    // liked id
        // cartProductIds: {type: {productId : {id: String, count: Number}}},  // add to cart products : TODO
        // purchasedId: {type: [String]} // purchased id
    }
,{timestamps: true});

module.exports = new mongoose.model("User", UserSchema);