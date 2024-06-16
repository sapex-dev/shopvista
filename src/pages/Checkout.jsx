import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { IoMdWallet } from "react-icons/io";
import { IoMdCash } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCartItem, updateQuantity } from "../services/Cart/cartAPI";
import toast from "react-hot-toast";
import { placeOrder } from "../services/order/orderAPI";
import { setClearCart } from "../redux/cartSlice";
import { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  CardElement,
  useStripe,
  Elements,
  useElements,
} from "@stripe/react-stripe-js";
import AddWalletModal from "../components/addWalletModal";
import { FaRegCreditCard } from "react-icons/fa";

const Checkout = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartData = useSelector((state) => state.cart.cartItems);
  const totalCartPrice = useSelector((state) => state.cart.totalCartPrice);
  const address = useSelector((state) => state.address.selectedAddress);
  const token = useSelector((state) => state.auth.token);
  const amount = useSelector((state) => state.auth.wallet);
  const [paymentMethodType, setPaymentMethodType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [addAmount, setAddAmount] = useState(0);
  const publishableKey =
    "pk_test_51LzxA5SHOUlzFrbDsa8XwGpBwoHgKqkyQ8nMfnchut72i1XxyuhKivj9HKbQD3rodrEl80ss2WtXbWFc8E2sFINO00XWTlL38s";
  // const [stripePromise, setStripePromise] = useState(null);

  // useState(() => {
  //   const stripePromise = loadStripe(publishableKey);
  //   setStripePromise(stripePromise);
  // }, []);

  useEffect(() => {
    setPaymentMethodType(null);
  }, [cartData]);

  const stripe = useStripe();
  const elements = useElements();

  // Calculate if wallet amount is less than total cart price
  const isWalletDisabled = amount < totalCartPrice;

  // Remove Specific Cart Item
  const { mutate: removeItem } = useMutation({
    mutationFn: (data) => deleteCartItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries("allCart");
      toast.success("Item Removed Successfully");
    },
  });

  const removeCartItem = (item) => {
    console.log("🚀 ~ removeCartItem ~ itemId:", item);
    const removeData = {
      productId: item.product?._id,
      colorId: item.color?._id,
      sizeId: item.size?._id,
    };
    console.log("🚀 ~ removeCartItem ~ removeData:", removeData);

    removeItem(removeData);
  };

  // Make the API call with the updated quantity
  const { mutate } = useMutation({
    mutationFn: (params) => {
      const { data, itemId } = params;
      console.log("🚀 ~ file: Cart.jsx:23 ~ Cart ~ data:", data);
      console.log("🚀 ~ file: Cart.jsx:23 ~ Cart ~ itemId:", itemId);
      return updateQuantity(data, itemId, token);
    },
    onSuccess: (response) => {
      setPaymentMethodType(null);
      console.log("response", response);
      toast.success("Quantity Updated Successfully");
      queryClient.refetchQueries("allCart");
      // onCloseAddBrandModal();
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.response?.data?.message);
    },
  });

  const onSubmit = (data, itemId) => {
    handlePaymentMethodChange("cash");
    console.log("data", data);
    console.log("itemId", itemId);
    mutate({ data, itemId });
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      console.log("itemId", itemId);
      const data = {
        quantity: newQuantity,
      };
      // handlePaymentMethodChange("cash");
      onSubmit(data, itemId);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handlePaymentMethodChange = (type) => {
    setPaymentMethodType(type);
  };

  // <---------- Place Order ---------------->
  const { mutate: mutateOrder } = useMutation({
    mutationFn: (params) => {
      const { address, paymentMethodType } = params;
      console.log("🚀 ~ file: Cart.jsx:23 ~ Cart ~ data:", address);
      console.log("🚀 ~ file: Cart.jsx:23 ~ Cart ~ itemId:", paymentMethodType);
      return placeOrder(address, paymentMethodType, token);
    },
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Order Placed Successfully ✅");
      queryClient.invalidateQueries("allCart");

      dispatch(setClearCart());
      navigate("/order");
      // setShowForm(false);
      // onCloseAddBrandModal();
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.message);
    },
  });

  const handlePlaceOrder = () => {
    if (amount < totalCartPrice && paymentMethodType === "wallet") {
      toast.error("Insufficient amount in wallet.");
      return;
    }
    console.log(
      "🚀 ~ handlePlaceOrder ~ paymentMethodType:",
      paymentMethodType
    );
    if (address !== null && paymentMethodType !== null) {
      mutateOrder({ address, paymentMethodType });
    } else {
      toast.error("Please select Payment method.");
    }
  };

  // payment integration
  const makePayment = async ({ address, paymentMethodType }) => {
    const stripe = await loadStripe(
      "pk_test_51LzxA5SHOUlzFrbDsa8XwGpBwoHgKqkyQ8nMfnchut72i1XxyuhKivj9HKbQD3rodrEl80ss2WtXbWFc8E2sFINO00XWTlL38s"
    );

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(
      "http://localhost:3000/cart/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          address: address,
          paymentMethodType: paymentMethodType,
        }),
      }
    );

    console.log("🚀 ~ makePayment ~ response:", response);
    const session = await response.json();
    console.log("🚀 ~ makePayment ~ session:", session.orderId);
    localStorage.setItem("orderId", session.orderId);

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });
    console.log("🚀 ~ makePayment ~ result:", result);

    if (result.error) {
      console.log(result.error);
    }
  };

  const handleCheckOut = () => {
    if (paymentMethodType === "card") {
      makePayment({ address, paymentMethodType });
    } else {
      handlePlaceOrder();
    }
  };

  const OpenModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 py-5">
      <div className="px-5">
        <div className="mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-600">
            Checkout.
          </h1>
        </div>
      </div>
      <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
        <div className="w-full">
          <div className="-mx-3 md:flex items-start">
            <div className="px-3 md:w-7/12 lg:pr-10">
              {cartData?.map((item, i) => (
                <li key={i} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={`http://localhost:3000/${item.product.coverImage}`}
                      alt={item.product.coverImage}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href={item.href}>{item.product.name}</a>
                        </h3>
                        <p className="ml-4">${item.product.price}</p>
                      </div>
                      <div className="flex space-x-2 items-center mt-2">
                        {/* <p className="mt-1 text-sm text-gray-500">
                        {item.color?.name}
                      </p> */}
                        <span
                          aria-hidden="true"
                          key={item.color?.name}
                          className={`bg-${item.color?.name}-600
                    h-8 w-8 rounded-full border border-black border-opacity-10`}
                        />
                        <div className="border border-gray-800 h-8 w-8 inline-block rounded-full ">
                          <p className="flex items-center justify-center text-lg">
                            {item.size?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                      <div>
                        <label
                          htmlFor={`quantity-${item._id}`}
                          className="sr-only"
                        >
                          Quantity
                        </label>
                        <select
                          id={`quantity-${item._id}`}
                          name={`quantity-${item._id}`}
                          className="form-select text-sm h-10 mt-1 w-14 border"
                          style={{ paddingRight: "4px" }}
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value, 10);
                            handleQuantityChange(item._id, newQuantity);
                          }}
                        >
                          {[...Array(10).keys()].map((number) => (
                            <option key={number + 1} value={number + 1}>
                              {number + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* <p className="text-gray-500">Color :</p> */}

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={() => removeCartItem(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}

              <div className="mb-6 pb-6 border-b border-gray-200 text-gray-800">
                <div className="w-full flex mb-3 items-center">
                  <div className="flex-grow">
                    <span className="text-gray-600">Subtotal</span>
                  </div>
                  <div className="pl-3">
                    <span className="font-semibold">${totalCartPrice}</span>
                    <span className="font-semibold text-gray-600 text-sm">
                      .00
                    </span>
                  </div>
                </div>
                <div className="w-full flex items-center">
                  <div className="flex-grow">
                    <span className="text-gray-600">Taxes (GST)</span>
                  </div>
                  <div className="pl-3">
                    <span className="font-semibold">$00.00</span>
                  </div>
                </div>
              </div>
              <div className="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
                <div className="w-full flex items-center">
                  <div className="flex-grow">
                    <span className="text-gray-600">Total</span>
                  </div>
                  <div className="pl-3">
                    <span className="font-semibold text-gray-400 text-sm">
                      DOL
                    </span>{" "}
                    <span className="font-semibold">${totalCartPrice}</span>
                    <span className="font-semibold text-gray-600 text-sm">
                      .00
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-3 md:w-5/12">
              <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
                <div className="w-full flex mb-2 items-center">
                  <div className="w-32">
                    <span className="text-gray-600 font-semibold">Alias</span>
                  </div>
                  <div className="flex-grow pl-3">
                    <span>{address?.alias}</span>
                  </div>
                </div>
                <div className="w-full flex mb-2 items-center">
                  <div className="w-32">
                    <span className="text-gray-600 font-semibold">City</span>
                  </div>
                  <div className="flex-grow pl-3">
                    <span>{address?.city}</span>
                  </div>
                </div>
                <div className="w-full flex mb-2 items-center">
                  <div className="w-32">
                    <span className="text-gray-600 font-semibold">Details</span>
                  </div>
                  <div className="flex-grow pl-3">
                    <span>{address?.details}</span>
                  </div>
                </div>
                <div className="w-full flex mb-2 items-center">
                  <div className="w-32">
                    <span className="text-gray-600 font-semibold">
                      Phone no.
                    </span>
                  </div>
                  <div className="flex-grow pl-3">
                    <span>{address?.phone}</span>
                  </div>
                </div>
                <div className="w-full flex mb-2 items-center">
                  <div className="w-32">
                    <span className="text-gray-600 font-semibold">
                      Postal Code
                    </span>
                  </div>
                  <div className="flex-grow pl-3">
                    <span>{address?.postalCode}</span>
                  </div>
                </div>
              </div>
              <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
                <div className="w-full p-3 border-b border-gray-200">
                  <div className="mb-5">
                    <label
                      htmlFor="type1"
                      className="flex items-center cursor-pointer"
                      onClick={() => handlePaymentMethodChange("wallet")}
                    >
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-500"
                        name="type"
                        id="type1"
                        defaultChecked=""
                        checked={isWalletDisabled  === false && paymentMethodType == "wallet"}
                        disabled={isWalletDisabled}
                        style={{
                          cursor: isWalletDisabled ? "not-allowed" : "pointer",
                        }}
                      />
                      <IoMdWallet size={29} className="ml-2" />
                      <p className="text-gray-600 text-lg font-semibold ml-2">
                        Wallet
                      </p>
                    </label>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-lg font-semibold ">
                        {" "}
                        Wallet Amount : ${amount}.00
                      </p>
                    </div>
                    <div>
                      <button
                        className=" block w-full max-w-xs mx-auto bg-green-500 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg px-3 py-2 font-semibold"
                        onClick={OpenModal}
                        disabled={loading}
                      >
                        <i className="mdi mdi-lock-outline mr-1" /> Add Money
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full p-3 border-b border-gray-200">
                  <label
                    htmlFor="type2"
                    className="flex items-center cursor-pointer"
                    onClick={() => handlePaymentMethodChange("cash")}
                  >
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-500"
                      name="type"
                      id="type2"
                    />
                    <IoMdCash size={29} className="ml-2" />
                    <p className="text-gray-600 text-lg font-semibold ml-2">
                      Cash On Delivery
                    </p>
                  </label>
                </div>
                <div className="w-full p-3">
                  <label
                    htmlFor="type3"
                    className="flex items-center cursor-pointer"
                    onClick={() => handlePaymentMethodChange("card")}
                  >
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-500"
                      name="type"
                      id="type3"
                    />
                    <FaRegCreditCard size={26} className="ml-2" />
                    <p className="text-gray-600 text-lg font-semibold ml-2">
                      Card
                    </p>
                  </label>
                </div>
              </div>
              <div>
                <button
                  className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-2 font-semibold"
                  onClick={handleCheckOut}
                >
                  <i className="mdi mdi-lock-outline mr-1" /> CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Model  */}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
        // className="bg-green-600"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="relative p-4 text-center bg-green rounded-lg  dark:bg-gray-800 sm:p-5">
            <button
              type="button"
              className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="successModal"
            >
              <span className="sr-only">Close modal</span>
            </button>
            <div className=" p-2 flex items-center justify-center mx-auto mb-3.5">
              <img src="/success.gif" height={100} width={100} />
              <span className="sr-only">Success</span>
            </div>
            <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Order Placed Successfully 🥳🛒
            </p>

            <div className="flex justify-center gap-4">
              <Button color="green" onClick={() => setOpenModal(false)}>
                Continue
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <AddWalletModal
        isOpen={isModalOpen}
        onClose={closeModal}
        addAmount={addAmount}
        setAddAmount={setAddAmount}
      />
    </div>
  );
};

// Wrap Checkout component with Elements to use CardElement
const AddMoneyForm = () => (
  <Elements
    stripe={loadStripe(
      "pk_test_51LzxA5SHOUlzFrbDsa8XwGpBwoHgKqkyQ8nMfnchut72i1XxyuhKivj9HKbQD3rodrEl80ss2WtXbWFc8E2sFINO00XWTlL38s"
    )}
  >
    <Checkout />
  </Elements>
);

export default AddMoneyForm;
