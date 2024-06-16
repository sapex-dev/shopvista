import { unauthenticatedInstance } from "../../utils/axios-instance";

export const loginApi = async (data) => {
  try {
    const response = await unauthenticatedInstance.post("/login", data);
    // console.log("🚀 ~ adminLogin ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in login: ", error);
    throw new Error(error.message);
  }
};

export const registerApi = async (data) => {
  try {
    const response = await unauthenticatedInstance.post("/signup", data);
    // console.log("🚀 ~ registerApi ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in register: ", error);
    throw new Error(error.message);
  }
};

export const confirmEmailApi = async (data, email) => {
  try {
    const response = await unauthenticatedInstance.post("/verify-otp", {
      email: email,
      otp: data.otp,
    });
    // console.log("🚀 ~ confirmEmailApi ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in confirmEmailApi: ", error);
    throw new Error(error.message);
  }
};

export const resendOtpApi = async (data) => {
  try {
    const payload = { email: data };
    const response = await unauthenticatedInstance.post(
      "/resend-verify-otp",
      payload
    );
    // console.log("🚀 ~ resendOtpApi ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in resendOtpApi: ", error);
    throw new Error(error.message);
  }
};

export const forgotPassApi = async (data) => {
  try {
    // const payload = { email: data };
    const response = await unauthenticatedInstance.post(
      "/forgot-password",
      data
    );
    // console.log("🚀 ~ resendOtpApi ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in resendOtpApi: ", error);
    throw new Error(error.message);
  }
};

export const resetPassApi = async (data, jwtToken) => {
  try {
    console.log("🚀 ~ resetPassApi ~ jwtToken:", jwtToken)
    const payload = {
      token: jwtToken,
      password: data.password,
      confirmpassword: data.confirmpassword,
    };
    console.log("🚀 ~ resetPassApi ~ payload:", payload)
    const response = await unauthenticatedInstance.post(
      "/reset-password",
      payload
    );
    console.log("🚀 ~ resetPassApi ~ response:", response)
    return response;
  } catch (error) {
    console.log("error in resendOtpApi: ", error);
    throw new Error(error.message);
  }
};
