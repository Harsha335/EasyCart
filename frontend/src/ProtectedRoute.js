import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from './context/UserAuthContext';

const ProtectedRoute = ({children}) => {
    const {getUserDetails}=useUserAuth();
    const user = useSelector(store => store.userReducer.userDetails);
    console.log("ProtectedRoute, user:", user);
    // if(!localStorage.getItem("user"))
    //   return <Navigate to ="/logIn"/>
    if(user === null)
    {
      if(localStorage.getItem("user")){
        console.log("protected getUser");
        getUserDetails();
        return;
      }else
        return <Navigate to="/login"/>
    }
    // console.log(children);
  return children;
}

export default ProtectedRoute;
