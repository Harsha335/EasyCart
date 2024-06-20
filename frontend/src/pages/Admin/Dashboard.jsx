import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import AdminNavbar from '../../Components/Admin/AdminNavbar'
import DashboardCard from '../../Components/Admin/DashboardCard'

import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { axiosInstance } from '../../Api_calls/API'
import RevenueChart from '../../Components/Admin/RevenueChart'

const Dashboard = () => {
  
  const [usersCount, setUsersCount] = useState(0);
  const [userDeltaPer, setUserDeltaPer] = useState(0);
  
  const [productsCount, setProductsCount] = useState(0);
  const [productsDeltaPer, setProductsDeltaPer] = useState(0);
  
  const [ordersCount, setOrdersCount] = useState(0);
  const [ordersDeltaPer, setOrdersDeltaPer] = useState(0);
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueDeltaPer, setRevenueDeltaPer] = useState(0);

  useEffect(()=>{
    const getUsersData = async () => {
      const response = await axiosInstance.get("/api/users/userCount");
      // console.log(response);
      setUsersCount(response.data?.usersCount);
      setUserDeltaPer((response.data?.userDeltaPer).toFixed(2));
    }
    const getProductsData = async () => {
      const response = await axiosInstance.get("/api/product/productsCount");
      // console.log(response);
      setProductsCount(response.data?.productsCount);
      setProductsDeltaPer((response.data?.productsDeltaPer).toFixed(2));
    }
    const getOrdersData = async () => {
      const response = await axiosInstance.get("/api/admin/totalOrders");
      // console.log(response);
      setOrdersCount(response.data?.ordersCount);
      setOrdersDeltaPer((response.data?.ordersDeltaPer).toFixed(2));
    }
    const getRevenueData = async () => {
      const response = await axiosInstance.get("/api/admin/totalRevenue");
      // console.log(response);
      setTotalRevenue(response.data?.totalRevenue);
      setRevenueDeltaPer((response.data?.revenueDeltaPer).toFixed(2));
    }
    getUsersData();
    getProductsData();
    getOrdersData();
    getRevenueData();
  },[]);

  const [timeUnit, setTimeUnit] = useState("day");
  const [tooltipTitle, setTooltipTitle] = useState('MMM dd, yyyy');
  const [displayXscale, setDisplayXscale] = useState("MMM dd");

  const [selectedRange, setSelectedRange] = useState('month');
  const putSelectedRange = (value) => {
    setSelectedRange(value);
    if(value === 'month'){
      setTimeUnit("day");
      setTooltipTitle('MMM dd, yyyy');
      setDisplayXscale("MMM dd");
    }else{
      setTimeUnit("month");
      setTooltipTitle('MMM yyyy');
      setDisplayXscale("MMM");
    }
  }

  const [revenue, setRevenue] = useState(null);
  useEffect(()=>{
    const getRevenue = async () => {
      const response = await axiosInstance.get(`/api/admin/revenue/${selectedRange}`);
      console.log(`/api/admin/revenue/${selectedRange} `,response);
      setRevenue(response?.data);
    }
    getRevenue();
  },[selectedRange]);

  return (
    <div className='bg-[#f6f5f5] '>
      <Navbar/>
      <div className='min-h-screen flex flex-row'>
        <AdminNavbar/>
        <div className='flex-1 flex flex-col gap-4 p-4'>
            <div className='flex flex-row flex-wrap gap-5'>
                <DashboardCard title={"New Users"} value={usersCount} delta_per={userDeltaPer} color="indigo" Icon={PeopleIcon}/>
                <DashboardCard title="Products" value={productsCount} delta_per={productsDeltaPer} color="teal" Icon={LocalMallIcon}/>
                <DashboardCard title="Orders" value={ordersCount} delta_per={ordersDeltaPer} color="orange" Icon={ShoppingCartIcon}/>
                <DashboardCard title="Revenue" value={totalRevenue} delta_per={revenueDeltaPer} color="green" Icon={AccountBalanceWalletIcon}/>
            </div>
            <div className='flex-1 flex flex-row gap-4'>
                <div className='flex-1 bg-white rounded-xl drop-shadow-lg p-4 flex flex-col '>
                    <div className='flex flex-row justify-between'>
                      <div className='font-semibold text-2xl'>Revenue</div>
                      <div>
                        <select className='p-1 cursor-pointer' onChange={(e) => putSelectedRange(e.target.value)}>
                          <option value="month">Past 30 days</option>
                          <option value="halfYear">Past 6 months</option>
                          <option value="year">Past 12 months</option>
                        </select>
                      </div>
                    </div>
                    <div className='flex-1 flex items-center justify-center'>
                      {revenue && <RevenueChart revenue={revenue} timeUnit={timeUnit} tooltipTitle={tooltipTitle} displayXscale={displayXscale}/>}
                    </div>
                </div>
                <div className='w-96 bg-white rounded-xl drop-shadow-lg p-4 flex flex-col '>
                    <div className='font-semibold text-2xl'>Top Selling Products</div>
                    {/* <input type='text' className='focus:outline-none border-b-2 border-black w-8'/>  */}
                    <div>
                      
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Dashboard
