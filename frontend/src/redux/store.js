import {configureStore} from "@reduxjs/toolkit";
import CartReducer from "./reducer/CartSlice";
import UserReducer from "./reducer/UserSlice";

export const store = configureStore({
    reducer: {
        cartReducer : CartReducer,
        userReducer : UserReducer,
    }
});