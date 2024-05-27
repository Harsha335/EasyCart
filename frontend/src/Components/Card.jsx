import React, { useState } from "react";
import product1 from "../assets/images/product1.jpg";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteIcon from "@mui/icons-material/Favorite";
import GradeIcon from "@mui/icons-material/Grade";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";

const Card = () => {
  const [liked,setLiked]=useState(false);
  const [hoverCard,setHoverCard]=useState(false);
  return (
    <div className="w-[220px] h-[250px] bg-slate-400 rounded-[10px]  relative cursor-pointer " onMouseEnter={()=>{setHoverCard(true)}} onMouseLeave={()=>{setHoverCard(false)}} >
      <img
        src={product1}
        className=" rounded-[10px] relative object-cover w-[100%] h-[100%] "
        alt="shoe product"
      ></img>
      <span className="absolute bottom-3 right-3 cursor-pointer " onClick={()=>{setLiked(!liked)}}>
        { !liked && <FavoriteTwoToneIcon style={{color:"black"}}  sx={{":hover":{fontSize:"2rem"}}}/> }
        { liked && <FavoriteIcon style={{color:"red"}}  sx={{":hover":{fontSize:"2rem"}}}/> }
        {/* className="transition-hover duration-1000 ease-in-out" */}
      </span>
      <div className="absolute bottom-3 left-3 flex ">
        <Rating
          name="half-rating"
          defaultValue={2.5}
          precision={0.5}
          readOnly
          value={4.5}
        />  
      </div>
      <span className="flex items-center justify-center w-full text-[20px] font-bold"><span>Nike shoes</span></span>
      {hoverCard && 
        <div className="absolute top-5 right-0 left-0 bottom-5 w-[100%] bg-neutral-700/[0.2] rounded-full ">
          {/* PLACE A PRODUCT ID */}
           <Link to={`/products/1`} className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] border-solid border-2 p-2 bg-orange-600 border-neutral-900 hover:text-[1.08em] text-white">Shop Now</Link>
        </div>
      }
    </div>
  );
};

export default Card;
