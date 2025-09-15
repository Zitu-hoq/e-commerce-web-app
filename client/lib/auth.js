import { toast } from "sonner";
import axios from "./axios";
import { logout, setUser } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartSlice";

export async function registerUser(user) {
  const { confirmPassword, ...data } = user;
  try {
    const res = await axios.post("/api/auth/register", data);
    toast.success(res.data?.message);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "registration failed");
  }
}

export const Login = (user) => async (dispatch) => {
  const { email, password } = user;
  const data = { email, password };
  try {
    const res = await axios.post("/api/auth/login", data);
    dispatch(setUser(res.data.user));
    toast.success(res.data?.message);
    dispatch(fetchCart());
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "login failed");
  }
};

export const checkAuth = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/auth/me");
    if (res.data.user._id) {
      dispatch(setUser(res.data.user));
      dispatch(fetchCart());
    }
  } catch (error) {
    dispatch(logout());
  }
};

export const Logout = () => async (dispatch) => {
  try {
    const res = await axios.post("/api/auth/logout", {});
    dispatch(logout());
    toast.success(res.data?.message);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Something is wrong!");
  }
};

export const DeleteUser = async (pass) => {
  const password = { password: pass };
  try {
    const res = await axios.post("/api/auth/deleteuser", password);
    toast.success(res.data?.message);
    return true;
  } catch (err) {
    toast.error(error.response?.data?.message || "Something is wrong!");
    return false;
  }
};
