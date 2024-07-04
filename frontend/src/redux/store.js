import {configureStore} from "@reduxjs/toolkit";
import CartReducer from "./reducer/CartSlice";
import UserReducer from "./reducer/UserSlice";
// REDUX PERSIST
import storage from "redux-persist/lib/storage";
import {persistReducer} from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
    key: 'root',
    version: 1,
    storage
};
const reducer = combineReducers({
    cartReducer : CartReducer,
    userReducer : UserReducer,
});
const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer
});