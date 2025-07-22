
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const STATIC_USER_ID = "686e703ba1875a9c9aa508c6";
const BACKEND_URL = "https://ecommerce-backend-nu-rosy.vercel.app";

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/cart/${STATIC_USER_ID}`);
      const data = await res.json();
      setCart(data.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

const addToCart = async (productId, quantity = 1, override = false) => {
  try {

    if (!override) {
      const existingItem = cart.find((item) => item.product._id === productId);
      quantity = existingItem ? existingItem.quantity + quantity : quantity;
    }

    const res = await fetch(`${BACKEND_URL}/api/cart/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: STATIC_USER_ID, productId, quantity }),
    });

    if (res.ok) {
      fetchCart(); 
    }
  } catch (err) {
    console.error("Add to cart failed", err);
  }
};

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: STATIC_USER_ID, productId }),
      });
      if (res.ok) {
        fetchCart(); 
      }
    } catch (err) {
      console.error("Remove from cart failed", err);
    }
  };
  const clearCart = async () => {
  for (let item of cart) {
    await removeFromCart(item.product._id);
  }
};

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
