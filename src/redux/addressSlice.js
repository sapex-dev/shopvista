import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedAddress: {},
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, { payload }) => {
      console.log("payload", payload);
      state.selectedAddress = payload;
    },
    setClearAddress: (state) => {
      state.selectedAddress = {};
    },
  },
});

export const { setAddress, setClearAddress } = addressSlice.actions;
export default addressSlice.reducer;
