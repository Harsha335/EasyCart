import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import SearchIcon from '@mui/icons-material/Search';
import { axiosInstance } from '../Api_calls/API';
import MultiRangeSlider from "multi-range-slider-react";
import Card from '../Components/Card';
import noItem from '../assets/images/noProductFound.jpg'

const Search = () => {
    const MIN_VALUE = 5;
    const MAX_VALUE = 100000;
    const [minPrice, setMinPrice] = useState(MIN_VALUE);
    const [maxPrice, setMaxPrice] = useState(MAX_VALUE);
    const handleChange = (e) => {
        setMinPrice(e.minValue);
        setMaxPrice(e.maxValue);
    };
    const handleMinPrice = (value) => {
        if(value < MIN_VALUE){
            setMinPrice(MIN_VALUE);
        }else if(value > maxPrice){
            setMinPrice(maxPrice);
        }else{
            setMinPrice(value);
        }
    }
    const handleMaxPrice = (value) => {
        if(value > MAX_VALUE){
            setMaxPrice(MAX_VALUE);
        }else if(value < minPrice){
            setMaxPrice(minPrice);
        }else{
            setMaxPrice(value);
        }
    }

    const [categories, setCategories] = useState([]);
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

    const [searchText, setSearchText] = useState("");
    const [categoryId, setCategoryId] = useState("null");
    const [rating, setRating] = useState(0);
    const [filterSort ,setFilterSort] = useState("null");
    const [products, setProducts] = useState();
    const sendSearch = async (e) => {
        e.preventDefault();
        setSearchText(searchText.trim());
        if(searchText.length === 0){
            return;
        }
        console.log(searchText);
        const res = await axiosInstance.get(`/api/product/search/${searchText}/?categoryId=${categoryId}&sort=${filterSort}&rating=${rating}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
        console.log(res);
        const data = res.data?.data;
        setProducts(data);
    }
  return (
    <div>
      <Navbar/>
      <div>
        <div className='flex items-center justify-center p-2 shadow-md'>
            <span className=' border-black border-2 rounded-md'>
                <input type='text' value={searchText} onChange={e => setSearchText(e.target.value)} className='p-2 focus:outline-none rounded-md' size="70"/>
                <span className='p-2 bg-orange-400 rounded-md cursor-pointer border-y-2 border-l-2 active:border-0 border-black' onClick={e => sendSearch(e)}>
                    <SearchIcon/>
                </span>
            </span>
        </div>
        <div className='flex'>
            {/* FEATURES */}
            <div className='flex-none w-80 flex flex-col gap-5 p-4 shadow-2xl'>
                <span className='flex items-center justify-center  font-ubuntu text-xl font-medium'>
                    FILTERS
                </span>
                <span className='flex flex-col gap-3'>
                    <span>Category</span>
                    <span>
                        <select className='w-full p-2 border-slate-500 border-2 cursor-pointer' onChange={e => setCategoryId(e.target.value)}>
                            <option value="null">All products</option>
                            {categories &&
                                categories.map(category => {
                                    return (<option value={category._id}>{category.title}</option>)
                                })
                            }
                        </select>
                    </span>
                </span>
                <span className='flex flex-col gap-3'>
                    <span>Sort By</span>
                    <span>
                        <select className='w-full border-slate-500 border-2 p-2 cursor-pointer' onChange={e => setFilterSort(e.target.value)}>
                            <option value="null">-None-</option>
                            <option value="LtoH">Price: Low to High</option>
                            <option value="HtoL">Price: High to Low</option>
                            <option value="new">Newest Arrivels</option>
                        </select>
                    </span>
                </span>
                <span className='flex flex-col gap-3'>
                    <span>Rating</span>
                    <span>
                        <select className='w-full p-2 border-2 border-slate-500 cursor-pointer' onChange={e => setRating(e.target.value)}>
                            <option value={0}>All products</option>
                            <option value={4}>4 or more rating products</option>
                            <option value={3}>3 or more rating products</option>
                            <option value={2}>2 or more rating products</option>
                            <option value={1}>1 or more rating products</option>
                        </select>
                    </span>
                </span>
                <span className='flex flex-col gap-3'>
                    <span>Price range</span>
                    <span>
                    <MultiRangeSlider
                        min={MIN_VALUE}
                        max={MAX_VALUE}
                        step={5}
                        minValue={minPrice}
                        maxValue={maxPrice}
                        onInput={(e) => {
                            handleChange(e);
                        }}
                        ruler={false}
                        // label={false}
                        // maxCaption='1k+'
                        // stepOnly={true}
                        barInnerColor={"#0000"}
                    />
                    <span className='flex flex-col gap-3 p-2'>
                        <span>Min Value : <input type='number' value={minPrice} onChange={e => handleMinPrice(e.target.value)} className='border-2 border-slate-500 p-1  w-28'/></span>
                        <span>Max Value : <input type='number' value={maxPrice} onChange={e => handleMaxPrice(e.target.value)} className='border-2 border-slate-500 p-1 w-28'/></span>
                    </span>
                    </span>
                </span>
            </div>
            {/* PRODUCTS */}
            {
                products ?
                <div className="flex-1 bg-neutral-100 p-2 rounded-[10px] shadow-inner grid grid-cols-5 overflow-auto">
                    {products.map((product) => {
                        return <Card product={product} />;
                    })}
                    {/*  ADDED PAGINATION   */}
                </div>
                :
                <div className='flex-1 flex items-center justify-center'>
                    <img src={noItem} className='w-[60%]'/>
                </div>
            }
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Search
