import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Header from "../../layout/Header/Header";

const AddMoneyHeader = () => {
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(
      "pk_test_51LzxA5SHOUlzFrbDsa8XwGpBwoHgKqkyQ8nMfnchut72i1XxyuhKivj9HKbQD3rodrEl80ss2WtXbWFc8E2sFINO00XWTlL38s"
    )
  );

  return (
    <Elements stripe={stripePromise}>
      <Header />
    </Elements>
  );
};

export default AddMoneyHeader;
