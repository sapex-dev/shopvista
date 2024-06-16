import { authenticatedInstance } from "../../utils/axios-instance";

export const getFAQs = async () => {
  try {
    const response = await authenticatedInstance.get("faq");
    console.log("🚀 ~ getWal ~ response:", response);
    return response.data?.data;
  } catch (error) {
    console.log("error in get faq : ", error);
    throw new Error(error.message);
  }
};
