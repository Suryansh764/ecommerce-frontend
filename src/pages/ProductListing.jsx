import useFetch from "../useFetch";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ProductListing() {
  const { data, loading, error } = useFetch("https://ecommerce-backend-omega-roan.vercel.app/api/products");
  const products = data?.data?.products || [];
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = (id) => wishlist.some((item) => item._id === id);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minStock, setMinStock] = useState(0);
  const [priceSort, setPriceSort] = useState("");
  const [alphaSort, setAlphaSort] = useState("");
  const [showAllFilters, setShowAllFilters] = useState(false);

  const allCategories = [...new Set(products.map((p) => p.category?.name || "Uncategorized"))];
  const maxStock = Math.max(...products.map((p) => p.stock || 0), 0);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinStock(0);
    setPriceSort("");
    setAlphaSort("");
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category?.name);
    const matchStock = product.stock >= minStock;
    return matchCategory && matchStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (alphaSort === "az") return a.title.localeCompare(b.title);
    if (alphaSort === "za") return b.title.localeCompare(a.title);
    if (priceSort === "asc") return a.price - b.price;
    if (priceSort === "desc") return b.price - a.price;
    return 0;
  });

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) {
    toast.error(`Error: ${error}`);
    return <p className="text-center text-danger mt-4">Error loading products.</p>;
  }

  return (
    <div className="container py-5">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick />

      <h2 className="mb-4 display-5">All Products</h2>
      <hr />

      <div className="row gx-5">
        {/* FILTER SIDEBAR */}
        <aside className="col-lg-3 mb-4">
          <div className="border rounded-4 shadow-sm p-4 bg-white sticky-top" style={{ top: "80px" }}>
            <h4 className="mb-4 text-center text-primary fw-semibold">🎯 Filter Products</h4>

            <div className="mb-4">
              <h6 className="text-dark fw-semibold mb-2">🗂 Categories</h6>
              {allCategories
                .slice(0, showAllFilters ? allCategories.length : 5)
                .map((cat) => (
                  <div className="form-check mb-2" key={cat}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`cat-${cat}`}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <label htmlFor={`cat-${cat}`} className="form-check-label">
                      {cat}
                    </label>
                  </div>
                ))}
            </div>

            {showAllFilters && (
              <>
                <div className="mb-4">
                  <h6 className="text-dark fw-semibold mb-2">📦 Minimum Stock</h6>
                  <input
                    type="range"
                    min={0}
                    max={maxStock}
                    value={minStock}
                    className="form-range"
                    onChange={(e) => setMinStock(Number(e.target.value))}
                  />
                  <div className="small text-muted">Showing stock ≥ <strong>{minStock}</strong></div>
                </div>

                <div className="mb-4">
                  <h6 className="text-dark fw-semibold mb-2">💰 Sort by Price</h6>
                  {["", "asc", "desc"].map((val) => (
                    <div className="form-check mb-1" key={val}>
                      <input
                        type="radio"
                        name="priceSort"
                        id={`price-${val || "default"}`}
                        value={val}
                        checked={priceSort === val}
                        onChange={(e) => setPriceSort(e.target.value)}
                        className="form-check-input"
                      />
                      <label htmlFor={`price-${val || "default"}`} className="form-check-label">
                        {val === "" ? "Default" : val === "asc" ? "Low to High" : "High to Low"}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h6 className="text-dark fw-semibold mb-2">🔤 Sort Alphabetically</h6>
                  {["", "az", "za"].map((val) => (
                    <div className="form-check mb-1" key={val}>
                      <input
                        type="radio"
                        name="alphaSort"
                        id={`alpha-${val || "default"}`}
                        value={val}
                        checked={alphaSort === val}
                        onChange={(e) => setAlphaSort(e.target.value)}
                        className="form-check-input"
                      />
                      <label htmlFor={`alpha-${val || "default"}`} className="form-check-label">
                        {val === "" ? "Default" : val === "az" ? "A to Z" : "Z to A"}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="d-flex flex-column gap-2 mt-4">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowAllFilters(!showAllFilters)}
              >
                {showAllFilters ? "Show Less Filters" : "Show More Filters"}
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={clearFilters}
                disabled={
                  selectedCategories.length === 0 &&
                  minStock === 0 &&
                  priceSort === "" &&
                  alphaSort === ""
                }
              >
                Clear Filters
              </button>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <section className="col-lg-9">
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product._id} className="col">
                  <div className="card h-100 shadow-lg border-0 hover-shadow transition">
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={product.image || "/placeholder.jpg"}
                        alt={product.title}
                        onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                        className="card-img-top rounded-top"
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </Link>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.title}</h5>

                      <span
                        className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 fs-6 rounded-3"
                        style={{
                          backgroundColor: "#f4f4f4",
                          color: "#333",
                          fontWeight: 500,
                          fontFamily: "Trebuchet MS, sans-serif",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                          maxWidth: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        <i className="bi bi-tags-fill text-muted"></i>
                        <span className="text-truncate">{product.category?.name || "Uncategorized"}</span>
                      </span>

                      <p
                        className="card-text"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.description}
                      </p>
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-success">${product.price}</span>
                        <div className="d-flex align-items-center gap-3">
                          <span className="badge bg-success fs-6">Stock: {product.stock}</span>
                          <button
                            className="bg-transparent border-0 p-0"
                            style={{
                              fontSize: "1.5rem",
                              color: isWishlisted(product._id) ? "#dc3545" : "#6c757d",
                              cursor: "pointer",
                            }}
                            title={isWishlisted(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            onClick={() => {
                              if (isWishlisted(product._id)) {
                                removeFromWishlist(product._id);
                                toast.info("Removed from wishlist.");
                              } else {
                                addToWishlist(product._id);
                                toast.success("Added to wishlist.");
                              }
                            }}
                          >
                            <i className={isWishlisted(product._id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No products match your filters.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
