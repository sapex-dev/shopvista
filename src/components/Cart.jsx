/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCartItem,
  getCart,
  updateQuantity,
  clearCart,
} from "../services/Cart/cartAPI";
import { useDispatch } from "react-redux";
import { setCart, setClearCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
// import Address from "./Address";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Address from "./Address";
// import { XMarkIcon } from '@heroicons/react/24/outline'

const Cart = ({ isCartOpen, setCartOpen }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isAddressOpen, setAddressOpen] = useState(false);
  const [couponPrise, setCouponPrise] = useState(null);
  const cartData = useSelector((state) => state.cart.cartItems);
  const token = useSelector((state) => state.auth.token);

  // Make the API call with the updated quantity
  const { mutate, data: quantityData } = useMutation({
    mutationFn: (params) => {
      const { data, itemId } = params;
      console.log("🚀 ~ file: Cart.jsx:23 ~ Cart ~ data:", data);
      console.log("🚀 ~ file: Cart.jsx:23 ~ Cart ~ itemId:", itemId);
      return updateQuantity(data, itemId, token);
    },
    onSuccess: (response) => {
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

  // // <-------- Get All Cart Item -------->
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allCart"],
    queryFn: () => getCart(token),
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

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

  // Clear Cart
  const { mutate: clearCartMutation, data: clearCartData } = useMutation({
    mutationFn: clearCart,
    onSuccess: (response) => {
      dispatch(setClearCart());
      queryClient.invalidateQueries("allCart");
      toast.success("Cart Cleared Successfully");
      setCartOpen(false);
    },
  });

  const handleClearCart = () => {
    clearCartMutation();
  };

  useEffect(() => {
    const payload = {
      numOfCartItems: data?.numOfCartItems,
      cartItems: data?.data?.cartItems,
      totalCartPrice: data?.data?.totalCartPrice,
    };
    // console.log("🚀 ~ useEffect ~ payload:", payload)
    dispatch(setCart(payload));
  }, [data]);

  const onSubmit = (data, itemId) => {
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
      onSubmit(data, itemId);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleAddressClick = () => {
    setCartOpen(false);
    setAddressOpen(!isAddressOpen);
  };

  // <------------------ Coupon -------------->
  // const { register, handleSubmit } = useForm();

  // const { mutate: mutateCoupon, data: couponData } = useMutation({
  //   mutationFn: (data) => applyCoupon(data),
  //   onSuccess: (response) => {
  //     console.log("response", response);
  //     toast.success("Coupon Applied Successfully 🥳✨");
  //     setCouponPrise(response?.data?.data?.totalPriceAfterDiscount);
  //   },
  //   onError: (error) => {
  //     console.log("error", error);
  //     toast.error(error.message);
  //   },
  // });

  // const onCouponSubmit = (data) => {
  //   console.log("Coupon submitted:", data);
  //   mutateCoupon(data);
  // };

  return (
    <div>
      <Transition.Root show={isCartOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setCartOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Shopping cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setCartOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <span>X</span>
                              {/* <XMarkIcon className="h-6 w-6" aria-hidden="true" /> */}
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            {cartData?.length > 0 ? (
                              <ul
                                role="list"
                                className="-my-6 divide-y divide-gray-200"
                              >
                                {cartData?.map((item) => (
                                  <li key={item._id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={`http://localhost:3000/${item.product?.coverImage}`}
                                        alt={item.product?.coverImage}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <a href={item.href}>
                                              {item.product?.name}
                                            </a>
                                          </h3>
                                          <p className="ml-4">
                                            ${item.product?.price}
                                          </p>
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
                                        <p className="text-gray-500">
                                          Qty: {item.quantity}
                                        </p>
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
                                              const newQuantity = parseInt(
                                                e.target.value,
                                                10
                                              );
                                              handleQuantityChange(
                                                item._id,
                                                newQuantity
                                              );
                                            }}
                                          >
                                            {[...Array(10).keys()].map(
                                              (number) => (
                                                <option
                                                  key={number + 1}
                                                  value={number + 1}
                                                >
                                                  {number + 1}
                                                </option>
                                              )
                                            )}
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
                              </ul>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p> Emplty Cart 🪹</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {cartData?.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                          <div className="flex justify-between text-base font-medium text-grey-900">
                            <p>Subtotal</p>
                            {couponPrise != null ? (
                              <p>${couponPrise}</p>
                            ) : (
                              <p>${data?.data?.totalCartPrice}</p>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            Shipping and taxes calculated at checkout.
                          </p>
                          <div>
                            {/* <form
                              onSubmit={handleSubmit(onCouponSubmit)}
                              className="flex mt-2 w-full"
                            >
                              <input
                                type="text"
                                placeholder="Enter Coupon 🥳"
                                className="border-gray-300 rounded-md text-sm p-2 mr-2 w-2/3"
                                {...register("coupon")}
                              />
                              <button
                                type="submit"
                                className="bg-blue-500 text-white rounded-md p-2 w-1/3"
                              >
                                Apply
                              </button>
                            </form> */}
                          </div>
                          <div className="mt-4">
                            <a
                              onClick={handleAddressClick}
                              className="cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                              Select Address
                            </a>
                          </div>
                          <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                            <p>
                              or
                              <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => handleClearCart()}
                              >
                                Clear Cart
                                <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Address
        isAddressOpen={isAddressOpen}
        setAddressOpen={setAddressOpen}
        setCartOpen={setCartOpen}
        cartId={data?.data?._id}
      />
    </div>
  );
};

export default Cart;
