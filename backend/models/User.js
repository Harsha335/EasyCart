const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email : {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
        likedProductId: {type: [String]},    // liked id
        // purchasedId: {type: [String]} // purchased id
    }
,{timestamps: true});

module.exports = new mongoose.model("User", UserSchema);