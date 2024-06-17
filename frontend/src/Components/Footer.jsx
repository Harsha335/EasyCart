import React from 'react'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link, NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='bg-[#0b0a30] w-full flex flex-col gap-2 text-white overflow-auto'>
        <div>
          <div className='flex flex-row justify-between px-[1rem]'>
            <div className="font-ubuntu text-[1.9rem] ">
                <span>Easy<span className="text-orange-600">Cart</span></span>
            </div>
            <div className="font-ubuntu p-2 flex flex-row gap-4">
                <div>Follows on : </div>
                <div><Link to="https://github.com/Harsha335"><GitHubIcon/></Link></div>
                <div><Link to="https://www.linkedin.com/in/harshavardhan-asadi-b71898220/"><LinkedInIcon/></Link></div>
            </div>
          </div>
            <div className="flex flex-col justify-center items-center md:flex-row gap-2 md:gap-4 font-ubuntu">
                <NavLink to="/" className="cursor-pointer group text-white hover:text-orange-600 transition duration-300">
                  Home
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
                </NavLink>
                <NavLink to="/products" className="cursor-pointer group hover:text-orange-600 transition duration-300">
                  All products
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
                </NavLink>
            </div>
        </div>
      <div className='flex justify-center'><span>©Copyright Reserved 2023</span></div>
    </div>
  )
}

export default Footer
