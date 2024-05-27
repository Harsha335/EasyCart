// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import 'firebase/compat/auth';

// import {firebase } from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCO-hzod43yrQ7IhiSqs1BrJN-87gKsSDA",
  authDomain: "easycart-515.firebaseapp.com",
  projectId: "easycart-515",
  storageBucket: "easycart-515.appspot.com",
  messagingSenderId: "1005712083593",
  appId: "1:1005712083593:web:6e74ef6b3f9e3d33415458"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
// const firebaseApp = firebase.initializeApp(firebaseConfig);
// const db = firebaseApp.firestore;
// const auth = firebaseApp.auth();

export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };
export default app;
// export default db; 