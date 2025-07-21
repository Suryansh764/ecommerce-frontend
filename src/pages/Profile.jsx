import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../useFetch";
import { useWishlist } from "../contexts/WishlistContext";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();


  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetch(`https://ecommerce-backend-three-tau.vercel.app/api/users/${userId}`);
  const user = userData?.data?.user;


  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useFetch(`https://ecommerce-backend-three-tau.vercel.app/api/orders/${userId}`);
  const orders = ordersData?.data?.orders || [];

  if (userLoading)
    return <div className="text-center py-5 fs-4">Loading profile...</div>;

  if (userError || !user)
    return (
      <div className="text-center text-danger py-5 fs-4">
        Error loading profile.
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="mb-4 display-5">Your Profile</h2>
      <hr />


      <div className="p-4 rounded-4 shadow-lg mb-5 bg-white border">
        <div className="row align-items-center">
          <div className="col-md-8 d-flex gap-4 align-items-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCTsAgU63zASkq9kuDF7JKf4C2HjkqETuHUw&s"
              alt={user.name}
              className="rounded-circle border"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                boxShadow: "0 0 8px rgba(0,0,0,0.1)",
              }}
            />
            <div>
              <h2 className="fw-bold mb-1">{user.name}</h2>
              <p className="text-muted mb-2">{user.email}</p>
              <p className="fst-italic mb-0">
                {user.bio || "This user hasn't written a bio yet."}
              </p>
            </div>
          </div>


          <div className="col-md-4">
            <div className="d-flex flex-column align-items-end gap-3">

              <div
                className="bg-light border p-3 rounded-3 text-center"
                role="button"
                onClick={() => navigate(`/orders/${userId}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/orders/${userId}`)}
                tabIndex={0}
                style={{
                  width: "100%",
                  maxWidth: "220px",
                  transition: "0.3s",
                  cursor: "pointer",
                }}
              >
                🛒 <h6 className="mt-2 mb-1">Orders</h6>
                {ordersLoading ? (
                  <strong>...</strong>
                ) : ordersError ? (
                  <strong>0</strong>
                ) : (
                  <strong>{orders.length}</strong>
                )}
                <p className="text-muted small mt-1 mb-0">Click to view</p>
              </div>

              {/* Wishlist */}
              <div
                className="bg-light border p-3 rounded-3 text-center"
                role="button"
                onClick={() => navigate("/saved")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/saved")}
                tabIndex={0}
                style={{
                  width: "100%",
                  maxWidth: "220px",
                  transition: "0.3s",
                  cursor: "pointer",
                }}
              >
                ❤️ <h6 className="mt-2 mb-1">Wishlist</h6>
                <strong>{wishlist.length}</strong>
                <p className="text-muted small mt-1 mb-0">Click to view</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white border rounded-4 shadow-sm p-4">
        <h4 className="mb-4 fw-semibold">Saved Addresses</h4>
        {user.addresses?.length > 0 ? (
          <ul className="list-group list-group-flush">
            {user.addresses.map((addr, idx) => (
              <li className="list-group-item px-0 py-3" key={idx}>
                <strong>
                  {addr.street}, {addr.city}
                </strong>
                <br />
                <span className="text-muted">
                  {addr.state}, {addr.country} - {addr.zipCode}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No addresses saved yet.</p>
        )}
      </div>
    </div>
  );
}
