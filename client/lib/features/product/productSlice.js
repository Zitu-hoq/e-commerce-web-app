import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllProducts } from "../../api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const data = await getAllProducts();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  fetched: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log("Products fetched, setting fetched=true");
        state.loading = false;
        state.products = action.payload;
        state.fetched = true;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
