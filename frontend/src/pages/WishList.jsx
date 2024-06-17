import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../Api_calls/API';
import Card from '../Components/Card';

const WishList = () => {
    const productIds = useSelector(store => store.userReducer.userDetails.likedProductIds);
    console.log(productIds);
    const [productDetails, setProductDetails] = useState([]);
    useEffect(()=>{
        const getData = async () => {
            try{
                const promises = productIds.map(productId => {
                    if (productId !== null) {
                        return axiosInstance.get(`/api/product/${productId}`);
                    }
                    return null;
                }).filter(Boolean); // Filter out null promises
                
                const responses = await Promise.all(promises);
                console.log(responses);
                const data = responses.map(response => response?.data?.product);
                setProductDetails(data);
            }catch(err){
                console.log("ERROR @ wishList ",err);
            }
        }
        getData();
    },[productIds]);
    console.log(productDetails);
    if(productIds.length !== 0 && productDetails.length === 0)
        return <div>Loading...</div>
  return (
    <div>
      <Navbar/>
      <div className='m-4 min-h-screen'>
        <div className="text-3xl font-semibold font-PlayfairDisplay pb-2 pl-2 flex items-center justify-center">
            <span>Wish List</span>
        </div>
        <div className="bg-neutral-100 my-[15px] p-2 rounded-[10px] shadow-inner  grid grid-cols-5 overflow-auto">
            {
                productDetails.map((product) => {
                    return (<Card product={product}/>)
                })
            }
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default WishList;
