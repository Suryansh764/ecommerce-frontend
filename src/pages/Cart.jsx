import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import AddressManager from "../components/AddressManager";

const STATIC_USER_ID = "686e703ba1875a9c9aa508c6";

export default function CartPage() {
  const { cart, removeFromCart, addToCart } = useCart();
  const [alert, setAlert] = useState(null);

  const items = cart;
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const updateQuantity = async (productId, quantity, stock) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      showAlert("danger", "Item removed from cart.");
    } else if (quantity > stock) {
      showAlert("warning", "Not enough stock available!");
    } else {
      await addToCart(productId, quantity, true);
      showAlert("info", "Quantity updated.");
    }
  };

  if (!items.length) return <p className="text-center mt-4">Your cart is empty.</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 display-5">Your Cart</h2>
      <hr />


      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show rounded-3`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="row g-5">
        <div className="col-lg-8">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="card mb-4 shadow-lg border-2 rounded-4">
              <div className="row g-0">
                <div className="col-md-4 d-flex align-items-stretch">
                  <Link to={`/products/${product._id}`} className="w-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="img-fluid rounded-start h-100"
                      style={{ objectFit: "cover", width: "100%" }}
                      onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                    />
                  </Link>
                </div>
                <div className="col-md-8">
                  <div className="card-body d-flex flex-column h-100 justify-content-between">
                    <div>
                      <h5 className="card-title mb-1">{product.title}</h5>
                      <p className="card-text text-muted mb-1">${product.price}</p>
                      <p className="text-muted small mb-2">Stock: {product.stock}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(product._id, quantity - 1, product.stock)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold">{quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(product._id, quantity + 1, product.stock)}
                      >
                        +
                      </button>
                      <button
  className="btn btn-sm btn-outline-danger ms-auto d-flex align-items-center justify-content-center"
  onClick={() => {
    removeFromCart(product._id);
    showAlert("danger", "Item removed from cart.");
  }}
  title="Remove from cart"
>
  <i className="bi bi-trash"></i>
</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow sticky-top rounded-4 p-4" style={{ top: "80px" }}>
            <h4 className="mb-3 fw-semibold">Order Summary</h4>

            <AddressManager userId={STATIC_USER_ID} />

            <p className="d-flex justify-content-between">
              <span>Total Items:</span> <span>{totalItems}</span>
            </p>
            <p className="d-flex justify-content-between fw-bold fs-5">
              <span>Total:</span> <span>${total.toLocaleString()}</span>
            </p>

            <button className="btn btn-primary w-100 mt-3 py-2 fw-bold">
              Proceed to Checkout
            </button>

            <div className="mt-3 small text-muted">
              <i className="bi bi-truck"></i> Delivery in 3–7 days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
