import React, { useState } from 'react';
import { Rating } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/reducer/CartSlice';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const CartCard = ({product}) => {
    const dispatch = useDispatch();
    const numberFormatter = (number) => {
        const formatter = new Intl.NumberFormat('en-IN');
        return formatter.format(number);
    }
    const [addedCount, setAddedCount] = useState(product?.quantityCount);
    const updateCartCount = (count) => {
        if(count >= 1 && count <= product?.quantity){
        setAddedCount(count);
        }
    }
    const postAddedToCart = () => { // send request to update cart (LOCALLY)
        if(addedCount <= 0 || addedCount > product?.quantity){
        alert("invalid cart added");
        return;
        }
        dispatch(addToCart({productId : product?._id, quantity: addedCount}));
        console.log("added to cart ");
    }
    const postRemoveFromCart = () => {
        // console.log("removing ...", product?._id);
        dispatch(removeFromCart({productId : product?._id}));
        setAddedCount(1);
        console.log("removed from cart ");
    }

  return (
    <div className='w-full min-h-64 rounded-md shadow-lg flex flex-col sm:flex-row' key={product?._id}>
        <div className='flex-1 flex items-center justify-center sm:w-64'>
            <img
                src={product?.image_url[0]}
                className="w-64 relative object-contain"
            ></img>
        </div>
        <div className='p-4 flex-1 flex flex-col justify-between'>
            <div className='flex flex-col gap-2 '>
                {/* TODO: NOT WORKING ELLIPSIS */}
                <Link to={`/products/${product?._id}`} className="text-2xl overflow-ellipsis font-rubik mb-1">
                    {product?.title}
                </Link>
                <span className='whitespace-nowrap'>
                    <div className="flex flex-row mb-4">
                        <span className=" font-semibold mr-5 text-xl">
                        ₹ {numberFormatter(product.price * (100 - product.discount) / 100)}{" "}
                        </span>
                        <span className="line-through mr-5"> ₹{numberFormatter(product.price)} </span>
                        <span className="font-semibold"> {product.discount}% off</span>
                    </div>
                </span>
                <span>
                    <Rating
                        name="half-rating"
                        defaultValue={2.5}
                        precision={0.5}
                        readOnly
                        value={product?.rating}
                    />
                </span>
            </div>
            <div className='flex items-center justify-center'>
                {
                    product.quantity > 0 && 
                    <div className="flex flex-row gap-5 sm:gap-2 md:gap-8 p-4 items-center">
                    {/* <div className=""> */}
                        <div className='flex flex-row flex-nowrap items-center'>
                            <span
                            className={`p-1 bg-slate-200 rounded-md ${addedCount === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => {
                                updateCartCount(addedCount - 1);
                            }}
                            >
                            <RemoveIcon />
                            </span>
                            <span className="m-2 md:m-4">{addedCount}</span>
                            <span
                            className={`p-1 bg-slate-200 rounded-md ${addedCount === product.quantity ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => {
                                updateCartCount(addedCount + 1);
                            }}
                            >
                            <AddIcon />
                            </span>
                        </div>
                        <span
                            className="bg-orange-500 p-2 whitespace-nowrap rounded-md cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-in text-white"
                            onClick={() => {
                            postAddedToCart()
                            }}
                        >
                            Update Cart
                        </span>
                        <span
                            className="sm:bg-yellow-500 p-2 whitespace-nowrap rounded-md cursor-pointer hover:text-[1.09em] hover:bg-red-500 transition-all duration-200 ease-in text-white"
                            onClick={() => {
                            postRemoveFromCart()
                            }}
                        >
                            <span className='hidden sm:block'>Remove from Cart</span>
                            <span className='text-red-500 sm:hidden'><DeleteIcon/></span> 
                        </span>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default CartCard
