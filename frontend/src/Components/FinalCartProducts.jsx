import React from 'react'

const FinalCartDisplay = ({products, amount}) => {

  const numberFormatter = (number) => {
    if(!number)
      return 0;
    const formatter = new Intl.NumberFormat('en-IN');
    return formatter.format(number);
  }

  return (
    <div className='flex-1 flex flex-col shadow-2xl p-5'>
      <div className='flex flex-col'>
        <span className='font-semibold text-2xl'>Pay</span>
        <span className='text-3xl'>₹ {numberFormatter(amount)}</span>
      </div>
      <div className='flex flex-col gap-2'>
        {
          products?.map((product) => {
            return (
                <div className='flex flex-row shadow-xl h-28'>
                  <img src={product?.image_url[0]} width="20%" className='object-contain '/>
                  <div className='flex-1 flex flex-col justify-around p-5 '>
                    <div className='flex justify-between '>
                      {/* w-56 text-ellipsis whitespace-nowrap overflow-hidden */}
                      <span className='w-56 font-semibold text-ellipsis whitespace-nowrap overflow-hidden'>{product?.title}</span>
                      <span>₹ {numberFormatter(product?.price*(100-product?.discount)/100)}</span>
                    </div>
                    <div className='flex justify-between '>
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
