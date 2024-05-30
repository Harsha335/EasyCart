import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Card from "../Components/Card";
import { Link, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import axios from "axios";
import { useUserAuth } from "../context/UserAuthContext";

const Product = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState([]);
  useEffect(() => {
    const getProduct = async () => {
      try {
        const config = {
          headers: {
            token: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/product/${productId}`,
          config
        );
        console.log("response @ product.jsx - product : ", response);
        const data = response.data?.product;
        setProduct(data);
      } catch (err) {
        console.log(err);
      }
    };
    getProduct();
  }, [productId]);

  const [comments, setComments] = useState([]);
  useEffect(() => {
    const getComments = async () => {
      try {
        const config = {
          headers: {
            token: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/product/${productId}/comment`,
          config
        );
        console.log("response @ product.jsx - comments : ", response);
        const data = response.data.comments;
        console.log("comments: ", data);
        setComments(data);
      } catch (err) {
        console.log(err);
      }
    };
    getComments();
  }, []);

  const [imgIndex, setImgIndex] = useState(0);

  const [addCart, setAddCart] = useState(false);
  const [addedCount, setAddedCount] = useState(1);
  useEffect(() => {
    if (addedCount === 0) {
      setAddCart(false);
      setAddedCount(1);
    }
  }, [addedCount]);

  const getDate = (date) => {
    // alert(new Date());
    if (!(date instanceof Date)) {
      throw new Error("Invalid date");
    }
    const currentDay = String(date.getDate()).padStart(2, "0");
    const currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    const currentYear = date.getFullYear();
    return `${currentDay}-${currentMonth}-${currentYear}`;
  };

  const { decryptData } = useUserAuth();
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    setUserEmail(decryptData("user").split(" ")[0]);
    // console.log(userEmail);
  }, [productId]);

  const [rating, setRating] = useState(0);
  const [commentTitle, setCommentTitle] = useState("");
  const [commentData, setCommentData] = useState("");
  // console.log(rating, commentTitle, commentData);
  const clearComment = () => {
    setRating(0);
    setCommentTitle("");
    setCommentData("");
  };
  const postComment = () => {
    const submitComment = async () => {
      try {
        const config = {
          headers: {
            token: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
        const data = { productId, rating, commentTitle, commentData };
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/product/comment`,
          data,
          config
        );
        clearComment();
        alert("Comment added 😉");
      } catch (err) {
        console.log("Error at sending comment : ", err);
        alert("Error...");
      }
    };
    submitComment();
  };

  if (product.length === 0) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className=" w-[100%] flex flex-col md:flex-row">
        {/* picture */}
        <div className="h-[75vh] flex-1 flex flex-col">
          {/* main picture */}
          <div className="h-[80%] m-auto p-2">
            <img
              src={`${product?.image_url[imgIndex]}`}
              className="h-full object-cover"
            ></img>
          </div>
          {/* other pictures */}
          <div className="flex-1 flex flex-row justify-evenly overflow-auto gap-2">
            {product?.image_url.map((imgSrc, index) => {
              if (imgIndex !== index) {
                return (
                  <img
                    src={imgSrc}
                    width="80px"
                    height="80px"
                    className="object-cover p-2 border-2 border-zinc-900 rounded-lg cursor-pointer "
                    onClick={() => setImgIndex(index)}
                  />
                );
              }
            })}
          </div>
        </div>

        <div className="flex-1  relative p-4 flex flex-col gap-3">
          {/* title,price(discount),rating,description */}
          <div className="text-2xl font-rubik font-semibold mb-1">
            {product?.title}
          </div>
          <div className="flex mb-1">
            <div className="justify-center">
              <Rating
                name="half-rating"
                defaultValue={2.5}
                precision={0.5}
                readOnly
                value={product?.rating}
              />
              ({comments.length}) reviews
            </div>
          </div>
          <div className="flex flex-row mb-4">
            <span className=" font-semibold mr-5 text-2xl">
              ₹ {(product.price * (100 - product.discount)) / 100}{" "}
            </span>
            <span className="line-through mr-5"> ₹{product.price} </span>
            <span className="font-semibold"> {product.discount}% off</span>
          </div>
          <div>
            <span className="font-bold">Features</span>
            <ul className="px-3 py-2 flex flex-col gap-1">
              {product.features.map((feature) => {
                return (
                  <li className="flex flex-row">
                    <div className="font-semibold w-48 overflow-auto">
                      {feature.key}
                    </div>
                    <span className="pr-4">:</span>
                    <div>{feature.value}</div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="">
            <span className="font-bold">Description</span>
            <div className="px-2 indent-8">{product.description}</div>
          </div>
          <div>
            <span className="font-bold">Availability :</span>
            {/*red<10 orange green>100*/}
            <span
              className={`text-green-800 font-semibold ${
                product.quantity < 100
                  ? product.quantity < 10
                    ? "text-red-600"
                    : "text-orange-600"
                  : ""
              }`}
            >
              {product.quantity > 0
                ? ` ${product.quantity} in stock`
                : " OUT OF STOCK"}
            </span>
          </div>
          <div className="flex flex-row my-4">
            <div className="mr-8">
              {!addCart && (
                <span
                  className="bg-yellow-500 p-2 rounded-md cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-in text-white"
                  onClick={() => {
                    setAddCart(!addCart);
                  }}
                >
                  Add to Cart
                </span>
              )}
              {addCart && (
                <div>
                  <span
                    className="cursor-pointer p-2 bg-slate-200 rounded-md"
                    onClick={() => {
                      setAddedCount(addedCount - 1);
                    }}
                  >
                    <RemoveIcon />
                  </span>
                  <span className="m-4">{addedCount}</span>
                  <span
                    className="cursor-pointer p-2 bg-slate-200 rounded-md"
                    onClick={() => {
                      setAddedCount(addedCount + 1);
                    }}
                  >
                    <AddIcon />
                  </span>
                </div>
              )}
            </div>
            <div className="">
              <span className="bg-orange-500 p-2 rounded-md cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-in text-white">
                Buy now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* comments */}
      <div className="mx-2 my-5">
        <div>
          {/* IS POSTED CHANGE INTO ORIGINAL COMMENT ADD EDIT */}
          <span className="text-xl font-bold">Add a Comment</span>
          <div className="p-4 border-4 ">
            <span>
              <AccountCircleIcon />
            </span>
            <span className="font-semibold">{userEmail}</span>
            <div className="m-2">
              <Rating
                name="half-rating"
                precision={0.5}
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
              />
            </div>
            <div className="m-2">
              <input
                placeholder="Title"
                type="text"
                className="border-2 border-neutral-500 p-1"
                value={commentTitle}
                onChange={(e) => setCommentTitle(e.target.value)}
              ></input>
            </div>
            <div className="m-2 mb-5">
              <textarea
                placeholder="Comment"
                rows={5}
                cols={70}
                className="border-2 border-neutral-500 p-1"
                value={commentData}
                onChange={(e) => setCommentData(e.target.value)}
              ></textarea>
            </div>
            <div className="">
              <span
                className="mr-4 p-2 bg-red-600 rounded-xl cursor-pointer hover:bg-red-400 text-white"
                onClick={() => clearComment()}
              >
                Cancel
              </span>
              <span
                className=" p-2 bg-green-500 rounded-xl cursor-pointer hover:bg-green-400 text-white"
                onClick={() => postComment()}
              >
                Post
              </span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xl font-bold">Top Comments</span>
          {comments.map((comment) => {
            return (
                <div className="p-4 border-4 m-4">
                  <span>
                    <AccountCircleIcon />
                  </span>
                  <span className="font-semibold">{comment.userId}</span>
                  <div className="m-2">
                    <Rating
                      name="half-rating"
                      value={comment.rating}
                      precision={0.5}
                      readOnly
                    />
                    <span>on {getDate(new Date(comment.updatedAt))}</span>
                  </div>
                  <div className="m-2 font-semibold">
                    {comment.title}
                  </div>
                  <div className="m-2">
                    {comment.comment}
                  </div>
                </div>
            );
          })}
        </div>
      </div>
      {/* suggested products */}
      <div className="m-4">
        <div className="text-2xl font-semibold ">You may Also Like</div>
        <div className="bg-neutral-100 my-[15px] box-border w-[100%] h-[300px] p-4 rounded-[10px] shadow-inner flex flex-row flex-nowrap overflow-auto justify-around">
          {" "}
          {/*grid grid-cols-5 gap-4*/}
          {/* USE GRID */}
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
      <div className="flex items-center justify-center m-4">
        <Link
          to="/products"
          className="border-solid border-2 border-black p-2 bg-orange-600 text-white cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-out "
        >
          Explore All categories
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default Product;
