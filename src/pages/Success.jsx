import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleOrder, placeOrder } from "../services/order/orderAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setClearCart } from "../redux/cartSlice";

const Success = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orderId = localStorage.getItem("orderId");
  console.log("🚀 ~ Success ~ orderId:", orderId);
  const address = useSelector((state) => state.address.selectedAddress);
  const token = useSelector((state) => state.auth.token);
  const paymentMethodType = "card";

  const { isSuccess, data } = useQuery({
    queryKey: ["placeOrder"],
    queryFn: () => getSingleOrder(orderId),
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  // <---------- Place Order ---------------->
  // const { mutate: mutateOrder } = useMutation({
  //   mutationFn: (params) => {
  //     const { address, paymentMethodType } = params;
  //     console.log("🚀 ~ file: Cart.jsx:23 ~ Cart ~ data:", address);
  //     console.log("🚀 ~ file: Cart.jsx:23 ~ Cart ~ itemId:", paymentMethodType);
  //     return placeOrder(address, paymentMethodType, token , orderId);
  //   },
  //   onSuccess: (response) => {
  //     console.log("response", response);
  //     toast.success("Order Placed Successfully ✅");
  //     queryClient.invalidateQueries("allCart");

  //     dispatch(setClearCart());
  //     navigate("/order");
  //     // setShowForm(false);
  //     // onCloseAddBrandModal();
  //   },
  //   onError: (error) => {
  //     console.log("error", error);
  //     toast.error(error.message);
  //   },
  // });

  // const handlePlaceOrder = () => {
  //   if (address !== null) {
  //     mutateOrder(address, paymentMethodType);
  //   } else {
  //     toast.error("Please select Payment method.");
  //   }
  // };

  if (isSuccess) {
    if (data === "complete") {
      queryClient.invalidateQueries("allCart");
      queryClient.invalidateQueries("allCart");

      dispatch(setClearCart());
      navigate("/order");
    }
  }

  return <div>Success</div>;
};

export default Success;
