const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    productId: {type: [String]} // list of product ids of this category
});

module.exports = new mongoose.model("Category", CategorySchema);