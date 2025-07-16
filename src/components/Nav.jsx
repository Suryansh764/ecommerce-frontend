import { Link } from 'react-router-dom';
import useFetch from '../useFetch';
import { useWishlist } from "../contexts/WishlistContext";
import { useState, useEffect } from 'react';
import { useCart } from "../contexts/CartContext";

export default function Nav({ searchQuery, setSearchQuery }) {
  const { data } = useFetch("https://ecommerce-backend-nu-five.vercel.app/api/products");
  const { wishlist } = useWishlist();
  const savedCount = wishlist.length; 
  const [isFocused, setIsFocused] = useState(false);

  const { cart } = useCart();
const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

   
  return (
    <nav className="navbar navbar-expand-lg py-5 px-5" style={{ backgroundColor: "#030303" }}>
      <div className="container-fluid px-4">
        <Link
          className="navbar-brand fw-bold text-light"
          style={{ fontFamily: 'Trebuchet MS, sans-serif', fontSize: '32px' }}
          to="/"
        >
          Picasso's Gallery
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          style={{ border: "1px solid white" }}
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>

        <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarNavDropdown">
          <div className="d-flex flex-column flex-lg-row align-items-center w-100 gap-3">
            

            <form className="flex-grow-1 w-100" role="search">
              <input
                className="form-control text-center"
                type="search"
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  border: "none",
                  borderRadius: "12px",
                  outline: "none",
                  backgroundColor: "#fff",
                  boxShadow: "0 5px 10px rgb(198, 44, 44)",
                  fontSize: "1rem",
                  fontFamily: "Trebuchet MS, sans-serif",
                  transition: "box-shadow 0.3s ease, transform 0.2s ease",
                }}
                placeholder={isFocused ? "" : "🔍 Search"}
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </form>


            <Link
              to="/profile/686e703ba1875a9c9aa508c6"
              className="btn btn-light"
            >
              Profile
            </Link>


            <ul className="navbar-nav d-flex flex-row align-items-center gap-3">
              <li className="nav-item">
                <Link to="/products" className="nav-link text-light fs-5">
                  <i className="bi bi-grid-fill"></i>
                </Link>
              </li>
              <li className="nav-item position-relative">
                <Link className="nav-link text-light fs-5" to="/saved">
                  <i className="bi bi-heart-fill"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded bg-danger">
                    {savedCount}
                  </span>
                </Link>
              </li>
              <li className="nav-item position-relative">
  <Link className="nav-link text-light fs-5" to="/cart">
    <i className="bi bi-cart-fill"></i>
    {cart.length > 0 && (
      <span className="position-absolute top-0 start-100 translate-middle badge rounded bg-danger">
        {cartCount}
      </span>
    )}
  </Link>
</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
