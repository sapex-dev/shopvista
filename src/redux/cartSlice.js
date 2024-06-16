import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numOfCartItems: null,
  cartItems: [],
  totalCartPrice: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, { payload }) => {
      state.numOfCartItems = payload.numOfCartItems;
      state.cartItems = payload.cartItems;
      state.totalCartPrice = payload.totalCartPrice;
    },
    setClearCart: (state) => {
      state.numOfCartItems = null;
      state.cartItems = [];
      state.totalCartPrice = null;
    },
  },
});

export const { setCart, setClearCart } = cartSlice.actions;
export default cartSlice.reducer;
