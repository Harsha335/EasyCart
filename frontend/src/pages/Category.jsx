import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Card from "../Components/Card";
import Footer from "../Components/Footer";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import Pagination from "../Components/Pagination";

const Category = () => {
  const { categoryId } = useParams();

  const DEFAULT_PAGE_NO = 1;
  const DEFAULT_PAGE_SIZE = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log("Page no.",searchParams.get("page"));
  const page = searchParams.get("page") || DEFAULT_PAGE_NO;
  const size = searchParams.get("size") || DEFAULT_PAGE_SIZE;

  // const [totalSize, setTotalSize] = useState(0); // TOTAL NUMBER OF PRODUCTS
  const [totalPages, setTotalPages] = useState(0); // TOTAL NUMBER OF PAGES

  const [categoryName, setCategoryName] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getCategoryName = async () => {
      const config = {
        headers: {
          token: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/product/getCategory/${categoryId}`,
        config
      );
      setCategoryName(response.data.title);
    };
    getCategoryName();
  }, [categoryId]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const config = {
          headers: {
            token: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/product/category/${categoryId}/?page=${page}&size=${size}`,
          config
        );
        console.log(response);
        const data = response.data.products;
        setProducts(data);
        // setTotalSize(response.data.totalSize);
        setTotalPages(Math.ceil((response.data.totalSize)/size));
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, [categoryId, page, size]);

  if (products.length === 0) return <div>Loading...</div>;
  return (
    <>
      <Navbar />
      <div className="m-4" key={categoryId}>
        <div className="text-3xl font-semibold font-PlayfairDisplay pb-2 pl-2 flex items-center justify-center">
          <span>{categoryName}</span>
        </div>
        <div className="bg-neutral-100 my-[15px] p-2 rounded-[10px] shadow-inner  grid grid-cols-5 overflow-auto">
          {products?.map((product) => {
            return <Card product={product} />;
          })}
          {/*  ADDED PAGINATION   */}
        </div>
        <Pagination currPage={Number(page)} setSearchParams={setSearchParams} totalPages={Number(totalPages)} size={size}/>
      </div>
      <Footer />
    </>
  );
};

export default Category;
