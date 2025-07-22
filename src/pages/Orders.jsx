import useFetch from "../useFetch";
import { useParams, Link } from "react-router-dom";

export default function Orders() {
  const { userId } = useParams();
  const { data, loading, error } = useFetch(
    `https://ecommerce-backend-theta-lake.vercel.app/api/orders/${userId}`
  );
  const orders = data?.data?.orders || [];

  if (loading)
    return <div className="text-center py-5 fs-4">Loading orders...</div>;
  if (error)
    return (
      <div className="text-center text-danger py-5 fs-4">
        Error loading orders.
      </div>
    );

  return (
    <div className="container py-5">
      {/* Back to Profile */}
      <div className="mb-4">
        <Link to="/profile/686e703ba1875a9c9aa508c6" className="btn btn-outline-dark">
          <i className="bi bi-arrow-left"></i> Back to Profile
        </Link>
      </div>

      <h2 className="mb-4 display-5 fw-bold">Your Orders</h2>
      <hr />

      {orders.length === 0 ? (
        <p className="text-muted">You haven't placed any orders yet.</p>
      ) : (
        <div className="row gy-4">
          {orders.map((order) => (
            <div className="col-12" key={order._id}>
              <div className="card shadow border-0 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-semibold mb-0">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h5>
                    <span className="text-muted small">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  {/* Order Items */}
                  {order.items.map((item, i) => (
                    <Link
                      to={`/products/${item.product?._id}`}
                      key={i}
                      className="text-decoration-none text-dark"
                    >
                      <div className="d-flex align-items-center justify-content-between border rounded-3 p-3 mb-2 bg-light hover-shadow">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.product?.image}
                            alt={item.product?.title}
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            className="rounded-3 me-3"
                          />
                          <div>
                            <div className="fw-semibold">{item.product?.title || "Product"}</div>
                            <div className="text-muted small">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="fw-semibold text-end">
                          ${(item.product?.price || 0) * item.quantity}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Payment + Address + Total */}
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="small text-muted">
                      <div>Payment: {order.paymentMethod}</div>
                      <div>
                        Shipping to: {order.shippingAddress?.street},{" "}
                        {order.shippingAddress?.city}
                      </div>
                    </div>
                    <h5 className="text-success fw-bold mb-0">
                      ${order.totalAmount}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
