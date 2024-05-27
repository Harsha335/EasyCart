import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Card from "../Components/Card";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

const Product = () => {
  const [addCart, setAddCart] = useState(false);
  const [addedCount, setAddedCount] = useState(1);
  const [currentDate,setCurrentDate]=useState("1/1/2023");
  useEffect(() => {
    if (addedCount === 0) {
      setAddCart(false);
      setAddedCount(1);
    }
  }, [addedCount]);
  useEffect(() => {
    const date = new Date();
    let currentDay = String(date.getDate()).padStart(2, "0");
    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
    setCurrentDate(currentDate);
  },[]);
  return (
    <>
      <Navbar />
      {/* picture */}
      <div className="h-[75vh] w-[100%] flex flex-row mb-5">
        <div className="flex-1 flex flex-col">
          {/* main picture */}
          {/* SEE SIZE */}
          <div className="flex-7 m-auto bg-slate-500 ">
            <img
              src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-14-Pro/Deep-Purple/Apple-iPhone-14-Pro-Deep-Purple-thumbnail.png"
              // height="50%"
              className="object-contain"
            ></img>
          </div>
          {/* other pictures */}
          <div className="flex-1 flex flex-row justify-evenly">
            <img
              src="https://fdn.gsmarena.com/imgroot/static/headers/makers/apple-2023-1.jpg"
              width="80px"
              height="80px"
              className="object-cover p-2 border-2 border-zinc-900 rounded-lg cursor-pointer "
            ></img>
            {/*object-cover scale-down*/}
            <img
              src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-14-Pro/Deep-Purple/Apple-iPhone-14-Pro-Deep-Purple-thumbnail.png"
              width="80px"
              height="80px"
              className="object-cover p-2 border-2 border-zinc-900 rounded-lg cursor-pointer "
            ></img>
            <img
              src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-14-Pro/Deep-Purple/Apple-iPhone-14-Pro-Deep-Purple-thumbnail.png"
              width="80px"
              height="80px"
              className="object-cover p-2 border-2 border-zinc-900 rounded-lg cursor-pointer "
            ></img>
          </div>
        </div>

        <div className="flex-1  relative p-4">
          {/* title,price(discount),rating,description */}
          <div className="text-2xl font-rubik font-semibold mb-1">
            IPhone 7 Plus 64GB Platinum
          </div>
          <div className="flex mb-1">
            <div className="justify-center">
              <Rating
                name="half-rating"
                defaultValue={2.5}
                precision={0.5}
                readOnly
                value={4.5}
              />
              (2) review
            </div>
          </div>
          <div className="flex flex-row mb-4">
            <span className=" font-semibold mr-5 text-2xl">₹ 134999 </span>
            <span className="line-through mr-5"> ₹149999 </span>
            <span className="font-semibold"> 5% off</span>
          </div>
          <div>
            <span className="font-bold">About This Item</span>
            <ul className="px-2">
              <li>
                <span className="font-semibold">Brand:</span> OnePlus
              </li>
              <li>
                <span className="font-semibold">Model Name:</span> OnePlus Nord
                CE 3 Lite 5G
              </li>
              {/* <li>Network Service Provider Unlocked for All Carriers</li> */}
              <li>
                <span className="font-semibold">Operating System:</span>{" "}
                OxygenOS
              </li>
              <li>
                <span className="font-semibold">Cellular Technology:</span> 5G,
                4G LTE
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <span className="font-bold">Discription</span>
            <div className="px-2 indent-8">
              Camera: 108 MP Main Camera with EIS; 2MP Depth-Assist Lens and 2MP
              Macro Lens; Front (Selfie) Camera: 16MP Rear Camera Mode: Hi-res
              108MP mode, 3x Lossles Zoom, Photo, Video, Nightscape, Expert,
              Panoramic, Portrait, Macro, Time-lapse, Slow-motion, Long
              exposure, Dual-view video, Text Scanner, 1080p/720p@30fps, Video
              zoom: 1080P@30fps, 720P@30fps, Slow motion: 720P@120fps,
              Time-Lapse: 1080P@30fps, Steady Video EIS support Display: 6.72
              Inches; 120 Hz Adaptive refresh rate; FHD+(1080×2400), Colors:
              16.7 Million colors, 391 ppi, Aspect Ratio: 20:9, Brightness: 550
              nits (typical), 680 nits (HBM) Operating System: Oxygen OS based
              on Android 13.1 Processor: Qualcomm Snapdragon 695 5G Battery &
              Charging: 5000 mAh with 67W SUPERVOOC Endurance Edition
            </div>
          </div>
          <div>
            <span className="font-bold">Availability :</span>
            <span className="text-green-800 font-semibold"> 120 in stock</span>
            {/*red<10 orange green>100*/}
          </div>
          <div className="flex flex-row my-4">
            <div className="mr-8">
              {!addCart && (
                <span
                  className="bg-yellow-500 p-2 rounded-md cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-in"
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
                  {addedCount}
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
              <span className="bg-orange-500 p-2 rounded-md cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-in">
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
            <span className="font-semibold">Profile Name</span>
            <div className="m-2">
              <Rating name="half-rating" defaultValue={5} precision={0.5} />
            </div>
            <div className="m-2">
              <input
                placeholder="Title"
                type="text"
                className="border-2 border-neutral-500 p-1"
              ></input>
            </div>
            <div className="m-2 mb-5">
              <textarea
                placeholder="Comment"
                rows={5}
                cols={70}
                className="border-2 border-neutral-500 p-1"
              ></textarea>
            </div>
            <div className="">
              <span className="mr-4 p-2 bg-red-600 rounded-xl cursor-pointer hover:bg-red-500">Cancel</span>
              <span className=" p-2 bg-green-500 rounded-xl cursor-pointer hover:bg-green-400">Post</span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xl font-bold">Top Comments</span>
          <div className="p-4 border-4 m-4">
            <span>
              <AccountCircleIcon />
            </span>
            <span className="font-semibold">Profile Name</span>
            <div className="m-2">
              <Rating
                name="half-rating"
                defaultValue={5}
                precision={0.5}
                readOnly
              />
              <span>on{currentDate}</span>
            </div>
            <div className="m-2 font-semibold">Best Product i have brought</div>
            <div className="m-2">This product is good but sound is not clear</div>
          </div>
          <div className="p-4 border-4 m-4">
            <span>
              <AccountCircleIcon />
            </span>
            <span className="font-semibold">Profile Name</span>
            <div className="m-2">
              <Rating
                name="half-rating"
                defaultValue={2}
                precision={0.5}
                readOnly
              />
              <span>on{currentDate}</span>
            </div>
            <div className="m-2 font-semibold">Best Product i have brought</div>
            <div className="m-2">This product is good but sound is not clear</div>
          </div>
        </div>
      </div>
      {/* suggested products */}
      <div className='m-4'>
      <div className='text-2xl font-semibold '>You may Also Like</div>
        <div className='bg-neutral-100 my-[15px] box-border w-[100%] h-[300px] p-4 rounded-[10px] shadow-inner flex flex-row flex-nowrap overflow-auto justify-around'> {/*grid grid-cols-5 gap-4*/}
          {/* USE GRID */}
          <Card/>
          <Card/>
          <Card/>
          <Card/>
          <Card/>
        </div>
      </div>
      <div className='flex items-center justify-center m-4'>
        <Link to="/products" className='border-solid border-2 border-black p-2 bg-orange-600 text-white cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-out '>Explore All categories</Link> 
      </div>
      <Footer/>
    </>
  );
};

export default Product;
