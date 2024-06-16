import { authenticatedInstance } from "../../utils/axios-instance";

export const getAddress = async (token) => {
  try {
    const response = await authenticatedInstance.get("address", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data;
  } catch (error) {
    console.log("error in get address: ", error);
    throw new Error(error.message);
  }
};

export const addAddress = async (data) => {
  try {
    const response = await authenticatedInstance.post("address", data);
    console.log("response:", response);
    return response;
  } catch (error) {
    console.log("error in add address : ", error);
    throw new Error(error.message);
  }
};

export const deleteAddress = async (id) => {
    try {
      const response = await authenticatedInstance.delete(`address/${id}`);
      console.log("response:", response);
      return response;
    } catch (error) {
      console.log("error in Delete address : ", error);
      throw new Error(error.message);
    }
  };
