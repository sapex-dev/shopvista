import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./adminAuthSlice";
// import adminReducer from "./adminAuthSlice";
import cartReducer from "./cartSlice";
import wishListReducer from "./wishlistSlice";
import addressReducer from "./addressSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // admin: adminReducer,
    cart: cartReducer,
    wishlist: wishListReducer,
    address: addressReducer,
  },
});

export default store;
