import React, { useState } from "react";
import { axiosInstance } from "../Api_calls/API";

const AddressForm = ({address, setAddress}) => {
  const onChangeAddress = (name, value) => {
    if(name === "pin_code"){
      if(value.length > 6)
        return;
    }
    if(name === "phone_number" && value.length > 10){
      return;
    }
    setAddress(prev => ({...prev, [name] : value}));
  }
  const [isSaveOn, setIsSaveOn] = useState(false);
  const getAddress = async () => {
    try{
      const response = await axiosInstance.get("/api/users/address");
      console.log("Getting address: ", response);
      if(response.data?.address)
        setAddress(response.data?.address);
      else
        alert("No saved address!!");
    }catch(err){
      console.log("Error @ AddressForm get address: ", err);
    }
  }
  const saveAddress = async () => {
    try{
      const response = await axiosInstance.post("/api/users/address", address);
      console.log("saving address : ",response.data);
      alert("address details saved");
    }catch(err){
      console.log("Error @ AddressForm save address: ", err);
      alert("address save failed !!");
    }
  }
  return (
    <div className="w-full lg:flex-1 flex flex-col p-5 gap-4 shadow-2xl">
      <span className=" flex flex-row justify-between items-center">
        <span className="text-3xl font-semibold">Shipping Address</span>
        <button className="bg-blue-500 text-white rounded-md px-2 py-1" onClick={() => getAddress()}>
          Use saved address
        </button>
      </span>
      <span>
        <input
          type="text"
          placeholder="Receiver Name"
          value={address?.receiver_name}
          className="p-2 w-2/3 border-solid border-2 border-slate-300"
          onChange = {(e) => onChangeAddress("receiver_name",e.target.value)}
        />
      </span>
      <span>
        <input
          type="text"
          placeholder="address"
          value={address?.address}
          className="p-2 w-full border-solid border-2 border-slate-300"
          onChange = {(e) => onChangeAddress("address",e.target.value)}
        />
      </span>
      <span>
        <input
          type="text"
          placeholder="state"
          value={address?.state}
          className="p-2 w-2/3 border-solid border-2 border-slate-300"
          onChange = {(e) => onChangeAddress("state",e.target.value)}
        />
      </span>
      <span>
        <input
          type="text"
          placeholder="country"
          value={address?.country}
          className="p-2 w-2/3 border-solid border-2 border-slate-300"
          onChange = {(e) => onChangeAddress("country",e.target.value)}
        />
      </span>
      <span>
        <input
          type="text"
          placeholder="pincode"
          value={address?.pin_code}
          className="p-2 w-2/3 border-solid border-2 border-slate-300"
          onChange = {(e) => onChangeAddress("pin_code",e.target.value)}
        />
      </span>
      <span>
        <input
          type="text"
          placeholder="phone number"
          value={address?.phone_number}
          className="p-2 w-2/3 border-solid border-2 border-slate-300"
          onChange = {(e) => onChangeAddress("phone_number",e.target.value)}
        />
      </span>
      {/* TODO : ADD SAVE OPTION */}
      <span className="flex flex-row gap-3">
        <input
          type="checkbox"
          id="saveOption"
          className="cursor-pointer"
          onChange={(e) => setIsSaveOn(e.target.checked)}
        />
        <label for="saveOption" className="cursor-pointer">
          Save this address
        </label>
      </span>
      <span className="flex justify-end">
        {
          isSaveOn &&
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={() => saveAddress()}>
            Save
          </button>
          // :
          // <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          //   continue
          // </button>
        }
      </span>
    </div>
  );
};

export default AddressForm;
