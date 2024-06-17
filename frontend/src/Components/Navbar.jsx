import React, { useEffect, useState } from "react";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useSelector } from "react-redux";
import { Badge, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
// import { auth } from "../assets/firebase";

const Navbar = () => {
  // const navigate = useNavigate();

  const { logOut } = useUserAuth();

  const userDetails = useSelector((store) => store.userReducer.userDetails);
  const cartQuantity = useSelector(store => store.cartReducer.quantity);
  // console.log(cartQuantity);
  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.log("error @ Navbar ", err);
    }
  };

  return (
    <div className="bg-[#050458] h-40 md:h-[100%] text-white flex flex-col md:flex-row sticky top-0 z-20">
      <div className="flex-1  font-ubuntu flex items-center justify-between text-[2.2rem] px-[1em] md:px-[5em] ">
        <span>
          Easy<span className="text-orange-600">Cart</span>
        </span>
        <span className="cursor-pointer block md:hidden mx-5">
          <MenuTwoToneIcon />
        </span>
      </div>
      {/* <div className='flex-1 '>Search bar</div> */}
      <div className="w-2/5 flex items-start  flex-col md:items-center md:flex-row md:justify-around ">
        {/* <div> */}
          <Link
          to="/search"
          className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5"
          >
          <SearchIcon/>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
        </Link>
        {/* </div> */}
        <Link
          to="/"
          className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5"
        >
          Home
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
        </Link>
        <Link
          to="/products"
          className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5"
        >
          All products
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
        </Link>
        {userDetails && (
          <Link className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5" to ="/wishList">
            Wish List
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
          </Link>
        )}
        {userDetails && (
          <Link className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5" to ="/orders">
            Orders
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
          </Link>
        )}
        {userDetails && (
          <Link className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5" to="/cart">
            Cart 
            <Badge color="primary" badgeContent={cartQuantity} max={10} >
                  <ShoppingCartTwoToneIcon />
            </Badge>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
          </Link>
        )}
        {userDetails.isAdmin && (
          <span className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5">
            Admin
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
          </span>
        )}
        {userDetails && (
          <span className="group relative ">
            <span className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5">
              <AccountCircleIcon />
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
            </span>
            <span
              className="absolute bg-[#050458] -bottom-14 -left-5 p-2 pt-5 hidden group-hover:block cursor-pointer"
              onClick={handleLogOut}
            >
              signout
            </span>
          </span>
        )}
        {!userDetails && (
          <Link
            className="cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5"
            to="/login"
          >
            Login
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
