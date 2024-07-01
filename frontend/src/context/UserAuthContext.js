import { createContext, useContext } from "react";
// import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
// import { auth } from "../assets/firebase";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { addUserDetails, removeUserDetails } from "../redux/reducer/UserSlice";
import {axiosInstance} from "../Api_calls/API";

const userAuthContext = createContext();

export function UserAuthContextProvider({children}){
    // const [user,setUser]=useState(localStorage.getItem("user"));
    const dispatch = useDispatch();

    // setUser(localStorage.getItem("userEmail"));
    const encryptData = (name, data)=> {
        const encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_SECRET_KEY).toString();
        localStorage.setItem(name, encrypt);
        // setUser(encrypt);
    }
    const decryptData = (name) => {
        
        const encrypted = localStorage.getItem(name);
        const decrypted = CryptoJS.AES.decrypt(encrypted, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    }

    async function getUserDetails()
    {
        try{
            const id = decryptData("user")?.split(" ")[2];
            console.log(decryptData("user"));
            console.log("id::",id);
            if(!id)
                return;
            // console.log("userDetails : ",decryptData("user"));
            const res = await axiosInstance.get(`/api/users/find/${id}`);
            console.log("getting userDetails : ",res);
            const { email, isAdmin, likedProductIds} = res.data?.data;
            dispatch(addUserDetails({email, isAdmin, likedProductIds}));
        }catch(err){
            console.log("ERROR @ UserAuthContext/getUserDetails : ",err);
            if(err.response?.status === 401) // TOKEN EXPIRED
            {
                console.log(`${process.env.REACT_APP_CLIENT_URL}/login`);
                window.location.href = `/login`;
            }
        }
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
            throw new Error(error?.response?.data?.message);
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
                console.log("login : ",res);
                const {id, email, isAdmin, accessToken, refreshToken, likedProductIds} = res.data;
                dispatch(addUserDetails({email, isAdmin, likedProductIds}));
                // localStorage.removeItem("user");
                encryptData("user", email+" "+isAdmin+" "+id);
                // console.log(decryptData("user"));
                // localStorage.removeItem("accessToken");
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
            }catch(error){
                console.log("ERROR @ userlogin : ", error);
            }
            // }
            // userLogin(emailId,password);
    }
    function logOut(){
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(removeUserDetails());
        // setUser(null);
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
        <userAuthContext.Provider value = {{logIn,signUp,logOut,googleSignIn,encryptData,decryptData, getUserDetails}}>
            {children}
        </userAuthContext.Provider>
    )
}

export function useUserAuth(){
    return useContext(userAuthContext);
}