import React, { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { axiosInstance } from "../Api_calls/API";
import { useDispatch } from "react-redux";
import { removeAll } from "../redux/reducer/CartSlice";
import { useNavigate } from "react-router-dom";

const PAYMENT_SUCCESS_URL = "http://localhost:3000/cart/stripe-payment/transaction-success";    // not required

const CheckoutForm = ({ address, products}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();
 
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
 
        setIsLoading(true);
        setMessage("Payment in Progress");
 
        const {error, paymentIntent} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: PAYMENT_SUCCESS_URL,
            },
            redirect: "if_required",
        });
        // alert("comming..");
        if (error){
            setMessage(error?.message);
            console.log("ERROR at checkout form : ", error.message);
        }
        // else if(paymentIntent && paymentIntent.status === "succeeded"){
        //     // Store address and products in the database
        //     const response = await axiosInstance.post("/api/payment/save", {
        //         paymentIntentId: paymentIntent.id,
        //         products,
        //         address,
        //         payment_status: "success"
        //     });
        //     console.log("Transaction saved in db !!", response);
        //     // setMessage("Payment status: " + paymentIntent.status+"🎉");
        // }
        // else{
        //     const response = await axiosInstance.post("/api/payment/save", {
        //         paymentIntentId: paymentIntent.id,
        //         products,
        //         address,
        //         payment_status: "failed"
        //     });
        //     console.log("Transaction saved in db !!", response);
        //     // setMessage("Unexpected state !!");
        // }
        else{
            const response = await axiosInstance.post("/api/payment/save", {
                paymentIntentId: paymentIntent.id,
                products,
                address
            });
            console.log("Transaction saved in db !!", response);
            setMessage("Transactions successful !!");
            dispatch(removeAll());
            navigate("/cart/stripe-payment/transaction-success");
        }
        setIsLoading(false);
    };

  return (
    <div className="w-full lg:flex-1 ">
        <form onSubmit={handleSubmit}>
            <div className="card w-100 bg-base-100 bg-slate-50 shadow-2xl rounded-lg">
                <div className="card-body p-6">
                    <h1 className="card-title font-bold text-2xl mb-4 justify-center">
                        Complete your payment here!
                    </h1>
                    <PaymentElement />
                    <div className="card-actions justify-center">
                        <button
                            className="bg-orange-500 rounded-xl text-white px-4 py-2 mt-6"
                            disabled={isLoading || !stripe || !elements}
                        >
                            {isLoading ? "Loading..." : "Pay now"}
                        </button>
                    </div>
                    {message && <div>{message}</div>}
                </div>
            </div>
        </form>
    </div>
  )
}

export default CheckoutForm
