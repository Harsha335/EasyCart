import React, { useEffect, useState } from "react";
import registerIcon from "../assets/images/register.jpg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
// import { auth } from "../assets/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
// import { db } from "../assets/firebase";
// import { collection, addDoc, doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [userData,setUserData]=useState({userEmail:"",password:"",rePassword:""});
  const {userEmail,password,rePassword}=userData;
  const [error,setError]=useState("");
  const navigate=useNavigate();

  const changeHandler = e => {
    setUserData({...userData,[e.target.name]:e.target.value});
  }

  const [visible, setVisible] = useState(false);
  const visibility = () => {
    setVisible(!visible);
  };

  const {signUp}=useUserAuth();
  useEffect(()=>{
    if(password !== rePassword){
      setError("Password does not match!");
    }else{
      setError("");
    }
  },[rePassword]);
  const handleRegister= async (e)=>{
    e.preventDefault();
    // setError("");
    if(userEmail.trim().length === 0){
      setError("Please enter email");
      return;
    }else{
      setError("");
    }
    if(error !== "")
    {
      // setError("Password does not match!");
      return;
    }
    try{
      // await signUp(userEmail,password);
      // // NOT USED GIVEN USER ID
      // await addDoc(collection(db,"users"),{
      //   Email:userEmail,
      //   Password:password
      // });
      await signUp(userEmail,password);
      // const user = userCredential.user;
      // const userRef = doc(db, "users", user.uid);
      // await setDoc(userRef, {
      //   Email:userEmail,
      //   Password:password
      // });
    
      navigate("/");
    }
    catch(err){
      setError(err.message);
    }
  }
  // const handleRegister=(e)=>{
  //   e.preventDefault();
  //   auth.createUserWithEmailAndPassword(userEmail,password).then(user=>console.log(user)).catch(err=>console.log(err));
  // }
  return (
    <div className="m-0 p-0 flex items-center justify-center w-[100vw] h-[100vh] bg-slate-200">
      <div className="w-[70svw] h-[90svh] bg-white text-white rounded-lg flex flex-row">
        <img src={registerIcon} width="60%"></img>
        <div className="text-black flex flex-col justify-around my-20  ">
          <span className="flex flex-col">
            <div>
              <div className="text-red-500">{error && error}</div>
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
            <div className="mt-5">
              <span className="flex flex-row justify-between px-1">
                <span className="font-ubuntu text-lg ">Confirm Password</span>
                <span className="cursor-pointer" onClick={() => visibility()}>
                  {!visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  {/* {!visible && } */}
                </span>
              </span>
              <div>
                <input
                  name="rePassword"
                  value={rePassword}
                  type={visible ? "text" : "password"}
                  className="bg-black rounded pl-2 p-1 text-white"
                  size={30}
                  placeholder="password"
                  onChange={changeHandler}
                ></input>
              </div>
            </div>
            <span className="flex flex-row justify-end">
              <button className="mt-10  text-white rounded-full px-4 py-2 bg-blue-800 p-2 cursor-pointer text-center hover:shadow-md hover:shadow-indigo-500/50" onClick={handleRegister}>
                Register
              </button>
            </span>
          </span>
          <div>
            Back to login
            <Link
              className="underline mx-1 cursor-pointer group hover:text-orange-600 transition duration-300 md:py-5"
              to={"/login"}
            >
              sign-in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
