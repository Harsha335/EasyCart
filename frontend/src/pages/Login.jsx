import React, { useState } from "react";
import loginIcon from "../assets/images/login.jpg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../assets/firebase";
// import { FcGoogle } from 'react-icons/fc';
import GoogleButton from 'react-google-button'
import { useUserAuth } from "../context/UserAuthContext";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../assets/firebase";
// import { GoogleAuthProvider } from "firebase/auth";


const Login = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [userData,setUserData]=useState({userEmail:"",password:""});
  const {userEmail,password}=userData;
  const [error,setError]=useState("");
  
  const changeHandler = e => {
    setUserData({...userData,[e.target.name]:e.target.value});
  }
  const visibility = () => {
    setVisible(!visible);
  };
  const { logIn,googleSignIn} = useUserAuth();
  const handleLogin = async (e)=>{
    e.preventDefault();
    setError("");
    try{
      // localStorage.setItem("userEmail",userEmail);
      // localStorage.setItem("userPassword",password);
      await logIn(userEmail,password);
      // console.log("loged in : user", user);
      navigate("/");
    }
    catch(err){
      setError(err.message);
    }
  }
  const handleGoogleSignIn= async (e)=>{
    e.preventDefault();
    setError("");
    try{
      // const result = await googleSignIn();
      // The signed-in user info.
      // const user = result.user;
      // localStorage.setItem("userEmail",user.email);
      // const userRef = doc(db, "users", user.uid);
      // await setDoc(userRef, {
      //   Email:user.email,
      //   Password:""
      // });
      // console.log(user);
      // await addDoc(collection(db,"users"),{
      //     Email:user.email,
      //     Password:""
      //   });
      navigate("/");
    }
    catch(err)
    {
      setError(err.message);
    }
  }
  // const handleLogin=(e)=>{
  //   e.preventDefault();
  //   auth.signInWithEmailAndPassword(userEmail,password).then(()=>navigate("/")).catch(err=>alert(err));
  // }
  return (
    <div className="m-0 p-0 flex items-center justify-center w-[100vw] h-[100vh] bg-slate-200">
      <div className="w-[70svw] h-[90svh] bg-white text-white rounded-lg flex flex-row">
        <img src={loginIcon} width="60%"></img>
        <div className="text-black flex flex-col justify-around my-20  ">
          <span className="flex flex-col">
            <div>
            <div className="p-0 m-0 text-red-500">
              {error && error}
              </div>
              <span className="font-ubuntu text-lg px-1">User Email</span>
              <div>
                <input
                  name="userEmail"
                  value={userEmail}
                  type="email"
                  className="bg-black rounded pl-2 p-1 text-white"
                  size={30}
                  placeholder="xyz@gmail.com"
                  onChange={changeHandler}
                ></input>
              </div>
            </div>
            <div className="mt-5">
              <span className="flex flex-row justify-between px-1">
                <span className="font-ubuntu text-lg ">Password</span>
                <span className="cursor-pointer" onClick={() => visibility()}>
                  {!visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  {/* {!visible && } */}
                </span>
              </span>
              <div>
                <input
                  name="password"
                  value={password}
                  type={visible ? "text" : "password"}
                  className="bg-black rounded pl-2 p-1 text-white"
                  size={30}
                  placeholder="password"
                  onChange={changeHandler}
                ></input>
              </div>
            </div>
            <span className="flex flex-row justify-end">
              <div className=" mt-10  text-white rounded-full bg-blue-800 px-4 py-2 cursor-pointer text-center hover:shadow-md hover:shadow-indigo-500/50" onClick={handleLogin}>
                Login
              </div>
            </span>
          </span>
          {/* <div><FcGoogle size = '1.4em'/> </div> */}
          <div><GoogleButton onClick={handleGoogleSignIn}/></div>
          <div>
            Don't have a account?
            <Link
              className="underline mx-1 cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5"
              to={"/register"}>
              register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
