import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from './context/UserAuthContext';

const ProtectedAdminRoute = ({children}) => {
    const {getUserDetails} = useUserAuth();
    const user = useSelector(store => store.userReducer.userDetails);
    console.log("ProtectedAdminRoute, user:", user);
    // if(!localStorage.getItem("user"))
    //     return <Navigate to ="/logIn"/>
    if(user === null)
    {
      if(localStorage.getItem("user")){
        console.log("protected admin getUser");
        getUserDetails();
        return;
      }else
        return <Navigate to="/login"/>
    }

    const isAdmin = user.isAdmin;
    console.log("isAdmin : ",isAdmin);
    if(isAdmin === "false"){
        return <Navigate to = "/"/>
    }
    return children;
}

export default ProtectedAdminRoute
