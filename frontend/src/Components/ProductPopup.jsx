import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { numberFormatter } from '../assets/formatter';
import { Rating } from "@mui/material";
import { axiosInstance } from '../Api_calls/API';

const ProductPopup = ({product,categories,setProductPopupItem,setProducts}) => {
  const closePopup = () => {
    setProductPopupItem(null);
  }

  const [productDetails, setProductDetails] = useState({
    "title": product?.title,
    "categoryId": product?.categoryId,
    quantity: product?.quantity,
    price: product?.price,
    discount: product?.discount,
  });

  const [editEnabled, setEditEnabled] = useState(false);
  const actionOnChange = (key, value) => {
    setProductDetails(prev => ({...prev, [key]: value}));
  }
  const saveAction = async (e, id) => {
    e.preventDefault();
    console.log("saving.. ", productDetails);
    try{
        const response = await axiosInstance.put(`/api/product/${product._id}`, productDetails);
        console.log("Response on product update: ", response);
        setProducts(products => products.map(product =>{
            return product._id === id ? {...product, ...productDetails, "categoryTitle": categories[productDetails.categoryId]} : product
        }));
        setProductDetails(response.data.product);
    }catch(err){
        console.log("Error at saving product update details: ", err);
    }
    setEditEnabled(prev => !prev);
  }
  const deleteAction = async (e, id) => {
    e.preventDefault();
    try{
      const response = await axiosInstance.delete(`/api/product/${id}`);
      alert(response.data?.message);
      setProducts(products => products.filter(product => product?._id !== id));
      closePopup();
    }catch(err){
      console.log("Error delete Product: ", err);
    }
  }
  return (
    // _id(optional),image_url[0],title,categoryId(optional),categoryTitle,quantity,price,discount,rating
    <div className='fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.2)] flex items-center justify-center'>
        <div className='max-h-[75%] min-w-[30rem] overflow-auto bg-white relative rounded-lg p-3 m-3'>
            <span className='absolute top-3 right-2 cursor-pointer hover:bg-slate-200 rounded-full p-1' onClick={()=>closePopup()}><CloseIcon/></span>
            <div>
                <div className='font-semibold text-xl px-4 py-2 flex items-center justify-center whitespace-nowrap'>Product Details</div>
                <div className='bg-gradient-to-r from-transparent via-gray-500 to-transparent h-[1px] w-full'></div>
            </div>
            <div className='flex flex-col gap-3 p-2 whitespace-nowrap'>
                <div className='flex items-center justify-center'>
                    <img src={product?.image_url} width="120rem"/>
                </div>
                <div className='flex gap-1'>
                    <span className='font-semibold'>Product ID</span>
                    <span className='ml-4'>{product._id}</span>
                </div>
                <div className='flex gap-1 items-center'>
                    <span className='font-semibold'>Title</span>
                    {
                        editEnabled ? <input value={productDetails.title} onChange={(e) => actionOnChange("title",e.target.value)} className='p-2 border-2 border-black rounded-md'/> : <span className='ml-4'>{productDetails.title}</span>
                    }
                </div>
                <div className='flex gap-1 items-center'>
                    <span className='font-semibold'>Category</span>
                    {
                        editEnabled ? 
                        <select onChange={(e) => actionOnChange("categoryId",e.target.value)} className='p-2 border-2 border-black rounded-md cursor-pointer'>
                            {Object.entries(categories).map(category => (
                                <option value={category[0]} selected={category[0] === productDetails.categoryId}>{category[1]}</option>
                            ))}
                        </select>
                         : <span className='ml-4'>{categories[productDetails.categoryId]}</span>
                    }
                </div>
                <div className='flex gap-1 items-center'>
                    <span className='font-semibold'>Quantity Available</span>
                    {
                        editEnabled ? <input value={productDetails.quantity} onChange={(e) => actionOnChange("quantity",e.target.value)} className='p-2 border-2 border-black rounded-md'/> : <span className='ml-4'>{productDetails.quantity}</span>
                    }
                </div>
                <div className='flex gap-1 items-center'>
                    <span className='font-semibold'>Product price</span>
                    {
                        editEnabled ? <input value={productDetails.price} onChange={(e) => actionOnChange("price",e.target.value)} className='p-2 border-2 border-black rounded-md'/> : <span className='ml-4'>₹ {numberFormatter(productDetails.price)}</span>
                    }
                </div>
                <div className='flex  gap-1 items-center'>
                    <span className='font-semibold'>Discount (%)</span>
                    {
                        editEnabled ? <input value={productDetails.discount} onChange={(e) => actionOnChange("discount",e.target.value)} className='p-2 border-2 border-black rounded-md'/> : <span className='ml-4'>{productDetails.discount}</span>
                    }
                </div>
                <div className='flex gap-1'>
                    <span className='font-semibold'>Rating</span>
                    <span className='ml-4'>
                        <Rating
                            name="half-rating"
                            defaultValue={2.5}
                            precision={0.5}
                            readOnly
                            value={product?.rating}
                        />
                    </span>
                </div>
                <div className='flex flex-row gap-3 items-end justify-end text-white'>
                    <span className={`w-20 h-10 cursor-pointer flex items-center justify-center border border-black ${editEnabled ? "bg-green-500" : "bg-blue-500"}`} onClick={(e) => {editEnabled ? saveAction(e, product._id) : setEditEnabled(prev => !prev)}}>{editEnabled ? "Save" : "Edit"}</span>
                    <span className='w-20 h-10 cursor-pointer flex items-center justify-center border border-black bg-red-500' onClick={(e) => deleteAction(e, product._id)}>Delete</span>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default ProductPopup
