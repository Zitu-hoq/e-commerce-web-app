"use client";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm({ clientSecret, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = localStorage.getItem("theme") || "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      },
    });

    setLoading(false);

    if (result.error) {
      setMessage("❌ Payment failed: " + result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setMessage("✅ Payment successful! 🎉");
      setTimeout(() => {
        window.location.href = "/profile/orders";
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Card Number</label>
        <div className="p-2 border rounded dark:text-white">
          {theme === "dark" ? (
            <CardNumberElement
              options={{
                style: {
                  base: {
                    color: "#ffffff", // input text color
                    caretColor: "#ffffff", // cursor color
                    "::placeholder": {
                      color: "#9ca3af", // placeholder color
                    },
                  },
                },
              }}
            />
          ) : (
            <CardNumberElement />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Expiry Date</label>
          <div className="p-2 border rounded dark:text-white">
            {theme === "dark" ? (
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      color: "#ffffff", // input text color
                      caretColor: "#ffffff", // cursor color
                      "::placeholder": {
                        color: "#9ca3af", // placeholder color
                      },
                    },
                  },
                }}
              />
            ) : (
              <CardExpiryElement />
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">CVC</label>
          <div className="p-2 border rounded">
            {theme === "dark" ? (
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      color: "#ffffff", // input text color
                      caretColor: "#ffffff", // cursor color
                      "::placeholder": {
                        color: "#9ca3af", // placeholder color
                      },
                    },
                  },
                }}
              />
            ) : (
              <CardCvcElement />
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Processing..." : `Pay BDT ${amount} Now`}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}

export default function CardPayment({ clientSecret, amount }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} amount={amount} />
    </Elements>
  );
}
