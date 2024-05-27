import { createContext, useContext, useEffect, useState } from "react";
// import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
// import { auth } from "../assets/firebase";
import axios from "axios";
import CryptoJS from "crypto-js";

const userAuthContext = createContext();

export function UserAuthContextProvider({children}){
    const [user,setUser]=useState(localStorage.getItem("user"));
    // setUser(localStorage.getItem("userEmail"));
    const encryptData = (name, data)=> {
        const encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_SECRET_KEY).toString();
        localStorage.setItem(name, encrypt);
        setUser(encrypt);
    }
    const decryptData = (name) => {
        const encrypted = localStorage.getItem(name);
        const decrypted = CryptoJS.AES.decrypt(encrypted, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    }

    async function signUp(emailId,password)
    {
        // return createUserWithEmailAndPassword(auth,email,password);
        try{
            // console.log(emailId, password);
            // console.log("sending req to: ", `${process.env.REACT_APP_SERVER_URL}/api/auth/login`);
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/register`, {"email": emailId, password});
            console.log(res);
            // const {email, isAdmin, accessToken} = res.data;
            // encryptData("user", email+" "+isAdmin);
            // console.log(decryptData("user"));
            // localStorage.setItem("accessToken", accessToken);
        }catch(error){
            console.log("ERROR @ userSignup : ", error);
        }
    }
    async function logIn(emailId,password)
    {
        // return signInWithEmailAndPassword(auth,email,password);
        // const userLogin = async (emailId,password) => {
            try{
                // console.log(emailId, password);
                // console.log("sending req to: ", `${process.env.REACT_APP_SERVER_URL}/api/auth/login`);
                const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, {"email": emailId, password});
                // console.log(res);
                const {email, isAdmin, accessToken} = res.data;
                encryptData("user", email+" "+isAdmin);
                // console.log(decryptData("user"));
                localStorage.setItem("accessToken", accessToken);
            }catch(error){
                console.log("ERROR @ userlogin : ", error);
            }
        // }
        // userLogin(emailId,password);
    }
    function logOut(){
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        setUser(null);
    }
    function googleSignIn(){
        // const googleAuthProvider = new GoogleAuthProvider();
        // return signInWithPopup(auth,googleAuthProvider);
    }
    // useEffect(()=>{
    //     const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
    //         setUser(currentUser);
    //         localStorage.setItem("user",currentUser);
    //     });
    //     return ()=>{unsubscribe()};
    // },[]);

    return (
        <userAuthContext.Provider value = {{user,logIn,signUp,logOut,googleSignIn,encryptData,decryptData}}>
            {children}
        </userAuthContext.Provider>
    )
}

export function useUserAuth(){
    return useContext(userAuthContext);
}