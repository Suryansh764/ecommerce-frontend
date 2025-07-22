import { useParams, Link } from "react-router-dom";
import useFetch from "../useFetch";
import { useState } from "react";

export default function CategoryProductsPage() {
  const { categoryId } = useParams();
  const { data, loading, error } = useFetch(`https://ecommerce-backend-nu-rosy.vercel.app/api/products?category=${categoryId}`);
  const products = data?.data?.products || [];

  const [minStock, setMinStock] = useState(0);
  const [priceSort, setPriceSort] = useState("");
  const [alphaSort, setAlphaSort] = useState("");

  const maxStock = Math.max(...products.map((p) => p.stock || 0), 0);

  const clearFilters = () => {
    setMinStock(0);
    setPriceSort("");
    setAlphaSort("");
  };

  const filteredProducts = products.filter((product) => product.stock >= minStock);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (alphaSort === "az") return a.title.localeCompare(b.title);
    if (alphaSort === "za") return b.title.localeCompare(a.title);
    if (priceSort === "asc") return a.price - b.price;
    if (priceSort === "desc") return b.price - a.price;
    return 0;
  });

  if (loading) return <div className="text-center py-5 fs-4">Loading products...</div>;
  if (error) return <div className="text-danger text-center py-5 fs-4">Error loading products: {error}</div>;
  if (!products || products.length === 0) return <div className="text-center py-5 fs-4">No products found for this category.</div>;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-dark">
          <i className="bi bi-arrow-left"></i> Back to Home
        </Link>
      </div>
      <h2 className="mb-4 fw-bold text-center display-5">Products in this Category</h2>

      <div className="mb-4 row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Sort by Price</label>
          <select
            className="form-select"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="">Default</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Sort Alphabetically</label>
          <select
            className="form-select"
            value={alphaSort}
            onChange={(e) => setAlphaSort(e.target.value)}
          >
            <option value="">Default</option>
            <option value="az">A to Z</option>
            <option value="za">Z to A</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Minimum Stock: {minStock}</label>
          <input
            type="range"
            className="form-range"
            min={0}
            max={maxStock}
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
          />
        </div>

        <div className="col-12 text-end">
          <button className="btn btn-sm btn-outline-danger" onClick={clearFilters} disabled={minStock === 0 && priceSort === "" && alphaSort === ""}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="row g-4">
        {sortedProducts.map((product) => (
          <div key={product._id} className="col-md-4">
            <div
              className="card h-100 shadow border-0 transition-hover"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={product.image || "/placeholder.jpg"}
                className="card-img-top"
                style={{ height: "300px", objectFit: "cover" }}
                alt={product.title}
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">{product.title}</h5>
                <p className="text-muted">{product.artist}</p>
                <p className="fw-bold text-success">₹{product.price}</p>
                <Link
                  to={`/products/${product._id}`}
                  className="btn btn-outline-dark mt-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
