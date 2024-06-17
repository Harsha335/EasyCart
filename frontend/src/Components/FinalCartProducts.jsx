import React from 'react'
import { numberFormatter } from '../assets/formatter';

const FinalCartDisplay = ({products, amount}) => {

  return (
    <div className='w-full lg:flex-1 whitespace-nowrap flex flex-col shadow-2xl p-5'>
      <div className='font-semibold text-3xl flex items-center justify-center flex-col'>
        Order details
        <div className='bg-gradient-to-r from-transparent via-gray-500 to-transparent h-[2px] w-full'></div>
      </div>
      <div className='flex flex-col'>
        <span className='font-semibold text-xl'>Pay</span>
        <span className='text-3xl'>₹ {numberFormatter(amount)}</span>
      </div>
      <div className='flex flex-col gap-2'>
        {
          products?.map((product) => {
            return (
                <div className='flex flex-row shadow-xl min-h-28'>
                  <img src={product?.image_url[0]} width="20%" className='object-contain '/>
                  <div className='flex-1 flex flex-col justify-around p-5 '>
                    <div className='flex justify-between flex-wrap'>
                      {/* w-56 text-ellipsis whitespace-nowrap overflow-hidden */}
                      <span className='w-56 font-semibold text-ellipsis whitespace-nowrap overflow-hidden'>{product?.title}</span>
                      <span>₹ {numberFormatter(product?.price*(100-product?.discount)/100)}</span>
                    </div>
                    <div className='flex justify-between flex-col md:flex-row'>
                      <span>Qty {product?.quantityCount}</span>
                      <span className='text-xl'>₹ {numberFormatter(product?.price*((100-product?.discount)/100)*product?.quantityCount)}</span>
                    </div>
                  </div>
                </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default FinalCartDisplay;
