import { toast } from "sonner";
import axios from "./axios";

export const paymentAPI = async (orderId, method) => {
  const data = { orderId, method };
  try {
    const res = await axios.post("/api/user/order/payment", data);
    toast.success(res.data.message);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Payment Error");
    console.log(err);
  }
};

export const cancelPayment = async (paymentIntentId) => {
  const data = { paymentIntentId };
  try {
    const res = await axios.post("/api/user/order/payment/cancel", data);
    toast.error(res.data.message);
  } catch (err) {
    toast.error(err.response?.data?.message || "Payment calcelation error");
    console.log(err);
  }
};

export const paylaterAPI = async (orderId, names) => {
  try {
    const data = { orderId, names };
    const res = await axios.post("/api/user/order/payment/message", data);
    toast.success(res.data.message);
  } catch (err) {
    toast.error(err.response?.data?.message || "Payment Error");
    console.log(err);
  }
};

export const placeOrderAPI = async (order, prevRoute) => {
  try {
    const data = { order, prevRoute };
    const res = await axios.post("/api/user/order/place", data);
    toast.success(res.data.message);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "error fetching products");
    console.log(err);
    return "";
  }
};

export const couponAPI = async (code) => {
  try {
    const res = await axios.get(`/api/user/coupon/${code}`);
    toast.success("Coupon Applied!");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error while checking cupon");
    console.log(error);
    return "";
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const res = await axios.post("/api/user/order/cancel", { orderId });
    toast.success(res.data.message);
    return res.data.cancelled;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error while canceling the Order!"
    );
    return false;
  }
};
