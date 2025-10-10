import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cancelPayment, paymentAPI } from "@/lib/paymentAPI";
import { X } from "lucide-react";
import { useState } from "react";
import CardPayment from "./StripeCardPayment";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export function PaymentOption({ orderId, handleCancel }) {
  const [value, setValue] = useState("COD");
  const [clientSecret, setClientSecret] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const handlePayment = async () => {
    if (value === "Card") {
      const data = await paymentAPI(orderId, "Card");
      if (data?.clientSecret) {
        setClientSecret(data.clientSecret); // show Stripe UI
        setPaymentIntentId(data.paymentIntentId);
        setAmount(data.amount);
        setShowCardForm(true);
      }
    } else {
      // COD / Mobile Banking
      await paymentAPI(orderId, value);
      setTimeout(() => {
        window.location.href = "/profile/orders";
      }, 1500);
    }
  };
  const cancelPaymentAttept = async () => {
    await cancelPayment(paymentIntentId);
    setShowCardForm(false);
    setClientSecret("");
    setPaymentIntentId("");
  };

  // If card chosen → render StripeCardPayment in its own layout
  if (showCardForm && clientSecret) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[400px]">
          <div className="absolute -top-2 -right-2">
            <Button
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={cancelPaymentAttept}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="text-lg font-semibold mb-4 text-center">
            Pay with Card
          </h3>
          <CardPayment clientSecret={clientSecret} amount={amount} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="flex flex-col item-center h-[40%] w-[40%] justify-center align-middle bg-blue-100 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-900 p-4 gap-y-4 rounded-sm">
        <h3 className="text-center font-semibold text-lg mb-4">
          Pay for your order using:
        </h3>
        <RadioGroup
          defaultValue="COD"
          onValueChange={setValue}
          className="mb-4 text-center justify-center"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="COD" id="r1" />
            <Label htmlFor="r1">Cash on Delivery</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="Card" id="r2" />
            <Label htmlFor="r2">Card</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="Mobile Banking" id="r3" />
            <Label htmlFor="r3">Mobile Banking</Label>
          </div>
        </RadioGroup>
        <div className="text-center">
          <Button variant="default" onClick={handlePayment} className="mr-4">
            Continue
          </Button>

          <Button variant="secondary" onClick={handleCancel}>
            Pay Later
          </Button>
        </div>
      </div>
    </div>
  );
}
