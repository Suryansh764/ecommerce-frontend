import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../useFetch";

const STATIC_USER_ID = "686e703ba1875a9c9aa508c6";

export default function CartPage() {
  const { data, loading, error } = useFetch(`https://ecommerce-backend-nu-five.vercel.app/api/cart/${STATIC_USER_ID}`);
  const cartItems = data?.data?.items || [];

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (cartItems.length) {
      setItems(cartItems);
      calculateTotal(cartItems);
    }
  }, [cartItems]);

  const calculateTotal = (list) => {
    const sum = list.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = async (productId, quantity) => {
    const product = items.find((item) => item.product._id === productId)?.product;
    if (quantity <= 0) return removeItem(productId);
    if (quantity > product.stock) return alert("🚫 Not enough stock available!");

    const res = await fetch("https://ecommerce-backend-nu-five.vercel.app/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: STATIC_USER_ID, productId, quantity }),
    });

    if (res.ok) {
      const updated = items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      setItems(updated);
      calculateTotal(updated);
    }
  };

  const removeItem = async (productId) => {
    const res = await fetch("https://ecommerce-backend-nu-five.vercel.app/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: STATIC_USER_ID, productId }),
    });
    if (res.ok) {
      const updated = items.filter((item) => item.product._id !== productId);
      setItems(updated);
      calculateTotal(updated);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading cart...</p>;
  if (error) return <p className="text-center text-danger mt-4">Error fetching cart</p>;
  if (!items.length) return <p className="text-center mt-4">Your cart is empty.</p>;

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">🛍 Your Cart</h2>
      <div className="row g-5">

        {/* Cart Items */}
        <div className="col-lg-8">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="card mb-4 shadow-sm border-0 rounded-4">
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
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold">{quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger ms-auto"
                        onClick={() => removeItem(product._id)}
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

        {/* Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow sticky-top rounded-4 p-4" style={{ top: "80px" }}>
            <h4 className="mb-3 fw-semibold">Order Summary</h4>
            <p className="d-flex justify-content-between">
              <span>Total Items:</span> <span>{items.length}</span>
            </p>
            <p className="d-flex justify-content-between fw-bold fs-5">
              <span>${total.toLocaleString()}</span>

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
