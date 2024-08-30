import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.items = [...state.items, action.payload];
    },
    updateCart(state, action) {
      const updatedItems = state.items.map((pizza) =>
        pizza.name === action.payload.name
          ? {
              ...pizza,
              quantity: pizza.quantity + 1,
              totalPrice: pizza.totalPrice + action.payload.unitPrice,
            }
          : pizza,
      );

      state.items = updatedItems;
    },
    clearCart(state, action) {
      state.items = [];
    },
    deleteFromCart(state, action) {
      state.items = state.items.filter(
        (pizza) => pizza.pizzaId !== action.payload,
      );
    },
  },
});

export const { addToCart, updateCart, clearCart, deleteFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
