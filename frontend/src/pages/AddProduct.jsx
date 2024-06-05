import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
// import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import addProduct from "../assets/images/addProduct.jpg";
import axios from "axios";
import { useUserAuth } from "../context/UserAuthContext";
import {axiosInstance} from "../Api_calls/API";

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState([]); // get category list
  const { decryptData } = useUserAuth();
  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await axiosInstance.get(
          `/api/product/all-categories`,
        );
        // console.log(data);
        setCategory(data.data);
      } catch (err) {
        console.log("Error at fetching category list : ", err);
      }
    };
    getCategory();
  }, []);
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [features, setFeatures] = useState([{ key: "", value: "" }]);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");// current tag
  const [files, setFiles] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(0);  // TODO : NOT WORKING -DIRECT 100% GIVING

  const setValues = (setEle, value) => {
    setEle(value);
  };
  const addFeature = () => {
    const newEle = { key: "", value: "" };
    setFeatures((prev) => [...prev, newEle]);
  };
  const delFeature = (index) => {
    setFeatures((prev) => prev.filter((ele, ind)=> index !== ind));
  }
  const addTag = () => {
    if(tag.length !== 0)
      setTags(prev=> [...prev, tag]);
    setTag("");
  }
  const delTag = (index) => {
    setTags(prev => prev.filter((ele, ind) => index !== ind));
  }
  const addFile = (file) => {
    const fileArray = Array.from(file);
    setFiles(prev => [...prev, ...fileArray]);
  }
  const delFile = (index) => {
    setFiles(prev => prev.filter((ele, ind) => index !== ind));
  }
  const clearData = () => {
    setTitle('');
    setCategoryId("");
    setQuantity("");
    setPrice("");
    setDiscount("");
    setFeatures([{ key: "", value: "" }]);
    setDescription("");
    setTags([]);
    setTag('');
    setFiles([]);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", categoryId);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("discount", discount);
    // formData.append("features", features);
    features.forEach((feature, index) => {
      formData.append(`features[${index}][key]`, feature.key);
      formData.append(`features[${index}][value]`, feature.value);
    });
    formData.append("description", description);
    // formData.append("tags", tags);
    tags.forEach(item => formData.append("tags[]", item));
    // formData.append("files", files);
    files.forEach((file, index) => {
      formData.append(`files`, file);
      // formData.append(`files[${index}]`, file);
    });

    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ': ' + pair[1]);
    // }
    const submitData = async () => {
      try{
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            token: "Bearer " + localStorage.getItem("accessToken"),
            id: `${decryptData("user")[2]}`
          }, 
          onUploadProgress: (progressEvent) => {  // TODO : NOT WORKING -DIRECT 100% GIVING
            const { loaded, total } = progressEvent;
            const percentage = Math.floor((loaded * 100) / total);
            console.log('percentage => ', percentage);
            setUploadProgress(percentage);
          },
        };
        const data = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/product/add-product`,
          formData,
          config
        );
        console.log("responce for submit addProduct: ",data);
        alert("successfully added😊");
        setUploadProgress(0);
        clearData();
      }catch(err){
        alert("product rejected🥲");
        console.log("Error at addProduct submit: ", err);
        setUploadProgress(0);
      }
    }
    submitData();
  };

  return (
    <div className="px-10 py-8">
      <div className="bold text-[2.5rem] font-ubuntu ">Add Products</div>
      <hr className="border-[1px] border-y-zinc-500 mb-5" />
      <div className="flex flex-row">
        <div className="flex-1">
          <div className="w-[90%]  flex flex-col gap-3">
            <div className="flex flew-row">
              <label for="productTitle">Product Title</label>
              {/* <br /> */}
              <input
                id="productTitle"
                name="productTitle"
                type="text"
                className="flex-1 ml-3 border-2 border-zinc-500 py-1 px-2"
                onChange={(e) => setValues(setTitle, e.target.value)}
                value={title}
              ></input>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <label for="category">Category</label>
                <select
                  id="category"
                  // value={category}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{
                    margin: "0 0 0 0.8rem",
                    padding: "0.3em 1em",
                    border: "2px solid #808080",
                  }}
                >
                  <option value="" selected>-select-</option>
                  {category &&
                    // console.log(category) &&
                    category.map((ele) => {
                      // console.log("ele: ",ele);
                      return <option value={ele._id}>{ele.title}</option>;
                    })}
                </select>
              </div>
              <div>
                <label for="quantity">Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  className="border-2 ml-3 border-zinc-500 py-1 px-2"
                  onChange={(e) => setValues(setQuantity, e.target.value)}
                  value={quantity}
                ></input>
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <div>
                <label for="price">Price (₹)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  className="border-2 border-zinc-500 ml-2 py-1 px-2"
                  onChange={(e) => setValues(setPrice, e.target.value)}
                  value={price}
                ></input>
                {/* keep inside */}
              </div>
              <div>
                <label for="discount">Discount (%)</label>
                <input
                  id="discount"
                  name="discount"
                  type="number"
                  className="border-2 border-zinc-500 ml-2 py-1 px-2"
                  onChange={(e) => setValues(setDiscount, e.target.value)}
                  value={discount}
                ></input>
              </div>
            </div>

            <div>
              <label for="aboutItem">Features </label>
              <span onClick={() => addFeature()}>
                <AddCircleOutlineIcon className="cursor-pointer" />
              </span>
              <div className="flex flex-col justify-center items-center gap-2">
                {features &&
                  // console.log(features) &&
                  features.map((ele,index) => {
                    // console.log("ele: ", index,ele);
                    return (
                      <div className="flex flex-row gap-2">
                        <input
                          id="aboutItem"
                          name="aboutItem"
                          type="text"
                          className="border-2 border-zinc-500 py-1 px-2"
                          value={ele.key}
                          onChange={(e)=> setFeatures(features.map((ele,ind) => {
                            // console.log("ele2",ele,ind,e.target.value)
                            // console.log(ind,features[ind])
                            // const ele = ele;
                            if(ind === index){
                              // console.log(ele.key , e.target.value);
                              ele.key = e.target.value;
                            }
                            // console.log(ele);
                            return ele;
                          }))}
                        ></input>
                        <span>:</span>
                        <input
                          id="aboutItem"
                          name="aboutItem"
                          type="text"
                          className="border-2 border-zinc-500 py-1 px-2"
                          value={ele.value}
                          onChange={(e)=> setFeatures(features.map((ele,ind) => {
                            // console.log("ele2",ele,ind,e.target.value)
                            // console.log(ind,features[ind])
                            // const ele = ele;
                            if(ind === index){
                              // console.log(ele.key , e.target.value);
                              ele.value = e.target.value;
                            }
                            // console.log(ele);
                            return ele;
                          }))}
                        ></input>
                        <span onClick={()=>delFeature(index)}><DeleteOutlineTwoToneIcon sx={{color:"#ff0101"}}/></span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="">
              <label for="description">Description</label>
              <br />
              <textarea
                id="description"
                name="description"
                type="text"
                rows={5}
                // cols={80}
                className="border-2 w-[100%] border-zinc-500 py-1 px-2"
                onChange={(e)=> setValues(setDescription, e.target.value)}
                value={description}
              ></textarea>
            </div>

            <div>
              <div>Tags🏷️</div>
              <div className="flex flex-row flex-wrap gap-2">
                <div className="flex justify-center items-center ">
                <input
                  id="tagValue"
                  name="tag"
                  type="text"
                  className="border-2 border-zinc-500 py-1 px-2"
                  value={tag}
                  onChange={(e)=>setTag(e.target.value)}
                ></input>
                  {/* <AddCircleOutlineIcon className="cursor-pointer" /> */}
                  <span className="border-2 border-black py-1 px-2 bg-green-500 text-white cursor-pointer" onClick={()=>addTag()}>ADD</span>
                </div>
                {
                  tags && 
                  tags.map((ele,index) => (
                    <div className="border-black border-2 rounded-lg px-2 py-1">
                      <span>{ele}</span>
                      <span className="ml-1 cursor-pointer" onClick={()=>delTag(index)}>
                        <CancelSharpIcon sx={{ fontSize: 18 }} />
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="">
              <label for="addImage">Add Images </label>
              <div>
                <input
                  id="addImage"
                  name="addImage"
                  type="file"
                  multiple
                  className="cursor-pointer"
                  onChange={(e)=>addFile(e.target.files)}
                ></input>
              </div>
              <div className="p-1 flex flex-wrap flex-row">
                {files && 
                // console.log(files) &&
                files.map((ele,index)=>(
                  <div className="relative ">
                    <img src={URL.createObjectURL(ele)} className="w-24 m-3"></img>
                    <span className="absolute top-0 right-0 text-red-600 cursor-pointer" onClick={()=>delFile(index)}>
                      {/* <CloseIcon/> */}
                      <CancelSharpIcon/>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex-1">
              <input
                type="submit"
                className="px-4 py-2 rounded-md bg-green-500 cursor-pointer w-full"
                onClick={(e) => handleSubmit(e)}
              />
              {/* className={`absolute left-0 bottom-0 top-0 opacity-20 bg-zinc-800`} */}
              <span
                style={{ 
                  position: "absolute",
                  left: "0",
                  bottom: "0",
                  top: "0",
                  // opacity: 0.5,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  width: `${uploadProgress}%`,  // TODO : NOT WORKING -DIRECT 100% GIVING
                  borderRadius: "0.375rem"
                }}>
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 hidden lg:block">
          <img src={addProduct}></img>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
