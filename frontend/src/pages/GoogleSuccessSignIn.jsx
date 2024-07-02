import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addUserDetails } from "../redux/reducer/UserSlice";
import { useUserAuth } from '../context/UserAuthContext';

const GoogleSuccessSignIn = () => {
    const dispatch = useDispatch();
    const {encryptData} = useUserAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const user = {
            id: params.get('id'),
            email: params.get('email'),
            isAdmin: params.get('isAdmin') === 'true',
            likedProductIds: params.get('likedProductIds'),
            accessToken: params.get('accessToken'),
            refreshToken: params.get('refreshToken')
        };

        if (user.accessToken && user.refreshToken) {
            // Save user details in local storage or state
            encryptData("user", user?.email+" "+user?.isAdmin+" "+user?.id);
            localStorage.setItem("accessToken", user.accessToken);
            localStorage.setItem("refreshToken", user.refreshToken);

            // Dispatch user details to state if using a state management library
            dispatch(addUserDetails({
                email: user.email,
                isAdmin: user.isAdmin,
                likedProductIds: user.likedProductIds
            }));

            // Redirect to the home page or desired location
            window.location.href = '/';
        }
    }, [dispatch]);

    return <div>Loading...</div>;
};

export default GoogleSuccessSignIn;
