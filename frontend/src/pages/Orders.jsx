import React, { useEffect, useState } from 'react'
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { axiosInstance } from '../Api_calls/API';
import no_orders_img from "../assets/images/no_orders.jpg"
import { getDate, numberFormatter } from '../assets/formatter';
import OrderPopup from '../Components/OrderPopup';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(()=> {
    const getOrders = async () => {
      try{
        const res = await axiosInstance.get("/api/users/orders");
        console.log("Orders : ", res);
        setOrders(res.data?.orders);
      }catch(err){
        console.log("Error at orders page ");
      }
    }
    getOrders();
  },[]);

  const [orderPopupItem, setOrderPopupItem] = useState(null);
  const OrderPopupActivate = (order) => {
    setOrderPopupItem(order);
  }
  return (
    <div>
      <style>
        {`
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }

          td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 1rem;
          }

          tr:nth-child(even) {
            background-color: #dddddd;
          }
        `}
      </style>
      <Navbar/>
      <div className='min-h-screen'>
        <div className='font-bold text-3xl p-4'>Your Orders</div>
        <div>
          {
            orders?.length === 0 ?
            <div className='w-full h-full flex items-center justify-center'><img src={no_orders_img} width={"40%"} alt='no orders placed'/></div>
            :
            <div className='relative'>
            <table className='w-full'>
              <tr>
                <th>Order Id</th>
                <th>Order Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Date</th>
              </tr>
              {
                orders.map(order => {
                  return (
                    <tr className='cursor-pointer' onClick={() => OrderPopupActivate(order)}>
                      <td>{order?._id}</td>
                      <td>₹ {numberFormatter(order?.amount)}</td>
                      <td>{order?.payment_status}</td>
                      <td>{order?.status}</td>
                      <td>{getDate(new Date(order?.createdAt))}</td>
                    </tr>
                  )
                })
              }
            </table>
            {orderPopupItem && <OrderPopup order={orderPopupItem} setOrderPopupItem={setOrderPopupItem}/>}
            <div className='p-4'>{orders.length} item(s)</div>
            </div>
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Orders;
