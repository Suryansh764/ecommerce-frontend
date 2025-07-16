import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";

export default function CategoryProductsPage() {
  const { categoryId } = useParams();
  const { data, loading, error } = useFetch("http://localhost:3000/api/products");

  const products = data?.data?.products.filter(
    (product) => product.category?._id === categoryId
  );

  if (loading) return <div className="text-center py-5 fs-4">Loading products...</div>;
  if (error) return <div className="text-danger text-center py-5 fs-4">Error loading products: {error}</div>;

  if (!products || products.length === 0)
    return <div className="text-center py-5 fs-4">No products found for this category.</div>;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-dark">
          <i className="bi bi-arrow-left"></i> Back to Home
        </Link>
      </div>
      <h2 className="mb-4 fw-bold text-center display-5">Products in this Category</h2>

      <div className="row g-4">
        {products.map((product) => (
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
