const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    productId: {type: String, required: true},
    productPrice: {type: Number, default: 0},
    productQuantity: {type: Number, default: 1},    //purchased quanity
    status: {type: String, 
        enum:{
            values: ["add_to_cart","shipping","delivered"],
            message: "{VALUE} is not supported" // check validation on adding 
        },
        default: "add_to_cart"}  // add_to_cart, shipping, delivered
},{timestamps: true});

module.exports = new mongoose.model("Purchase", PurchaseSchema);