import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AdminNavbar = () => {
  const [adminNavOpen, setAdminNavOpen] = useState(false);
  const menuAction = () => {
    setAdminNavOpen(prev => !prev);
  }
  return (
    <div className='relative w-full lg:w-96 flex items-center justify-center'>
      <div className='w-full lg:w-72 h-[80%] rounded-2xl drop-shadow-xl bg-white'>
        <span className='font-semibold text-3xl flex items-center justify-center p-4'>Admin</span>

        {/*   LINE DIVIDER   */}
        <span className="absolute right-1 top-4 cursor-pointer block lg:hidden mx-5" onClick={() => menuAction()}>
          {
            adminNavOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon />
          }
        </span>
          <div className={`${adminNavOpen ? "flex": "hidden"} lg:flex bg-gradient-to-r from-transparent via-gray-500 to-transparent h-[2px] w-full`}></div>
          <nav className={`${adminNavOpen ? "flex": "hidden"} lg:flex flex-col text-lg gap-6 font-medium p-10 whitespace-nowrap`}>
              <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500 w-auto relative" to="/admin/dashboard">
                  Dashboard
                  <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
              </NavLink>
              <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500 w-auto relative" to="/admin/users">
                  Users Management
                  <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
              </NavLink>
              <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500 w-auto relative" to="/admin/add-product">
                  Add Product
                  <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
              </NavLink>
              <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500 w-auto relative" to="/admin/products">
                  Products Management
                  <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
              </NavLink>
              <NavLink className="cursor-pointer group transition duration-300 hover:text-orange-500 w-auto relative" to="/admin/orders">
                  Orders Management
                  <span className="block absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-500 group-hover:w-full"></span>
              </NavLink>
          </nav>
      </div>
    </div>
  )
}

export default AdminNavbar
