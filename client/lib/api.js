import { toast } from "sonner";
import axios from "./axios";

export const getAllProducts = async () => {
  try {
    const res = await axios.get("/api/public/products");
    console.log(res.data.products);
    // res.data contains page number
    return res.data.products;
  } catch (err) {
    toast.error(err.response?.data?.message || "error fetching products");
    console.log(err);
  }
};

export const getBanners = async () => {
  try {
    const res = await axios.get("/api/public/banners");
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error("error fetching banners");
  }
};

export const getAllCategories = async () => {
  try {
    const res = await axios.get("/api/public/category");
    // res.data contains page number
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "error fetching categories");
    console.log(err);
  }
};

export const getProductById = async (id) => {
  try {
    const res = await axios.get(`/api/public/product/${id}`);
    return res.data.product;
  } catch (err) {
    toast.error(err.response?.data?.message || "error fetching product");
    console.log(err);
  }
};

export const getCart = async () => {
  try {
    const res = await axios.get("/api/cart/getcart");
    return res.data.cart; // returns array of cart items
  } catch (err) {
    toast.error(err.response?.data?.message || "error fetching product");
    console.log(err);
  }
};

export const addToCartAPI = async (product, quantity, size, color) => {
  try {
    const res = await axios.post("/api/cart/addtocart", {
      product,
      quantity,
      size,
      color,
    });
    toast.success(res.data.message);
    return res.data.cart;
  } catch (err) {
    toast.error(err.response?.data?.message || "error adding to cart");
    console.log(err);
  }
};

export const removeFromCartAPI = async (productId) => {
  try {
    const res = await axios.delete(`/api/cart/removefromcart/${productId}`);
    toast.success(res.data.message);
    return res.data.cart;
  } catch (err) {
    toast.error(err.response?.data?.message || "error removing from cart");
    console.log(err);
  }
};

export const updateCartAPI = async (updateItem) => {
  try {
    const res = await axios.patch("/api/cart/updatecart", updateItem);
    toast.success(res.data.message);
    return res.data.cart;
  } catch (err) {
    toast.error(err.response?.data?.message || "error updating cart");
    console.log(err);
  }
};

export const searchProductAPI = async (query) => {
  try {
    const res = await axios.get(
      `api/public/explore/products?search=${encodeURIComponent(query)}`
    );
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "searching error");
    console.log(err);
    return 0;
  }
};

export const addAddressAPI = async (address) => {
  const data = address;
  try {
    const res = await axios.post("/api/user/addressbook/add", data);
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "address book error");
  }
};

export const updateAddressAPI = async (address) => {
  const data = address;
  try {
    const res = await axios.post("/api/user/addressbook/update", data);
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "address book error");
  }
};

export const deleteAddressAPI = async (addressID) => {
  try {
    const res = await axios.delete(`/api/user/addressbook/delete/${addressID}`);
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "address book error");
  }
};
