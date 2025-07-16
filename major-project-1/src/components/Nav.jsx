import { Link } from 'react-router-dom';
import useFetch from '../useFetch';
import { useWishlist } from "../contexts/WishlistContext";

import { useState } from 'react';

export default function Nav({ searchQuery, setSearchQuery }) {
  const { data } = useFetch("http://localhost:3000/api/products");
  const { wishlist } = useWishlist();
  const savedCount = wishlist.length; 
  const [isFocused, setIsFocused] = useState(false);


  return (

    <nav className="navbar navbar-expand-lg w-100 py-4" style={{ backgroundColor: "#030303", color: "black" }}>
      <div className="container-fluid px-5 py-3">
       <Link
  className="navbar-brand fw-bold text-light"
  style={{
    fontFamily: 'Trebuchet MS, sans-serif',
    fontSize: '40px'
  }}
  to="/"
>
  Picasso's Gallery
</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <form className="d-flex ms-auto" role="search">
          <input
  className="form-control me-2 text-center"
  type="search"
  style={{
    width: "800px",
    padding: "14px 24px",
    border: "none",
    borderColor: "#000000",
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

          <Link to="/profile/686e703ba1875a9c9aa508c6" className="d-flex ms-auto btn btn-light mx-4">
             Profile
          </Link>

          <ul className="navbar-nav">
            <li className="nav-item ms-4">
    <Link to="/products" className="nav-link text-light fs-5 mx-2 d-flex align-items-center">
  <i className="bi bi-grid-fill"></i>
</Link>

  </li>
  <li className="nav-item ms-4">
    <Link className="nav-link position-relative text-light" to="/saved">
      <i className="bi bi-heart-fill fs-5"></i>
      <span className="position-absolute top-0 start-100 translate-middle badge rounded bg-danger">
        {savedCount}
        <span className="visually-hidden">saved products</span>
      </span>
    </Link>
  </li>
  
  <li className="nav-item ms-4">
    <Link className="nav-link position-relative text-light" to="/cart">
      <i className="bi bi-cart-fill fs-5"></i>
      <span className="position-absolute top-0 start-100 translate-middle badge rounded bg-danger">
        {data?.length || 0}
        <span className="visually-hidden">cart items</span>
      </span>
    </Link>
  </li>
</ul>

        </div>
      </div>
    </nav>
  );
}
