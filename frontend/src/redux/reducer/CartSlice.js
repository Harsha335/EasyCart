import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems : [],
    quantity : 0    // total products added to cart
}
const cartReducer = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart : (state, action) => {
            const {productId, quantity} = action.payload;
            let isFound = false;
            console.log("cart payload: ",action.payload);
            state.cartItems = state.cartItems.map((product) => {
                if(product.productId === productId){
                    product.quantity = quantity;
                    isFound = true;
                }
                return product;
            });
            if(isFound === false){
                state.cartItems.push({productId, quantity});
                state.quantity += 1;
            }
            console.log("cart slice : ",state.cartItems);
        },
        removeFromCart : (state, action) => {
            const {productId} = action.payload;
            state.cartItems = state.cartItems.filter((product) => product.productId !== productId);
            state.quantity -= 1;
        },
        removeAll : (state, action) => {
            state.cartItems = [];
            state.quantity = 0;
        }
    }
});

export const {addToCart, removeFromCart, removeAll} = cartReducer.actions;
export default cartReducer.reducer;