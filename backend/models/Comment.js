const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},   // one person can insert one comment
    rating: {type: Number, min:[1,"Atleast one star"], max:[5,"max 5 stars"], default: 5},
    comment: {type: String, required: true}
},{timestamps: true});

module.exports = new mongoose.model("Comment", CommentSchema);