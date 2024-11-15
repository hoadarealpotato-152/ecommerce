import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";
import { TCartItem } from "../../types/cart";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItem: [] as TCartItem[],
  },
  reducers: {
    updateCart: (state, action: PayloadAction<TCartItem>) => {
      const exCartItem = state.cartItem.find(it => it.id=== action.payload.id);
      if(exCartItem) {
        exCartItem.quantity = exCartItem.quantity + action.payload.quantity;
      } else {
        state.cartItem.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<TCartItem>) => {
      state.cartItem = state.cartItem.filter(
        (item: TCartItem) => item.id !== action.payload.id
      );
    },
    removeAllItem: (state) => {
      state.cartItem = [];
    },
  },
});

export const cartSelector = (state: RootState) => state;

// this is for dispatch
export const { updateCart, removeFromCart, removeAllItem } = cartSlice.actions;

// this is for configureStore
export default cartSlice.reducer;
