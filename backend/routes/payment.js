const express = require("express");
const Purchase = require("../models/Purchase");
const Product = require('../models/Product');
const { default: mongoose } = require("mongoose");
const { verifyTokenAndAuthorization } = require("./verifyToken");
const router = express();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {products} = req.body;
        let amount = 0;
        // Create a formatted string of product details for metadata
        const productDetailsArray = await Promise.all(products.map(async item => {
            const product = await Product.findById(item.id);
            amount += product.price*((100- product.discount)/100)*item.quantityCount;
            return `ID: ${item.id}, Quantity: ${item.quantityCount}, Price: ${product.price*((100- product.discount)/100)}`;
        }));
        const productDetails = productDetailsArray.join("; ");
    
        // Calculate the total amount
        // const amount = products.reduce((total, product) => {
        //     return total + (product.price * product.quantity);
        // }, 0);
  
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // amount in the smallest currency unit (e.g., paise for INR)
            currency: 'inr',
            metadata: {
                product_details: productDetails, // save product details in stripe
            },
            automatic_payment_methods : {
                enabled : true,
            },
        });
        res.status(200).json({clientSecret : paymentIntent.client_secret});
    }catch(err){
        console.log("Error @ create-payment-intent : ", err);
        res.status(500).json({status: false, error: err});
    }
});

// GET PAYMENT INTENT DETAILS BY ID
const getPaymentIntentDetails = async (id) => {
    try{
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        return paymentIntent;
    }catch(err){
        console.log("Error @ get payment-intent details : ", err);
        return null;
    }
};

// SAVE PAYMENT DETAILS IN DATABASE
router.post("/save", verifyTokenAndAuthorization, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { paymentIntentId, products, address } = req.body;
        // console.log("--------------------- payment save in db -------------");
        // console.log(userId,{ paymentIntentId, products, address });
        const productDetails = await Promise.all(products.map(async item => {
            const product = await Product.findById(item.id);
            //  DECREASING PRODUCT COUNT
            product.quantity -= item.quantityCount;
            product.save();
            //console.log("product getting : ", product);
            return ({id: item.id, title: item.title, quantity_purchased: item.quantityCount, unit_price: product.price*((100- product.discount)/100), image_url: item?.image_url});
        }));
        // console.log("productDetails : ",productDetails);
        const paymentIntent = await getPaymentIntentDetails(paymentIntentId);
        // console.log("paymentIntent : ",paymentIntent);
        let payment_status = "failed";
        let status = "abort";
        if(paymentIntent?.status === "succeeded"){
            payment_status = "success";
            status = "confirm";
        }
        // console.log("paymentIntent ", paymentIntent);
        const amount = paymentIntent?.amount/100;   // converting into rupees
        // Store products and address in the database
        const newOrder = new Purchase({
            userId,
            products: productDetails,
            payment_status,
            stripePaymentId: paymentIntentId,
            amount,
            status,
            address,
        });
        // console.log("Purchasing : ", newOrder);
        await newOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ status: true, message: "Payment and order stored successfully!" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.log("ERROR @ Payment save in db : ", err);
        res.status(500).json({ status: false, error: err });
    }
});


module.exports = router;