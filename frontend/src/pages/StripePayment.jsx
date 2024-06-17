import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import {loadStripe} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { axiosInstance } from '../Api_calls/API';
import CheckoutForm from '../Components/CheckoutForm';
import FinalCartDisplay from '../Components/FinalCartProducts';
import AddressForm from '../Components/AddressForm';
import { useLocation } from 'react-router-dom';

const StripePayment = () => {
    const location = useLocation();
    const {products, amount} = location.state || {};
    console.log(products, amount);
    const [productDetails, setProductDetails] = useState([]);
    const stripe = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(()=> {
        const getClientSecret = async () => {
            try{
                const productDetails = products.map(product => {
                    return { 
                        id: product?._id, 
                        quantityCount: product?.quantityCount,
                        title: product?.title,
                        image_url: product?.image_url[0],
                    };
                });
                setProductDetails(productDetails);
                // console.log("products data: ", data);
                const res = await axiosInstance.post("/api/payment/create-payment-intent", {products : productDetails});
                console.log(res);
                setClientSecret(res.data.clientSecret);
            }catch(err){
                console.log("ERROR @ StripePayment ; ")
            }
        }
        getClientSecret();
    },[products]);

    const [address, setAddress] = useState({
        receiver_name: "",
        address: "",
        state: "",
        country: "",
        pin_code: "",
        phone_number: "",
      });

    return (
        <>
            <Navbar/>
            <div className='flex flex-col p-4 lg:p-0 lg:flex-row gap-16 min-h-screen items-start'>
                <FinalCartDisplay products={products} amount={amount}/>
                <AddressForm address={address} setAddress={setAddress}/>
                {stripe && clientSecret && productDetails &&
                    <Elements stripe={stripe} options={{clientSecret}}>
                        <CheckoutForm  address={address} products={productDetails}/>
                    </Elements>
                }
            </div>
            <Footer/>
        </>
    )
}

export default StripePayment
