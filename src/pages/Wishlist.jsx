import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext"; 
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, cart } = useCart();
  const [alert, setAlert] = useState(null);

  
  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

if (wishlist.length === 0)
  return (
    <div className="text-center py-5">
      <img
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
        alt="Empty Wishlist"
        style={{ width: "120px", opacity: 0.75 }}
        className="mb-4"
      />
      <h4 className="fw-semibold mb-2">Your Wishlist is Empty</h4>
      <p className="text-muted mb-4">Save items you love by clicking the ❤️ icon.</p>
      <a href="/products" className="btn btn-secondary  px-4 py-2 rounded-pill">
        Browse Products
      </a>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 display-5">Your Wishlist</h2>
      <hr />

     
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show rounded-3`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {wishlist.map((product) => (
          <div className="col" key={product._id}>
            <div className="card h-100 shadow-lg border-0">
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.title}
                  style={{ height: "400px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text text-muted mb-4">{product.description}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="fw-bold fs-5 text-success">${product.price}</span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        const alreadyInCart = cart.some(item => item.product._id === product._id);
                        if (alreadyInCart) {
                          setAlert({ type: "warning", message: "Product already exists in cart." });
                        } else {
                          await addToCart(product._id);
                          setAlert({ type: "success", message: `${product.title} added to cart.` });
                        }
                      }}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="btn btn-outline-danger"
                      onClick={() => {
                        removeFromWishlist(product._id);
                        setAlert({ type: "danger", message: `${product.title} removed from wishlist.` });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
