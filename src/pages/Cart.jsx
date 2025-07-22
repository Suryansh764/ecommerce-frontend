import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import AddressManager from "../components/AddressManager";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATIC_USER_ID = "686e703ba1875a9c9aa508c6";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, addToCart, clearCart } = useCart();
  const { wishlist, addToWishlist } = useWishlist();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const items = cart;
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const showAlert = (type, message) => {
    if (type === "success") toast.success(message);
    else if (type === "danger") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast.info(message);
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

  const handlePlaceOrder = async () => {
    if (!isConfirmed || !selectedAddressId || !paymentMethod) {
      showAlert("danger", "Please confirm order, select address and payment method.");
      return;
    }

    try {
      const orderData = {
        user: STATIC_USER_ID,
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: total,
        shippingAddress: selectedAddressId,
        paymentMethod,
      };

      const response = await fetch("https://ecommerce-backend-nu-rosy.vercel.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Backend error response:", errorMessage);
        throw new Error("Failed to place order");
      }

      setOrderPlaced(true);
      showAlert("success", "Order placed successfully!");

      setTimeout(() => {
        clearCart();
        navigate("/orders/686e703ba1875a9c9aa508c6");
      }, 4000);
    } catch (error) {
      console.error("Error placing order:", error);
      showAlert("danger", "Failed to place order. Try again.");
    }
  };

  if (!items.length)
    return (
      <div className="text-center py-5">
        <ToastContainer position="top-center" autoClose={3000} />
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty Cart"
          style={{ width: "120px", opacity: 0.7 }}
          className="mb-4"
        />
        <h4 className="fw-semibold mb-2">Your Cart is Empty</h4>
        <p className="text-muted mb-4">Looks like you haven’t added anything yet.</p>
        <a href="/saved" className="btn btn-secondary px-4 py-2 rounded-pill">
          Check Wishlist
        </a>
        <div className="mt-4">
          <Link to="/orders/686e703ba1875a9c9aa508c6" className="btn btn-outline-dark rounded-pill px-4">
            View Recent Orders
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="mb-4 display-5">Your Cart</h2>
      <hr />

      <div className="row g-5">
        <div className="col-lg-8">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="card mb-4 p-3 border-0 shadow-lg rounded-5">
              <div className="row g-4 align-items-center">
                <div className="col-md-4">
                  <Link to={`/products/${product._id}`} className="d-block rounded overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="img-fluid rounded-4"
                      style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
                      onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                    />
                  </Link>
                </div>
                <div className="col-md-8">
                  <div className="d-flex flex-column justify-content-between h-100">
                    <div>
                      <h5 className="fw-bold mb-2">{product.title}</h5>
                      <p className="text-muted mb-1">${product.price}</p>
                      <p className="text-muted small mb-3">Stock: {product.stock}</p>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <button
                          className="btn btn-sm btn-outline-dark px-3"
                          onClick={() => updateQuantity(product._id, quantity - 1, product.stock)}
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="fw-bold fs-5 px-2">{quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-dark px-3"
                          onClick={() => updateQuantity(product._id, quantity + 1, product.stock)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2 rounded-4 shadow-sm"
                        onClick={() => {
                          removeFromCart(product._id);
                          showAlert("danger", "Item removed from cart.");
                        }}
                        title="Remove from cart"
                      >
                        <i className="bi bi-trash-fill"></i> Delete
                      </button>

                      <button
                        className="btn btn-outline-primary d-flex align-items-center gap-2 px-3 py-2 rounded-4 shadow-sm"
                        onClick={async () => {
                          const existsInWishlist = wishlist.some((item) => item._id === product._id);
                          if (existsInWishlist) {
                            showAlert("info", "Already in wishlist.");
                          } else {
                            await addToWishlist(product._id);
                            await removeFromCart(product._id);
                            showAlert("success", "Moved to wishlist.");
                          }
                        }}
                        title="Move to Wishlist"
                      >
                        <i className="bi bi-heart-fill text-danger"></i> Wishlist
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

            <AddressManager
              userId={STATIC_USER_ID}
              onSelectAddress={(id) => setSelectedAddressId(id)}
              onAddAddress={() => showAlert("success", "New address added successfully!")}
            />

            <h6 className="fw-bold mt-4">Select Payment Method *</h6>
            <select
              className="form-select mt-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select payment method</option>
              <option value="UPI">UPI</option>
              <option value="GPay">GPay</option>
              <option value="Paytm">Paytm</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>

        <h6 className="fw-bold fs-5 mt-4">Item(s) Summary</h6>
        <hr className="my-2" />
<ul className="list-group list-group-flush mb-3">
  {items.map(({ product, quantity }) => (
    <li
      key={product._id}
      className="list-group-item px-0 d-flex justify-content-between align-items-center border-0 pb-2"
      style={{ borderBottom: "1px dashed #ccc" }}
    >
      <div>
        <div className="fw-semibold">{product.title}</div>
        <div className="text-muted small">Qty: {quantity} × ${product.price.toFixed(2)}</div>
      </div>
      <div className="fw-bold text-end">${(product.price * quantity).toFixed(2)}</div>
    </li>
  ))}
</ul>




            <p className="d-flex mt-4 justify-content-between">
              <span><strong>Total Count:</strong></span> <span className="fs-5">{totalItems}</span>
            </p>
            <p className="d-flex justify-content-between fw-bold fs-5">
              <span>Total:</span> <span>${total.toLocaleString()}</span>
            </p>

          <div className="border rounded-4 p-3 mb-3 bg-light shadow-sm">
  <div className="form-check d-flex align-items-start">
    <input
      className="form-check-input mt-1 me-3"
      type="checkbox"
      id="confirmCheckbox"
      checked={isConfirmed}
      onChange={(e) => setIsConfirmed(e.target.checked)}
      style={{
        width: "1.2rem",
        height: "1.2rem",
        cursor: "pointer",
        accentColor: "#198754",
        border: "2px solid #198754",
        boxShadow: "0 0 0 2px rgba(25, 135, 84, 0.25)",
        transition: "all 0.3s ease"
      }}
    />
    <label className="form-check-label" htmlFor="confirmCheckbox" style={{ lineHeight: "1.5" }}>
      <span className="fw-semibold">I’ve confirmed the following:</span>
      <ul className="mb-1 mt-2 ps-3 text-muted small">
        <li>Shipping address</li>
        <li>Payment method</li>
        <li>Order details</li>
      </ul>
    </label>
  </div>

  {/* ✅ Conditional warning message */}
  {!isConfirmed && (
    <div className="alert alert-warning mt-3 mb-0 py-2 px-3 rounded-3 small d-flex align-items-center gap-2">
      <i className="bi bi-exclamation-triangle-fill text-warning"></i>
      Please confirm all details above to proceed with your order.
    </div>
  )}
</div>



            <button
              className="btn btn-primary w-100 mt-1 py-2 fw-bold"
              disabled={!isConfirmed || !paymentMethod || !selectedAddressId}
              onClick={handlePlaceOrder}
            >
              Proceed to Checkout
            </button>

            <div className="mt-3 small text-muted">
              <i className="bi bi-truck"></i> Shipping in 2–3 days
            </div>

            {orderPlaced && (
              <div className="alert alert-success alert-dismissible fade show rounded-4 shadow-sm text-center fs-5 fw-medium mt-4 py-4">
                🎉 Congratulations! Order placed. Redirecting to recent orders...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
