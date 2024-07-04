import React, { useState, useRef, useEffect } from 'react';
import default_profile_user from "../assets/images/default_user.jpg";
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { axiosInstance } from '../Api_calls/API';
import { useUserAuth } from "../context/UserAuthContext";

const ManageProfile = ({handleProfile}) => {
    const { decryptData } = useUserAuth();
    const userId = decryptData("user").split(" ")[2];
    const closeManageProfile = () =>{
        handleProfile();
    }
    const [userData,setUserData]=useState({});
    const [profileImg, setProfileImg] = useState('');
    // const {profileImg,userName,userEmail}=userData;

    useEffect(()=>{
        const fetchUserData = async () => {
            try{
                const response = await axiosInstance.get(`/api/users/find/${userId}`);
                console.log("response at manage profile: ",response.data.data);
                setUserData(response.data.data);
            }catch(err){
                console.log("error at manage profile: ",err);
            }
        }
        fetchUserData();
    },[]);

    const profile_img_ref = useRef();
    const handleProfileImage = () => {
        editProfile &&
        profile_img_ref.current.click();
    }

    const [editProfile, setEditProfile] = useState(false);

    const changeHandler = e => {
        setUserData({...userData,[e.target.name]:e.target.value});
    }
    const changeAddressHandler = e => {
        const key = e.target.name;
        if(key === "phone_number")
        {
            const lastChar = e.target.value.slice(-1);
            if(!('0' <= lastChar && lastChar <= '9') || e.target.value.length > 10){
                return;
            }
        }
        if(key === 'pin_code')
        {
            const lastChar = e.target.value.slice(-1);
            if(!('0' <= lastChar && lastChar <= '9') || e.target.value.length > 6){
                return;
            }
        }
        setUserData({...userData,address:{
            ...userData.address,
            [key]:e.target.value
        }});
    }

    function buildFormData(formData, data, parentKey) {
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
          Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
          });
        } else {
          const value = data == null ? '' : data;
          formData.append(parentKey, value);
        }
    }
    const saveProfile = async () => {
        try{
            const formData = new FormData();
            buildFormData(formData, userData);
            formData.append('profileImg', profileImg);
            // for(const key of formData)
            //     console.log(key);
            const response = await axiosInstance.put(`/api/users/${userId}`,formData);
            console.log("response at saveUpdated Profile",response);
        }catch(err){
            console.log("Error at saveUpdated Profile", err);
        }
        setEditProfile(!editProfile);
    }

    if(!userData){
        return <div>Loading...</div>
    }

    return (
        <div className="z-10 text-black fixed bg-[rgba(0,0,0,0.2)] top-0 left-0 min-h-screen w-full flex items-center justify-center">
            <div className='w-96 min-h-96 overflow-x-hidden overflow-y-auto-auto bg-white relative rounded-lg p-4 flex flex-col justify-between'>
                <span className='absolute top-3 right-2 cursor-pointer hover:bg-slate-200 rounded-full p-1 ' onClick={()=>closeManageProfile()}><CloseIcon/></span>
                <div className='p-3 flex flex-col gap-2'>
                    <div className="m-auto w-24 h-24 relative group">
                        <input ref={profile_img_ref} type="file" name="profileImg" className="hidden" onChange={(e)=>setProfileImg(e.target.files[0])}/>
                        <img src={profileImg ? URL.createObjectURL(profileImg) : userData?.profile_img_url || default_profile_user} onClick={handleProfileImage} className={`border-2 border-black ${editProfile && "cursor-pointer"} w-24 h-24 object-cover rounded-full`}/>
                        {editProfile && (profileImg || userData?.profile_img_url)  && <span className="absolute hidden group-hover:block bottom-0 text-red-500 -right-5 cursor-pointer" onClick={() => {setProfileImg('');setUserData({...userData,'profile_img_url':''});}}><DeleteOutlineOutlinedIcon/></span>}
                    </div>
                    <div className='flex  gap-3 items-center'>
                        <span className="font-semibold text-lg">User Name</span>
                        <span>
                        {editProfile ?
                            <input
                                name="user_name"
                                value={userData?.user_name}
                                type="text"
                                className="border-2 border-zinc-400 rounded pl-2 p-1"
                                size={24}
                                placeholder="User name"
                                onChange={changeHandler}
                            ></input>
                            : <span className='pl-2 p-1'>{userData?.user_name}</span>
                        }
                        </span>
                    </div>
                    <div className='flex gap-3 items-center '>
                        <span className="font-semibold text-lg">User Email</span>
                        <span>
                        {editProfile ?
                            <input
                                name="email"
                                value={userData?.email}
                                type="email"
                                className="border-2 border-zinc-400 rounded pl-2 p-1"
                                size={24}
                                placeholder="xyz@gmail.com"
                                onChange={changeHandler}
                            ></input>
                            : <span className='pl-2 p-1'>{userData?.email}</span>
                        }
                        </span>
                    </div>
                    <div>
                        <span className='text-lg font-semibold underline'>Saved Address</span>
                        {
                            (userData?.address || editProfile) ?
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-row flex-wrap'>
                                        <span className='w-28 font-semibold'>address</span>
                                        <span>:&nbsp;</span>
                                        {editProfile ?
                                            <input
                                                name="address"
                                                value={userData?.address?.address}
                                                type="text"
                                                className="border-2 border-zinc-400 rounded pl-2 p-1 flex-1"
                                                placeholder=""
                                                onChange={changeAddressHandler}
                                            ></input>
                                            : <span className='flex-1 whitespace-break-spaces'>{userData?.address?.address}</span>
                                        }
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='w-28 font-semibold'>state</span>
                                        <span>:&nbsp;</span>
                                        {editProfile ?
                                            <input
                                                name="state"
                                                value={userData?.address?.state}
                                                type="text"
                                                className="border-2 border-zinc-400 rounded pl-2 p-1 flex-1"
                                                placeholder=""
                                                onChange={changeAddressHandler}
                                            ></input>
                                            : <span className='flex-1 whitespace-break-spaces'>{userData?.address?.state}</span>
                                        }
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='w-28 font-semibold'>country</span>
                                        <span>:&nbsp;</span>
                                        {editProfile ?
                                            <input
                                                name="country"
                                                value={userData?.address?.country}
                                                type="text"
                                                className="border-2 border-zinc-400 rounded pl-2 p-1 flex-1"
                                                placeholder=""
                                                onChange={changeAddressHandler}
                                            ></input>
                                            : <span className='flex-1 whitespace-break-spaces'>{userData?.address?.country}</span>
                                        }
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='w-28 font-semibold'>pin code</span>
                                        <span>:&nbsp;</span>
                                        {editProfile ?
                                            <input
                                                name="pin_code"
                                                value={userData?.address?.pin_code}
                                                type="text"
                                                className="border-2 border-zinc-400 rounded pl-2 p-1 flex-1"
                                                placeholder=""
                                                onChange={changeAddressHandler}
                                            ></input>
                                            : <span className='flex-1 whitespace-break-spaces'>{userData?.address?.pin_code}</span>
                                        }
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='w-28 font-semibold'>phone number</span>
                                        <span>:&nbsp;</span>
                                        {editProfile ?
                                            <input
                                                name="phone_number"
                                                value={userData?.address?.phone_number}
                                                type="text"
                                                className="border-2 border-zinc-400 rounded pl-2 p-1 flex-1"
                                                placeholder=""
                                                onChange={changeAddressHandler}
                                            ></input>
                                            : <span className='flex-1 whitespace-break-spaces'>{userData?.address?.phone_number}</span>
                                        }
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='w-28 font-semibold'>receiver name</span>
                                        <span>:&nbsp;</span>
                                        {editProfile ?
                                            <input
                                                name="receiver_name"
                                                value={userData?.address?.receiver_name}
                                                type="text"
                                                className="border-2 border-zinc-400 rounded pl-2 p-1 flex-1"
                                                placeholder=""
                                                onChange={changeAddressHandler}
                                            ></input>
                                            : <span className='flex-1 whitespace-break-spaces'>{userData?.address?.receiver_name}</span>
                                        }
                                    </div>
                                </div>
                                :
                                <span className='flex items-center justify-center'>-- No address saved --</span>
                        }
                    </div>
                </div>
                <div className='flex justify-end'>
                    <span className={`px-3 py-1 rounded-lg cursor-pointer text-white ${editProfile ? "bg-green-500" : "bg-blue-500"}`} onClick={() => {editProfile ? saveProfile(): setEditProfile(!editProfile)}}>{editProfile ? "Save" : "Edit"}</span>
                </div>
            </div>
        </div>
    )
}

export default ManageProfile
