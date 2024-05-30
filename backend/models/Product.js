const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    image_url: {type: [String], required: true},
    categoryId: {type: String, required: true},    //Category id
    features: {type: [{key: String, value: String}]},
    description: {type: String, required: true},
    quantity: {type: Number, default: 0},
    price: {type: Number, default: 0},
    discount: {type: Number, default: 0},
    tags: {type: [String], require: true},
    rating: {type: Number, default: 0.0},   //average rating of a product
    //commentsId: {type: [String]}    // comments id
},{timestamps: true});

module.exports = new mongoose.model("Product", ProductSchema);