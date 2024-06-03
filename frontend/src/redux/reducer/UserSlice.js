import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userDetails : null  //  email, isAdmin, likedProductIds
}
const UserSlice = createSlice({
    name : "user details",
    initialState,
    reducers: {
        addUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
        removeUserDetails: (state, action) => {
            console.log(state.userDetails);
            state.userDetails = null;
            console.log(state.userDetails);
        },
        // added liked products
        addLikedProduct: (state, action) => {
            const {productId} = action.payload;
            if(!state.userDetails.likedProductIds.includes(productId)){
                state.userDetails.likedProductIds.push(productId);
            }
            console.log(state.userDetails);
        },
        // remove liked products
        removeLikedProduct: (state, action) => {
            const {productId} = action.payload;
            const index = state.userDetails.likedProductIds.indexOf(productId);
            if(index !== -1){
                state.userDetails.likedProductIds.splice(index, 1);
            }
            console.log(state.userDetails);
        }
    }
});

export const {addUserDetails, removeUserDetails, addLikedProduct, removeLikedProduct} = UserSlice.actions;
export default UserSlice.reducer;