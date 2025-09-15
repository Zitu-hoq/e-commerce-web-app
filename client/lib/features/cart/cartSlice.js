import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToCartAPI,
  getCart,
  removeFromCartAPI,
  updateCartAPI,
} from "../../api";

//Fetch user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const cartItems = await getCart();
      if (!cartItems) {
        return [];
      }

      return cartItems;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//Add product and sync
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity, size, color }, thunkAPI) => {
    try {
      const updatedCart = await addToCartAPI(product, quantity, size, color);
      return updatedCart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Remove product and sync
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, thunkAPI) => {
    try {
      const updatedCart = await removeFromCartAPI(productId);
      return updatedCart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Update and sync
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (item, thunkAPI) => {
    try {
      const updatedCart = await updateCartAPI(item);
      return updatedCart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  updated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.updated = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
        state.updated = false;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.error = action.payload;
        state.updated = false;
      });
  },
});

export default cartSlice.reducer;
