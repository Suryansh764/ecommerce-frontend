
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-backend-omega-orcin.vercel.app";

const STATIC_USER_ID = "686e703ba1875a9c9aa508c6"; 

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    const res = await fetch(`https://ecommerce-backend-omega-orcin.vercel.app/api/wishlist/${STATIC_USER_ID}`);
    const json = await res.json();
    setWishlist(json.data?.products || []);
  };

  const addToWishlist = async (productId) => {
    await fetch(`https://ecommerce-backend-omega-orcin.vercel.app/api/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: STATIC_USER_ID, productId }),
    });
    fetchWishlist();
  };

  const removeFromWishlist = async (productId) => {
    await fetch(`https://ecommerce-backend-omega-orcin.vercel.app/api/wishlist/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: STATIC_USER_ID, productId }),
    });
    fetchWishlist();
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
