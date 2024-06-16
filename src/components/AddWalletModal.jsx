/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Button, Label } from "flowbite-react";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const AddWalletModal = ({ isOpen, onClose, setAddAmount, addAmount }) => {
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);

  // Add money Into Wallet
  const handleAddMoney = async () => {
    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/wallet/create-payment-intent",
        {
          amount: addAmount * 100, // Amount in cents
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const clientSecret = response.data.clientSecret;
      console.log("🚀 ~ handleAddMoney ~ clientSecret:", clientSecret);

      // Retrieve the CardElement
      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      onClose();
      if (paymentResult.error) {
        console.error("Payment failed:", paymentResult.error.message);
        // Handle payment failure
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
        // Update user's wallet amount
        const updateWallet = await axios.post(
          "http://localhost:3000/wallet/handle-payment-success",
          { amount: addAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("🚀 ~ handleAddMoney ~ updateWallet:", updateWallet);
        if (response.status === 200) {
          queryClient.invalidateQueries("wallet");
          queryClient.invalidateQueries("allTransaction");
          toast.success("Wallet added successfully");
        } else {
          toast.error("Payment fiail!!");
        }
      }
    } catch (error) {
      console.error("Error adding money to wallet:", error);
    }
    setLoading(false);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md" popup>
      <Modal.Header>Add Money to Wallet</Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <Label>Amount : </Label>
          <input
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            placeholder="Enter amount to add"
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>

        {/* Card Element for Stripe */}
        <div className="mb-4">
          <CardElement />
        </div>

        <button
          className=" block w-full max-w-xs mx-auto bg-green-500 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg px-3 py-2 font-semibold"
          onClick={handleAddMoney}
          //   onClick={OpenModal}
          //   disabled={loading}
        >
          <i className="mdi mdi-lock-outline mr-1" />{" "}
          {loading ? "Loading..." : "Add Money"}
        </button>
      </Modal.Body>
    </Modal>
  );
};

// // Wrap Checkout component with Elements to use CardElement
// const AddMoneyForm = () => (
//   <Elements
//     stripe={loadStripe(
//       "pk_test_51LzxA5SHOUlzFrbDsa8XwGpBwoHgKqkyQ8nMfnchut72i1XxyuhKivj9HKbQD3rodrEl80ss2WtXbWFc8E2sFINO00XWTlL38s"
//     )}
//   >
//     <AddWalletModal />
//   </Elements>
// );

export default AddWalletModal;
