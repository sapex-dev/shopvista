import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numOfWishlistItems: null,
  wishlistItems: [],
};

export const wishListSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, { payload }) => {
      console.log("payload", payload);
      state.numOfWishlistItems = payload.numOfWishlistItems;
      state.wishlistItems = payload.wishlistItems;
    },
    // setLogout: (state) => {
    //   state.token = null;
    //   state.email = null;
    //   state.role = null;
    // },
  },
});

export const { setWishlist } = wishListSlice.actions;
export default wishListSlice.reducer;
