import { authenticatedInstance } from "../../utils/axios-instance";

// export const allProducts = async () => {
//   try {
//     const response = await authenticatedInstance.get("product");
//     // console.log("🚀 ~ allProducts ~ response:", response);
//     return response?.data?.data;
//   } catch (error) {
//     console.log("error in getting all Product data: ", error);
//     throw new Error(error.message);
//   }
// };

export const getProductEdit = async (id) => {
  try {
    const response = await authenticatedInstance.get(`product/${id}`);
    console.log("🚀 ~ getProductEdit ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in update product : ", error);
    throw new Error(error.message);
  }
};

// export const filterProduct = async (minPrice, maxPrice) => {
//   try {
//     const response = await authenticatedInstance.get(
//       `product/filter${`min=${minPrice}&max=${maxPrice}`}`
//     );
//     console.log("🚀 ~ filterProduct ~ response:", response);
//     return response?.data?.data;
//   } catch (error) {
//     console.log("error in filter products: ", error);
//     throw new Error(error.message);
//   }
// };

export const products = async ( ) => {
  
  

  try {
    const response = await authenticatedInstance.get("product");
    

    return response.data?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};
