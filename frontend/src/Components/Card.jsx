import React, { useState } from "react";
// import product1 from "../assets/images/product1.jpg";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import "../index.css"
import {axiosInstance} from "../Api_calls/API";
import { useDispatch, useSelector } from "react-redux";
import { addLikedProduct, removeLikedProduct } from "../redux/reducer/UserSlice";

const Card = ({product}) => {
  // const [liked,setLiked]=useState(false);
  const dispatch = useDispatch();
  const liked = useSelector(store => store.userReducer.userDetails.likedProductIds).includes(product?._id);
  const [hoverCard,setHoverCard]=useState(false);
  // console.log(product);
  const postLiked = async (productId) => {
    // alert(liked);
    try{
      if(liked === false){
        // request to like a comment // --> /api/product/like
        const res = await axiosInstance.post(`/api/product/like`,{productId});
        dispatch(addLikedProduct({productId}));
        console.log(res);
      }else{
        // request to like a comment // --> /api/product/remove-like
        const res = await axiosInstance.post(`/api/product/remove-like`,{productId});
        dispatch(removeLikedProduct({productId}));
        console.log(res);
      }
      // setLiked(!liked);
    }catch(err){
      console.log("ERROR @ Card.jsx : ",err);
    }
  }

  return (
    <div className="w-[250px] rounded-sm cursor-pointer flex items-center justify-center flex-col" 
      onMouseEnter={()=>{setHoverCard(true)}} onMouseLeave={()=>{setHoverCard(false)}} 
    >
      <div className="h-[264px] w-[250px] relative flex items-center justify-center">
          <img
            src={product?.image_url[0]}
            className="h-full  rounded-[10px] relative object-contain"
          ></img>
          <div className="absolute bottom-3 left-3 flex ">
            <Rating
              name="half-rating"
              // defaultValue={4.5}
              precision={0.5}
              readOnly
              value={product?.rating}
            />  
          </div>
          <span className="absolute bottom-3 right-3 cursor-pointer" onClick={()=>{postLiked(product?._id)}}>
            { !liked && <FavoriteTwoToneIcon style={{color:"black"}}  sx={{":hover":{fontSize:"2rem"}}}/> }
            { liked && <FavoriteIcon style={{color:"red"}}  sx={{":hover":{fontSize:"2rem"}}}/> }
            {/* className="transition-hover duration-1000 ease-in-out" */}
          </span>
          {hoverCard && 
            <div className="absolute top-5 right-0 left-0 bottom-5 w-[100%] bg-neutral-700/[0.2] rounded-full ">
               <Link to={`/products/${product?._id}`} className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] border-solid border-2 p-2 bg-orange-600 border-neutral-900 hover:text-[1.08em] text-white">Shop Now</Link>
            </div>
          }

      </div>
      <div className="text-[1rem] line-clamp-2">{product?.title}</div>
    </div>
  );
};

export default Card;
