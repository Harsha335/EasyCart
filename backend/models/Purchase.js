const mongoose = require("mongoose");

const productType = new mongoose.Schema({
    id: { type: String, required: true },
    title: {type: String, required: true},
    quantity_purchased: { type: Number, required: true },
    unit_price : { type: Number, required: true },  // price per product
    image_url: {type: String}   // product's main(1st) image URL
}, { _id: false });
const addressType = new mongoose.Schema({
    receiver_name : {type: String},
    address : {type: String},
    state: {type: String},
    country: {type: String},
    pin_code: {type: String, minLength: 6, maxLength: 6},
    phone_number: {type: Number, minLength: 10, maxLength: 10},
}, { _id: false });

const PurchaseSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    products: {type: [productType], required: true},
    payment_status: {
        type: String,
        enum: {
            values: ["success", "failed"],
            message: `{VALUE} is not supported`
        },
        default: "failed"
    },
    stripePaymentId : {type: String, required: true},
    amount: {type: Number, required: true}, // total paid amount
    status: {   //payment fails - abort, success - confirm, shipping, delivered
        type: String, 
        enum:{
            values: ["abort","confirm","shipping","delivered"],
            message: `{VALUE} is not supported` // check validation on adding 
        },
        default: "abort"
    },
    address : {type : addressType, required: true},
    deliveryAt : {type: Date}
},{timestamps: true});

module.exports = new mongoose.model("Purchase", PurchaseSchema);