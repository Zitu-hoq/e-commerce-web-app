const Message = require("../models/message");
const User = require("../models/user");
const Order = require("../models/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const generateMessage = async (req, res) => {
  try {
    const { orderId, names } = req.body;
    //message
    const data = {
      title: "Please keep in mind!",
      description:
        "Complete your payment within 30 minutes or your order will be automatically cancelled.",
      Link: orderId,
      products: names,
    };
    //validate the order
    const order = await Order.findById(orderId);
    if (order.paymentMethod !== "processing")
      return res.status(403).json({ message: "Invalid Order" });
    // save message for the user
    const notification = await new Message(data).save();
    await User.updateOne(
      { _id: req.user._id },
      { $push: { message: notification._id } },
      { upsert: true }
    );
    return res.status(200).json({
      message: "Please complete your payment within 30 minutes!",
      notification,
    });
  } catch (error) {
    console.log("generate-message-error");
    return res.status(400).json({ message: error.message, error });
  }
};

const handlePayment = async (req, res) => {
  try {
    const { orderId, method } = req.body;
    //check for order
    const order = await Order.findById(orderId);
    if (!order) return res.status(501).json({ message: "Order not Found!" });
    //check for payment status
    if (order.paymentMethod !== "processing")
      return res.status(403).json({ message: "Invalid Order" });
    // Cash On delivary case
    if (method === "COD") {
      order.paymentMethod = "COD";
      await order.save();
      //delete generated message and remove it from user
      const message = await Message.findOneAndDelete({ Link: orderId });
      if (message) {
        await User.updateOne(
          { _id: req.user._id },
          { $pull: { message: message._id } }
        );
      }
      return res.status(200).json({ message: "Thank you for your Order!" });
    }
    // Card case
    if (method === "Card") {
      const amountInSmallest = Math.round(Number(order.totalAmount) * 100);
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInSmallest,
        currency: "bdt",
        payment_method_types: ["card"],
        metadata: {
          orderId: String(order._id),
          userId: String(order.user),
        },
      });
      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        amount: order.totalAmount,
        paymentIntentId: paymentIntent.id,
        message: "Please Enter Your Card Details.",
      });
    }

    //optional
    return res
      .status(200)
      .json({
        message: "payment method unavailable! Please select another one.",
      });
  } catch (error) {
    console.log("handle-payment-error");
    return res.status(400).json({ message: error.message, error });
  }
};

const cancelPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const canceled = await stripe.paymentIntents.cancel(paymentIntentId);
    return res.json({ message: "Payment Cancelled", canceled });
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
};

// ----------------- Webhook Route -----------------

const checkStripePayment = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle payment events
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      const userId = paymentIntent.metadata.userId;
      //delete the generated message and remove from user
      const message = await Message.findOneAndDelete({ Link: orderId });
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "paid",
          paymentMethod: "Card",
          paymentId: paymentIntent.id,
        });
      }
      if (message) {
        await User.findByIdAndUpdate(userId, {
          $pull: { message: message._id },
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;

      const orderId = paymentIntent.metadata.orderId;
      //change generated message for failed payment
      await Message.findOneAndUpdate(
        { Link: orderId },
        { title: "❌ Your last Payment attempt was failed!!" }
      );
      break;
    }

    default:
      console.log(`stripe-webhook-error Unhandled event type ${event.type}`);
  }
  res.json({ received: true });
};

module.exports = {
  handlePayment,
  generateMessage,
  checkStripePayment,
  cancelPayment,
};
