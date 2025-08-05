// ✅ Returns number with 2 decimal places
export const addDecimals = (num) => {
  return Number((Math.round(num * 100) / 100).toFixed(2));
};

export const updateCart = (state) => {
  // ✅ Calculate items price
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  state.itemsPrice = addDecimals(itemsPrice);

  // ✅ Shipping: free if over $100
  state.shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);

  // ✅ Tax (15%)
  state.taxPrice = addDecimals(0.15 * itemsPrice);

  // ✅ Total
  state.totalPrice = addDecimals(
    state.itemsPrice + state.shippingPrice + state.taxPrice
  );

  // ✅ Save to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
