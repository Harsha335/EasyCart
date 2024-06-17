import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { numberFormatter } from '../assets/formatter';

const OrderPopup = ({order,setOrderPopupItem}) => {
  const closePopup = () => {
    setOrderPopupItem(null);
  }
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.2)] flex items-center justify-center'>
        <div className='w-[35rem] max-h-[75%] overflow-auto bg-white relative rounded-lg p-3'>
            <span className='absolute top-2 right-2 cursor-pointer hover:bg-slate-200 rounded-full p-1' onClick={()=>closePopup()}><CloseIcon/></span>
            <div>
                <div className='font-semibold text-xl px-4 py-2 flex items-center justify-center'>Order Summary</div>
                <div className='bg-gradient-to-r from-transparent via-gray-500 to-transparent h-[1px] w-full'></div>
            </div>
            <div className='flex flex-col gap-3 p-2'>
                <div className='flex flex-col'>
                    <span className='font-semibold'>Order ID</span>
                    <span className='ml-4'>{order._id}</span>
                </div>
                <div className='flex flex-col'>
                    <span className='font-semibold'>Order Date</span>
                    <span className='ml-4'>{`${(new Date(order?.createdAt))}`}</span>
                </div>
                <div className='flex flex-col'>
                    <span className='font-semibold'>Delivery Address</span>
                    <div className='ml-4 flex flex-col'>
                        <span className='flex flex-row'>
                            <div className='font-medium w-32'>Receiver name </div>
                            <span>: {order?.address?.receiver_name}</span>
                        </span>
                        <span className='flex flex-row'>
                            <div className='font-medium w-32'>Address </div>
                            <span>: {order?.address?.address}</span>
                        </span>
                        <span className='flex flex-row'>
                            <div className='font-medium w-32'>State </div>
                            <span>: {order?.address?.state}</span>
                        </span>
                        <span className='flex flex-row'>
                            <div className='font-medium w-32'>Country </div>
                            <span>: {order?.address?.country}</span>
                        </span>
                        <span className='flex flex-row'>
                            <div className='font-medium w-32'>Pin code </div>
                            <span>: {order?.address?.pin_code}</span>
                        </span>
                        <span className='flex flex-row'>
                            <div className='font-medium w-32'>Phone number </div>
                            <span>: {order?.address?.phone_number}</span>
                        </span>
                    </div>
                </div>
                <div>
                    <span className='font-semibold'>Products</span>
                    {
                        order.products.map((product)=> {
                            return (
                                <div className='flex flex-row shadow-xl h-28 w-96' key={product.id}>
                                <img src={product?.image_url} width="20%" className='object-contain '/>
                                <div className='flex-1 flex flex-col justify-around p-5 '>
                                    <div className='flex justify-between '>
                                    <span className='max-w-56 font-semibold text-ellipsis whitespace-nowrap overflow-hidden'>{product?.title}</span>
                                    <span>₹ {numberFormatter(product?.unit_price)}</span>
                                    </div>
                                    <div className='flex justify-between '>
                                    <span>Qty {product?.quantity_purchased}</span>
                                    <span className='text-xl'>₹ {numberFormatter(product?.unit_price*product?.quantity_purchased)}</span>
                                    </div>
                                </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='flex flex-col'>
                    <span className='font-semibold'>Total</span>
                    <span className='ml-4'>₹ {numberFormatter(order?.amount)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OrderPopup
