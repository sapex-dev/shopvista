import { authenticatedInstance } from "../../utils/axios-instance";

export const getCart = async (token) => {
  try {
    const response = await authenticatedInstance.get("cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("response:", response);

    return response.data;
  } catch (error) {
    console.log("error in get cart: ", error);
    if (error.responce.status === 404) {
      return;
    }
    throw new Error(error.message);
  }
};

export const addProductInCart = async (data, token) => {
  // try {
  const response = await authenticatedInstance.post("cart", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("🚀 ~ addProductInCart ~ response:", response);
  return response;
  // } catch (error) {
  //   console.log("error in add product in cart Brnad : ", error);
  //   throw new Error(error.message);
  // }
};

export const updateQuantity = async (data, itemId, token) => {
  console.log("id", itemId);
  const response = await authenticatedInstance.put(`cart/${itemId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("response in quantity update:", response);
  return response;
};

export const deleteCartItem = async (data) => {
  try {
    const { productId, colorId, sizeId } = data;
    const response = await authenticatedInstance.delete(
      `cart/remove/${productId}/${colorId}/${sizeId}`
    );
    return response;
  } catch (error) {
    console.log("error in Delete cart item : ", error);
    throw new Error(error.message);
  }
};

export const clearCart = async () => {
  try {
    const response = await authenticatedInstance.delete("cart");
    console.log("response:", response);
    return response;
  } catch (error) {
    console.log("error in clear cart : ", error);
    throw new Error(error.message);
  }
};
