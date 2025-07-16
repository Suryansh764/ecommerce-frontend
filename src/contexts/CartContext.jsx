
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

const STATIC_USER_ID = "686e703ba1875a9c9aa508c6";
const BACKEND_URL = "https://ecommerce-backend-nu-five.vercel.app"; 
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

  const addToCart = async (productId, quantity = 1) => {
    try {
      const existingItem = cart.find((item) => item.product._id === productId);
      const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

      const res = await fetch(`${BACKEND_URL}/api/cart/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: STATIC_USER_ID, productId, quantity: newQuantity }),
      });

      const data = await res.json();
      if (res.ok) {
        setCart(data.cart.items);
      } else {
        console.error("Add to cart error:", data.message);
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

      const data = await res.json();
      if (res.ok) {
        setCart(data.cart.items);
      }
    } catch (err) {
      console.error("Remove from cart failed", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
