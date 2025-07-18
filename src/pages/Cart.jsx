import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import AddressManager from "../components/AddressManager";

const STATIC_USER_ID = "686e703ba1875a9c9aa508c6";

export default function CartPage() {
  const { cart, removeFromCart, addToCart } = useCart();
  const [alert, setAlert] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
const [paymentMethod, setPaymentMethod] = useState("");



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

  const handlePlaceOrder = async () => {
  if (!isConfirmed || !selectedAddressId || !paymentMethod) {
    showAlert("danger", "Please confirm order, select address and payment method.");
    return;
  }

  try {
    const orderData = {
      userId: STATIC_USER_ID,
      items: items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount: total,
      shippingAddress: selectedAddressId,
      paymentMethod,
    };

    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error("Failed to place order");

    setOrderPlaced(true);
    showAlert("success", "Order placed successfully!");
  } catch (error) {
    console.error(error);
    showAlert("danger", "Failed to place order. Try again.");
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

      {orderPlaced && (
        <div className="alert alert-success alert-dismissible fade show rounded-4 shadow-sm text-center fs-5 fw-medium mt-4 py-4">
          🎉 Congratulations! Order placed. We will ship the order very soon.
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

    <AddressManager
  userId={STATIC_USER_ID}
  onSelectAddress={(id) => setSelectedAddressId(id)}
/>

<h6 className="fw-bold mt-4">Select Payment Method</h6>
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


    <p className="d-flex justify-content-between">
      <span>Total Items:</span> <span>{totalItems}</span>
    </p>
    <p className="d-flex justify-content-between fw-bold fs-5">
      <span>Total:</span> <span>${total.toLocaleString()}</span>
    </p>

    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        id="confirmCheckbox"
        checked={isConfirmed}
        onChange={(e) => setIsConfirmed(e.target.checked)}
      />
      <label className="form-check-label" htmlFor="confirmCheckbox">
        I've confirmed my order quantity and shipping address
      </label>
    </div>

    <button
  className="btn btn-primary w-100 mt-1 py-2 fw-bold"
  disabled={!isConfirmed || !paymentMethod || !selectedAddressId}
  onClick={handlePlaceOrder}
>
  Proceed to Checkout
</button>


    {orderPlaced && (
      <div className="alert alert-success mt-3 rounded-3 text-center">
        <strong>🎉 Congratulations!</strong> Order placed. We will ship the order very soon.
      </div>
    )}

    <div className="mt-3 small text-muted">
      <i className="bi bi-truck"></i> Delivery in 3–7 days
    </div>
  </div>
</div>

      </div>
    </div>
  );
}
