import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { allOrders, cancelOrders } from "../services/order/orderAPI";
import toast from "react-hot-toast";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Order = () => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    id: null,
  });

  // <-------- Get All Categories -------->
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allOrders"],
    queryFn: allOrders,
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  if (isSuccess) {
    console.log("isSuccess", data);
  }

  // Resend OTP Mutation
  const { mutate } = useMutation({
    mutationFn: () => cancelOrders(openModal.id),
    onSuccess: () => {
      toast.success("Order Canceled successfully! & refund debited to wallet");
      setOpenModal({
        isOpen: false,
        id: null,
      });
      queryClient.invalidateQueries("allOrders");
      queryClient.invalidateQueries("wallet");
    },
  });

  return (
    <div className=" min-h-screen bg-gray-50 py-5">
      <div className="px-5">
        <div className="mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-600">
            Orders.
          </h1>
        </div>
      </div>
      <div className="flex flex-col  m-8">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-1/10"
                    >
                      Cart Items
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Total Price
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Payment Method
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {isSuccess &&
                    data.map((order, index) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        key={index}
                      >
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {order.user.firstName} {order.user.lastName}
                            </div>
                          </div>
                        </td>
                        <td
                          className=" p-4  space-x-6 whitespace-nowrap"
                          style={{ width: "450px" }}
                        >
                          <table
                            className="border border-gray-300 w-full"
                            style={{ width: "400px" }}
                          >
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                                <th className="px-4 py-2 w-2/3">Name</th>
                                <th className="px-4 py-2 w-2/3">Color</th>
                                <th className="px-4 py-2 w-2/3">Size</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Price</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {order?.cartItems?.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2">
                                    {item?.product.name}
                                  </td>
                                  <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                                    <div
                                      key={index}
                                      style={{
                                        backgroundColor: `${item?.color.name}`,
                                        width: "23px",
                                        height: "23px",
                                        borderRadius: "50%",
                                      }}
                                    ></div>
                                  </td>
                                  <td className="px-4 py-2">
                                    {item?.size.name}
                                  </td>
                                  <td className="px-4 py-2">
                                    {item?.quantity}
                                  </td>
                                  <td className="px-4 py-2">
                                    ${item?.product.price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                        <td className=" p-4  whitespace-nowrap">
                          <p>
                            <b>Alias : </b>
                            {order.shippingAddress?.alias}
                          </p>
                          <p>
                            <b>City : </b>
                            {order.shippingAddress?.city}
                          </p>
                          <p>
                            <b>Details : </b>
                            {order.shippingAddress?.details}
                          </p>
                          <p>
                            <b>Phone : </b>
                            {order.shippingAddress?.phone}
                          </p>
                          <p>
                            <b>Postalcode : </b>
                            {order.shippingAddress?.postalCode}
                          </p>
                        </td>
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              ${order.totalOrderPrice}
                            </div>
                          </div>
                        </td>
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {order.paymentMethodType}
                            </div>
                          </div>
                        </td>
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              <button
                                type="button"
                                data-modal-toggle="delete-user-modal"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                                onClick={() =>
                                  setOpenModal({
                                    isOpen: true,
                                    id: order.orderId,
                                  })
                                }
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={openModal.isOpen}
        size="md"
        onClose={() =>
          setOpenModal({
            isOpen: false,
            id: null,
          })
        }
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to cancel order?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                className="bg-red-600"
                onClick={() => mutate()}
                // onClick={() =>
                //   setOpenModal({
                //     isOpen: false,
                //     id: null,
                //   })
                // }
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() =>
                  setOpenModal({
                    isOpen: false,
                    id: null,
                  })
                }
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Order;
