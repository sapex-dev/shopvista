import { authenticatedInstance } from "../../utils/axios-instance";

export const getWallet = async () => {
  try {
    const response = await authenticatedInstance.get("wallet");
    // console.log("🚀 ~ getWal ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in get wallet : ", error);
    throw new Error(error.message);
  }
};

export const getWalletTransaction = async () => {
  try {
    const response = await authenticatedInstance.get("transection");
    console.log("🚀 ~ getWalletTransaction ~ response:", response)
    return response;
  } catch (error) {
    console.log("error in get wallet transaction : ", error);
    throw new Error(error.message);
  }
};
