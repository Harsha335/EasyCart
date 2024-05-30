import React from 'react'
import { Navigate } from 'react-router-dom';
import { useUserAuth } from './context/UserAuthContext';

const ProtectedRoute = ({children}) => {
    const {user}=useUserAuth();
    console.log("ProtectedRoute, user:", user);
    if(user === null)
    {
        return <Navigate to="/login"/>
    }
    console.log(children);
  return children;
}

export default ProtectedRoute;
