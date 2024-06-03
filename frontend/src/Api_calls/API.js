import axios from 'axios';
import CryptoJS from "crypto-js";
// import { useUserAuth } from '../context/UserAuthContext';
// const { decryptData } = useUserAuth();
const decryptData = (name) => {
    // console.log("salt");
    const encrypted = localStorage.getItem(name);
    // console.log(encrypted);
    if(encrypted === null){
        return;
    }
    const decrypted = CryptoJS.AES.decrypt(encrypted, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
}
console.log("accessToken1 ",localStorage.getItem("accessToken"));

// Create an instance of Axios with default settings
const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`
});

// Add a request interceptor to include the latest token and user ID
axiosInstance.interceptors.request.use(
    (config) => {
        // Update headers with the latest localStorage values
        const token = localStorage.getItem("accessToken");  
        // NOTE: IF WE USE LOCAL_STORAGE DIRECTLY IT WILL NOT UPDATE SO WE USE interceptors.request. TO UPDATE ON EVERY REQUEST
        const user = decryptData("user");
        const userId = user ? user.split(" ")[2] : null;

        if (token) {
            config.headers['token'] = `Bearer ${token}`;
        }
        if (userId) {
            config.headers['id'] = userId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { axiosInstance };