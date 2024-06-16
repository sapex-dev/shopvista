import { authenticatedInstance } from "../../utils/axios-instance";

export const getWishList = async () => {
  try {
    console.log("getWishList");
    const response = await authenticatedInstance.get("wishlist");
    console.log("response:", response);
    return response.data;
  } catch (error) {
    console.log("error in get wishlist: ", error);
    throw new Error(error.message);
  }
};

export const addProductInWishlist = async (data) => {
  try {
    const response = await authenticatedInstance.post("wishlist", data);
    console.log("response:", response);
    return response;
  } catch (error) {
    console.log("error in add product in wishlist : ", error);
    throw new Error(error.message);
  }
};

export const deleteWishlistItem = async (id) => {
  try {
    const response = await authenticatedInstance.delete(`wishlist/${id}`);
    console.log("response:", response);
    return response;
  } catch (error) {
    console.log("error in Delete wishlist item : ", error);
    throw new Error(error.message);
  }
};
