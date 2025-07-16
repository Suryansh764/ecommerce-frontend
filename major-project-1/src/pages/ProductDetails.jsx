import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from "../useFetch";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch("http://localhost:3000/api/products");
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return <div className="text-center py-5 fs-4">Loading product details...</div>;
  if (error) return <div className="text-center text-danger py-5 fs-4">Error loading product: {error}</div>;

  const product = data?.data?.products.find((p) => p._id === id);
  if (!product) return <div className="text-center py-5 fs-4">Product not found.</div>;

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      alert("❤️ Removed from wishlist");
    } else {
      addToWishlist(product);
      alert("💖 Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    addToCart(product._id, 1);
    alert("🛒 Added to cart");
  };

  return (
    <div className="container py-5">
      <div className="mb-4" style={{ paddingTop: "20px" }}>
        <Link to="/products" className="btn btn-outline-dark">
          <i className="bi bi-arrow-left"></i> Back to Product
        </Link>
      </div>

      <div className="d-flex flex-column align-items-center">
        <div
          className="mb-5 rounded position-relative"
          style={{
            width: "100%",
            maxWidth: "1000px",
            height: "600px",
            overflow: "hidden",
            border: "16px solid white",
            borderRadius: "16px",
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px)";
            e.currentTarget.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
          }}
        >
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.title}
            className="img-fluid"
            style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "auto" }}
            onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
          />
        </div>

        <div className="text-center w-100" style={{ maxWidth: "1000px" }}>
          <h2 className="fw-bold mb-3 display-4">{product.title}</h2>
          <p className="text-muted mb-2 fs-5">by <strong>{product.artist}</strong></p>
          <span className="badge bg-secondary mb-3 px-3 py-2 fs-5">{product.category?.name || "Uncategorized"}</span>
          <h4 className="text-success fw-bold mb-3 fs-2">${product.price}</h4>
          <div className="mb-3 fs-5"><strong className="me-2">Stock:</strong>{product.stock}</div>
          <div className="mb-3 fs-5">
            <strong className="me-2">Material:</strong>{product.material}<br />
            <strong className="me-2">Dimensions:</strong>{product.dimensions}
          </div>

          <div className="my-3">
            {product.tags?.map((tag) => (
              <span key={tag} className="badge bg-success border text-light me-2 mb-2 px-3 py-2 rounded-pill fs-6">
                #{tag}
              </span>
            ))}
          </div>

          <div className="border p-4 rounded mb-5 bg-light">
            <p className="lh-lg fs-6 text-dark mb-0" style={{ fontFamily: `'Playfair Display', serif`, fontStyle: "italic", letterSpacing: "0.3px" }}>
              <span className="fs-1 text-dark me-2">“</span>
              {product.description}
              <span className="fs-1 text-dark ms-2">”</span>
            </p>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <button
              className="btn btn-lg btn-primary px-4 shadow d-flex align-items-center gap-2 fs-5"
              onClick={handleAddToCart}
            >
              <i className="bi bi-cart"></i> Buy now
            </button>

            <button
              className={`btn btn-lg px-4 shadow d-flex align-items-center gap-2 fs-5 ${
                isWishlisted ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={handleWishlist}
            >
              <i className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`}></i>
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
