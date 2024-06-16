/* eslint-disable react/prop-types */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressAddValidation } from "../validation/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "flowbite-react";
import {
  addAddress,
  deleteAddress,
  getAddress,
} from "../services/Address/addressAPI";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
// import { placeOrder } from "../../services/User/order/orderAPI";
// import { setClearCart } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../services/order/orderAPI";
import { setClearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { setAddress } from "../redux/addressSlice";

const Address = ({ isAddressOpen, setAddressOpen, setCartOpen }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleCardClick = (index) => {
    setSelectedAddress(index === selectedAddress ? null : index);
  };

  const backToCart = () => {
    setCartOpen(true);
    setAddressOpen(false);
  };

  // <----------- Add Address --------------->
  const { mutate } = useMutation({
    mutationFn: (data) => addAddress(data),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Address Updated Successfully");
      queryClient.refetchQueries("allAddress");
      setShowForm(false);
      reset();
      // onCloseAddBrandModal();
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(addressAddValidation),
  });

  const onSubmit = (data) => {
    console.log(data);
    mutate(data);
  };

  // <---------- Get All Address---------------->
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allAddress"],
    queryFn: () => getAddress(token),
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  // <---------- Remove Address---------------->
  const { mutate: mutateDelete } = useMutation({
    mutationFn: (id) => deleteAddress(id),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Address Deleted Successfully");
      queryClient.refetchQueries("allAddress");
      // setShowForm(false);
      // onCloseAddBrandModal();
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.message);
    },
  });

  const handleDelete = (id) => {
    console.log("delete", id);
    mutateDelete(id);
  };

  // <---------- Place Order ---------------->
  const { mutate: mutateOrder } = useMutation({
    mutationFn: placeOrder,
    onSuccess: (response) => {
      console.log("response", response);
      setOpenModal(true);
      toast.success("Order Placed Successfully ✅");
      queryClient.invalidateQueries("allCart");
      setAddressOpen(false);
      dispatch(setClearCart());
      // setShowForm(false);
      // onCloseAddBrandModal();
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.message);
    },
  });

  const handlePlaceOrder = () => {
    console.log("place order");
    if (selectedAddress !== null) {
      const Address = data[selectedAddress];
      dispatch(setAddress(Address));
      setAddressOpen(false);
      navigate("/checkout");
    }
  };

  return (
    <div>
      <Transition.Root show={isAddressOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setAddressOpen(false)}
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
                      <div className="flex-1  px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Shopping cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-8 items-center">
                            <button
                              type="button"
                              className="flex items-center justify-center rounded-md border border-transparent bg-green-600 px-2 py-1 mr-8 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                              onClick={toggleForm}
                            >
                              {showForm ? "Show Addresses" : "Add New Address"}
                            </button>
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setAddressOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <span>X</span>
                              {/* <XMarkIcon className="h-6 w-6" aria-hidden="true" /> */}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Display form or addresses based on state */}
                      {showForm ? (
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="mx-6 my-4"
                        >
                          {/* Alias */}
                          <div className="mb-2">
                            <label
                              htmlFor="alias"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Alias
                            </label>
                            <input
                              type="text"
                              id="alias"
                              {...register("alias")}
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                            <p className="text-red-500">
                              {errors.alias?.message}
                            </p>
                          </div>

                          {/* Details */}
                          <div className="mb-2">
                            <label
                              htmlFor="details"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Details
                            </label>
                            <textarea
                              id="details"
                              {...register("details")}
                              rows="2"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            ></textarea>
                            <p className="text-red-500">
                              {errors.details?.message}
                            </p>
                          </div>

                          {/* Phone */}
                          <div className="mb-2">
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Phone
                            </label>
                            <input
                              type="text"
                              id="phone"
                              {...register("phone")}
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                            <p className="text-red-500">
                              {errors.phone?.message}
                            </p>
                          </div>

                          {/* City */}
                          <div className="mb-2">
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-gray-700"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              {...register("city")}
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                            <p className="text-red-500">
                              {errors.city?.message}
                            </p>
                          </div>

                          {/* Postal Code */}
                          <div className="mb-2">
                            <label
                              htmlFor="postalCode"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Postal Code
                            </label>
                            <input
                              type="text"
                              id="postalCode"
                              {...register("postalCode")}
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                            <p className="text-red-500">
                              {errors.postalCode?.message}
                            </p>
                          </div>

                          {/* Submit button */}
                          <div className="mt-6">
                            <button
                              type="submit"
                              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-3  text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                              Add Address
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Render user addresses here */
                        <div className="mt-8">
                          <div className="flow-root">
                            {isSuccess &&
                              data.map((address, index) => (
                                <div
                                  className=" border-gray-200 px-4 py-2 sm:px-6 cursor-pointer"
                                  onClick={() => handleCardClick(index)}
                                  key={index}
                                >
                                  <div
                                    // className="bg-white p-4 rounded-md shadow-lg "
                                    className={` border-2 bg-white p-4 rounded-md shadow-lg  ${
                                      index === selectedAddress
                                        ? "border-blue-600 bg-blue-200"
                                        : "bg-white"
                                    }`}
                                  >
                                    <div className="flex justify-between">
                                      <h2 className="text-xl font-bold mb-2">
                                        {address.alias}
                                      </h2>
                                      <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleDelete(address._id)
                                        }
                                      >
                                        <IoClose size={20} />
                                      </span>
                                    </div>
                                    <p className="text-gray-600 ">
                                      {address.details}
                                    </p>
                                    <p className="text-gray-600 ">
                                      Phone: {address.phone}
                                    </p>
                                    <p className="text-gray-600 ">
                                      City: {address.city}
                                    </p>
                                    <p className="text-gray-600 ">
                                      Postal Code: {address.postalCode}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          {selectedAddress !== null ? (
                            <button
                              className="flex items-center justify-center rounded-md border w-full border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                              onClick={() => handlePlaceOrder()}
                            >
                              Place Order
                            </button>
                          ) : (
                            <button
                              className="flex items-center justify-center rounded-md border border-transparent bg-gray-300 px-6 py-3 text-base font-medium text-white shadow-sm cursor-not-allowed w-full"
                              disabled
                            >
                              Place Order
                            </button>
                          )}
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => backToCart()}
                            >
                              Back to Cart
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

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
    </div>
  );
};

export default Address;
