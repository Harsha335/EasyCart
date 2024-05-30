const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    userId: {type: String, required: true},   // one person can insert one comment
    productId: {type: String, required: true},
    rating: {type: Number, min:[1,"Atleast one star"], max:[5,"max 5 stars"], default: 5},
    title: {type: String, required: true},
    comment: {type: String, required: true},
},{timestamps: true});

module.exports = new mongoose.model("Comment", CommentSchema);