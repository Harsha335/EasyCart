import React, { useEffect, useState } from "react";
import { banner } from "../assets/data";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";

const Slider = () => {
  // setTimeout
  const [move, setMove] = useState(0);
  const bannerLength = banner.length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (move === bannerLength-1) setMove(0);
      else setMove((move) => move + 1);
    }, 5000); //5sec
    return () => clearInterval(interval);
  }, [move]);

  const handleClick = (isLeft) => {
    // alert(isLeft);

    if (isLeft) {
      if (move === 0) setMove(bannerLength-1);
      else setMove((move) => move - 1 );
    } else {
      if (move === bannerLength-1) setMove(0);
      else setMove((move) => move + 1);
    }
    // alert(move);
  };
  return (
    <div className="relative overflow-x-hidden">
      <span
        className="absolute left-3 top-[50%] bottom-[50%] cursor-pointer opacity-70 hover:opacity-100 z-10"
        onClick={() => handleClick(true)}
      >
        <ArrowCircleLeftOutlinedIcon sx={{ fontSize: 40 }} />
      </span>
      <span
        className="absolute right-3 top-[50%] bottom-[50%] cursor-pointer opacity-70 hover:opacity-100 z-10"
        onClick={() => handleClick(false)}
      >
        <ArrowCircleRightOutlinedIcon sx={{ fontSize: 40 }} />
      </span>
      <div
        // className={`flex flex-row transition-all duration-300 ease-in -translate-x-[
        //    ${ move * 100 }
        // %]`}
        style={{display: 'flex',
        flexDirection: 'row',
        transition: 'all 300ms ease-in',
        transform: `translateX(-${move * 100}%)`}}
      >
        {banner.map((item) => {
          return (
            <img
              key={item.id}
              src={item.imgSrc}
              alt={item.name}
              className={"min-w-full h-[85vh] object-cover"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Slider;