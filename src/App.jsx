import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Nav from './components/Nav';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import CategoryProducts from './pages/CategoryProducts';
import Wishlist from './pages/Wishlist';
import Profile from "./pages/Profile"; 
import CartPage from './pages/Cart';
import { CartProvider } from "./contexts/CartContext";




import { WishlistProvider } from './contexts/WishlistContext'; // ✅ Correct context

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <WishlistProvider> {/* ✅ Use Wishlist context here */}
     <CartProvider>
      <Router>
        <Nav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories/:categoryId" element={<CategoryProducts />} />
          <Route path="/saved" element={<Wishlist />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/cart" element={<CartPage />} />
        
        </Routes>
      </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
