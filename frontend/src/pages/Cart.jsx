import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../Api_calls/API';
import CartCard from '../Components/CartCard';
import noItemImg from '../assets/images/no-item-in-cart.gif';
import { Link } from 'react-router-dom';
import { numberFormatter } from '../assets/formatter';

const Cart = () => {

    const cartProducts = useSelector(store => store.cartReducer.cartItems);
    console.log("cartProducts : ",cartProducts);
    const [productDetails, setProductDetails] = useState([]);
    useEffect(() => {
        const getData = async () => {
            try{
                const promise = cartProducts.map((product) => {
                    return axiosInstance.get(`/api/product/${product.productId}`);
                });
                const response = await Promise.all(promise);
                // const data = response.map(res => res.data?.product);
                // Map the responses to include quantity
                const data = response.map((res, index) => {
                    return {
                        ...res.data?.product, // Spread the product details
                        quantityCount: cartProducts[index].quantity // Add the quantity from cartProducts
                    };
                    });
                setProductDetails(data);
            }catch(err){
                console.log("Error @cart : ",err);
            }
        }
        getData();
        console.log(productDetails);
    },[cartProducts]);

    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [shippingPice, setShippingPrice] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    useEffect(() => {
        let currPrice = 0;
        let currDiscount = 0;
        productDetails.forEach(product => {
            currPrice += product.quantityCount * product.price;
            currDiscount += product.quantityCount * (product.discount*product.price)/100;
        });
        setPrice(currPrice);
        setDiscount(currDiscount);
        let currShippingPice = currPrice + currDiscount > 1000 ? 0 : 250;
        setShippingPrice(currShippingPice);
        setGrandTotal(currPrice - currDiscount + currShippingPice);
    },[productDetails]);

    if(cartProducts.length !== 0 && productDetails === 0){
        return (<div>Loading...</div>);
    }
    return (
    <>
      <Navbar/>
      <div className='min-h-screen overflow-auto'>
        <div className="text-3xl font-semibold font-PlayfairDisplay flex items-center justify-center shadow-lg p-3 mb-2">
          <span>Cart <ShoppingCartIcon sx={{fontSize:"2rem"}}/></span>
        </div>
        {
            productDetails.length !== 0 ? 
            <div className='flex flex-col lg:flex-row items-center lg:items-start justify-center md:px-16 md:py-4 gap-16'>
                {/* product list */}
                <div className='flex flex-col flex-1 gap-5 '>
                    {
                        productDetails.map((product) => {
                            return (<CartCard product={product}/>)
                        })
                    }
                </div>
                {/* order summary */}
                <div className='whitespace-nowrap w-96 h-96 rounded-lg shadow-lg flex flex-col p-5 font-ubuntu text-xl gap-4'>
                    <span>
                        <span className='font-ubuntu text-3xl flex items-center justify-center'>ORDER SUMMARY</span>
                        <div style={{ borderTop: "2px solid #000000 ", marginLeft: 20, marginRight: 20 }}></div>
                    </span>
                    <span className='flex justify-between'>
                        <span>Price</span>
                        <span>₹ {numberFormatter(price)}</span>
                    </span>
                    <span className='flex justify-between'>
                        <span>Discount</span>
                        <span>₹ {numberFormatter(discount)}</span>
                    </span>
                    <span className='flex justify-between'>
                        <span>Shipping Price </span>
                        {
                            shippingPice === 0 ? 
                            <span className='text-green-600'>Free</span>   :
                            <span>₹ {numberFormatter(shippingPice)}</span>
                        }
                    </span>
                    <span className='flex justify-between mt-5 font-semibold'>
                        <span>Total </span>
                        <span>₹ {numberFormatter(grandTotal)}</span>
                    </span>
                    <div className='flex items-center justify-center'>
                        <Link to='/cart/stripe-payment' state = {{products : productDetails, amount : grandTotal}} className='bg-orange-600 w-full text-white flex items-center justify-center p-2 cursor-pointer'>Place order</Link>
                    </div>
                </div>
            </div>
            :
            <div className='flex items-center justify-center'>
                <span>
                    <img src={noItemImg}/>
                    <div className='flex items-center justify-center m-4'>
                        <Link to="/products" className='border-solid border-2 border-black p-2 bg-orange-600 text-white cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-out '>Explore All categories</Link> 
                    </div>
                </span>
            </div>
        }
      </div>
      <Footer/>
    </>
  )
}

export default Cart
