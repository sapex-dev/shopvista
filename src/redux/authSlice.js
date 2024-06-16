import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token") || null
      : null,
  email: null,
  name: null,
  role: null,
  wallet: null,
};

export const adminAuthSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLogin: (state, { payload }) => {
      localStorage.setItem("token", payload.token);
      state.token = payload.token;
      state.email = payload.email;
      state.role = payload.role;
      state.name = payload.name;
    },
    setLogout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.wallet = null;
    },
    setWallet: (state, { payload }) => {
      state.wallet = payload;
    },
  },
});

export const { setLogin, setLogout, setWallet } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
