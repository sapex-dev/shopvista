import { authenticatedInstance } from "../../utils/axios-instance";

export const placeOrder = async (
  address,
  paymentMethodType,
  token,
  orderId
) => {
  try {
    const data = {
      shippingAddress: address,
      paymentMethodType: paymentMethodType,
      orderId: orderId,
    };
    console.log("🚀 ~ placeOrder ~ data:", data);
    const response = await authenticatedInstance.post("order", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("🚀 ~ placeOrder ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in place order : ", error);
    throw new Error(error.message);
  }
};

export const allOrders = async () => {
  try {
    const response = await authenticatedInstance.get("order/all");
    console.log("🚀 ~ allOrders ~ response:", response);
    return response?.data?.data;
  } catch (error) {
    console.log("error in getting all order data: ", error);
    throw new Error(error.message);
  }
};

export const getSingleOrder = async (orderId) => {
  try {
    const response = await authenticatedInstance.get(`order/${orderId}`);
    console.log("🚀 ~ getSingleOrder ~ response:", response?.data?.data);
    return response?.data?.data;
  } catch (error) {
    console.log("error in getting all order data: ", error);
    throw new Error(error.message);
  }
};

export const cancelOrders = async (orderId) => {  
  console.log("🚀 ~ cancelOrders ~ orderId:", orderId)
  try {
    const response = await authenticatedInstance.post(`order/${orderId}`);
    return response?.data?.data;
  } catch (error) {
    console.log("error in cancel order: ", error);
    throw new Error(error.message);
  }
};
