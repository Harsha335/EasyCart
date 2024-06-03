import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Card from '../Components/Card'
import Footer from '../Components/Footer'
// import axios from 'axios'
import { Link } from 'react-router-dom'
// import { useUserAuth } from "../context/UserAuthContext";
import {axiosInstance} from "../Api_calls/API";

const AllProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  // const { decryptData } = useUserAuth();

  useEffect(()=>{
    const getCategories = async () => {
      try{
        const response = await axiosInstance.get(`/api/product/all-categories`);
        // console.log("categories : ",response.data);
        setCategories(response.data);
      }catch(err){
        console.log(err);
      }
    }
    getCategories();
  },[]);
  useEffect(()=> {
    const getProducts = async () => {
      const productList = [];
      for(const category of categories){
        // console.log("getting category: ", category.title);
        try{
          const id = category._id;
          const response = await axiosInstance.get(`/api/product/category/${id}/?page=1&size=4`);
          const data = {id , products : response.data.products};
          // console.log(data);
          // setProducts(prev => [...prev, ...data]);
          productList.push(data);
          // console.log(products);
        }catch(err){
          console.log(err);
        }
      }
      // console.log(productList);
      setProducts(productList);
      console.log("products : ", products);
    }
    if(categories.length !== 0)
      getProducts();
  },[categories]);
  const getIndexProduct = (id) => {
    // console.log(id);
    const data = products.filter(product => {
      // console.log(product,product.id === id);
      return (product.id === id);
    })[0]?.products;
    console.log(data);
    return data;
  }
  if(categories.length === 0 || products.length === 0)
    return (<div>Loading...</div>);
  return (
    <>
      <Navbar/>
      {categories &&
        categories.map((category) => {
          return (
              <div className='m-4' key={category._id}>
                <div className='text-3xl font-semibold font-PlayfairDisplay border-l-[6px] border-orange-600 pb-2 pl-2'>{category.title}</div>  {/*Electronics*/}
                <div className='bg-neutral-100 my-[15px] p-2 rounded-[10px] shadow-inner  grid grid-cols-5 overflow-auto'>{/* grid grid-cols-5 gap-4 */}
                  {
                    getIndexProduct(category._id)?.map((product) => {
                          return (<Card product={product}/>);
                    })
                  } 
                  <div className='h-full flex items-center justify-center '>
                    <span className='w-56 h-[90%] bg-slate-300 rounded-2xl flex items-center justify-center '>
                      <span className='p-2 border-2 border-black bg-orange-500 text-white cursor-pointer hover:p-3'><Link to={`/category/${category._id}`}>VIEW MORE</Link></span>
                    </span>    
                  </div>
                </div>
              </div>
          )
        })
      }
      <Footer/>
    </>
  )
}

export default AllProducts;
