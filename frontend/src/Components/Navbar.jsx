import React, {useState } from "react";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { NavLink } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useSelector } from "react-redux";
import { Badge } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ManageProfile from "./ManageProfile";
// import { auth } from "../assets/firebase";

const Navbar = () => {
  // const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { logOut } = useUserAuth();
  const menuAction = () => {
    setMenuOpen(prev => !prev);
  }

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleProfile = () => {
    setIsProfileOpen(prev => !prev);
  }

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
    <div className="bg-[#050458] whitespace-nowrap text-white flex flex-col lg:flex-row sticky top-0 z-20">
      <style>
        {`
          .active{
            color: rgb(249 115 22);
          }
        `}
      </style>

      <div className="relative flex-1  font-ubuntu flex items-center text-[2.2rem] px-[1em] lg:pl-[5em] ">
        <span>
          Easy<span className="text-orange-600">Cart</span>
        </span>
        <span className="absolute right-3 cursor-pointer block lg:hidden mx-5" onClick={() => menuAction()}>
          {
            menuOpen ? <CloseIcon/> : <MenuTwoToneIcon />
          }
        </span>
      </div>

      {/* <div className='flex-1 '>Search bar</div> */}
      <div className={`${menuOpen ? "flex" : "hidden"} relative flex-col gap-5 bg-[#050465] lg:bg-[#050458] lg:flex lg:gap-10 py-5 lg:items-center lg:flex-row lg:justify-around`}>
        {/* <div> */}
        <NavLink
          to="/search"
          className="cursor-pointer group transition duration-300 hover:text-orange-500 w-full flex items-center justify-center lg:w-auto relative"
          >
            <span className="mr-2 lg:hidden">Search </span><SearchIcon/>
            <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
        </NavLink>
        {/* </div> */}
        <NavLink
          to="/"
          className="cursor-pointer group transition duration-300 hover:text-orange-500 w-full flex items-center justify-center lg:w-auto relative"
        >
          Home
          <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
        </NavLink>

        <NavLink
          to="/products"
          className="cursor-pointer group transition duration-300 hover:text-orange-500 w-full flex items-center justify-center lg:w-auto relative"
        >
          All products
          <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
        </NavLink>
          <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500  w-full flex items-center justify-center lg:w-auto relative" to ="/wishList">
            Wish List
            <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
          </NavLink>
          <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500 w-full flex items-center justify-center lg:w-auto relative" to ="/orders">
            Orders
            <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
          </NavLink>
          <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500 w-full flex items-center justify-center lg:w-auto relative" to="/cart">
            Cart 
            <Badge color="primary" badgeContent={cartQuantity} max={10} >
                  <ShoppingCartTwoToneIcon />
            </Badge>
            <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
          </NavLink>
        {userDetails.isAdmin && (
          <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500 w-full flex items-center justify-center lg:w-auto relative" to="/admin/dashboard">
            Admin
            <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
          </NavLink>
        )}

        {/*   LINE DIVIDER   */}
        <div className='bg-gradient-to-r from-transparent via-gray-500 to-transparent h-[2px] w-full lg:hidden'></div>

          <span className="group">
            <span className="hidden cursor-pointer group transition duration-300 hover:text-orange-500 w-full lg:flex items-center justify-center lg:w-auto relative">
              <AccountCircleIcon />
              <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
            </span>
            <div
              className=" flex items-center justify-around lg:absolute lg:bg-[#050458] lg:p-2 lg:w-24 lg:right-0 lg:hidden lg:group-hover:block cursor-pointer "
            >
              <div onClick={handleProfile} className="hover:text-orange-500">Profile</div>
              <div onClick={handleLogOut} className="hover:text-orange-500">Sign out</div>
            </div>
          </span>
      </div>
        {isProfileOpen && <ManageProfile handleProfile={handleProfile}/>}
    </div>
  );
};

export default Navbar;
