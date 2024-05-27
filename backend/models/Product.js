const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    image_url: {type: [String], required: true},
    categoryId: {type: String, required: true},    //Category id
    features: {type: Map, of: String},
    desciption: {type: String, required: true},
    quantity: {type: Number, default: 0},
    price: {type: Number, default: 0},
    discount: {type: Number, default: 0},
    commentsId: {type: [String]}    // comments id
},{timestamps: true});

module.exports = new mongoose.model("Product", ProductSchema);