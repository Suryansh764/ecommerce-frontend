import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../useFetch";
import { useWishlist } from "../contexts/WishlistContext";
import { useState, useEffect } from "react";


export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addresses, setAddresses] = useState([]);

  const { data: userData, loading: userLoading, error: userError } = useFetch(
    `https://ecommerce-backend-omega-orcin.vercel.app/api/users/${userId}`
  );
  const user = userData?.data?.user;

  const { data: ordersData, loading: ordersLoading, error: ordersError } = useFetch(
    `https://ecommerce-backend-omega-orcin.vercel.app/api/orders/${userId}`
  );
  const orders = ordersData?.data?.orders || [];

  useEffect(() => {
    if (user && addresses.length === 0) {
      setAddresses(user.addresses || []);
    }
  }, [user]);

 const handleDeleteAddress = async (index) => {
  try {
    
    const deletedId = addresses[index]._id;

    const res = await fetch(
      `https://ecommerce-backend-omega-orcin.vercel.app/api/users/${userId}/address/${deletedId}`,
      { method: "DELETE" }
    );

    if (!res.ok) throw new Error("Delete failed");

    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    toast.success("Address deleted successfully");
  } catch (error) {
    console.error("Delete Error:", error);
    toast.error("Failed to delete address");
  }
};


  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditForm(addresses[index]);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

 const handleSaveEdit = async () => {
  const updatedAddresses = [...addresses];
  updatedAddresses[editingIndex] = editForm;
  try {
    const res = await fetch(
      `https://ecommerce-backend-omega-orcin.vercel.app/api/users/${userId}/address`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updatedAddresses }),
      }
    );
    if (!res.ok) throw new Error("Update failed");

    const updatedUser = await res.json(); // Optional, if your backend returns user
    setAddresses(updatedAddresses);
    setEditingIndex(null);
    toast.success("Address updated successfully");
  } catch (error) {
    console.error("Error updating address:", error);
    toast.error("Failed to update address");
  }
};


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

          <div className="col-md-4 d-flex flex-column align-items-end gap-3">
            <div
              className="bg-light border p-3 rounded-3 text-center w-100"
              role="button"
              onClick={() => navigate(`/orders/${userId}`)}
              tabIndex={0}
              style={{ maxWidth: "220px", cursor: "pointer" }}
            >
              🛒 <h6 className="mt-2 mb-1">Orders</h6>
              <strong>{ordersLoading ? "..." : ordersError ? "0" : orders.length}</strong>
              <p className="text-muted small mt-1 mb-0">Click to view</p>
            </div>

            <div
              className="bg-light border p-3 rounded-3 text-center w-100"
              role="button"
              onClick={() => navigate("/saved")}
              tabIndex={0}
              style={{ maxWidth: "220px", cursor: "pointer" }}
            >
              ❤️ <h6 className="mt-2 mb-1">Wishlist</h6>
              <strong>{wishlist.length}</strong>
              <p className="text-muted small mt-1 mb-0">Click to view</p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white border rounded-4 shadow-sm p-4">
        <h4 className="mb-4 fw-semibold">Saved Addresses</h4>
        {addresses.length > 0 ? (
          <ul className="list-group list-group-flush">
            {addresses.map((addr, idx) => (
              <li className="list-group-item px-0 py-3" key={idx}>
                {editingIndex === idx ? (
                  <div className="row g-2 align-items-center">
                    {["street", "city", "state", "zipCode", "country"].map((field) => (
                      <div className="col-md-2" key={field}>
                        <input
                          type="text"
                          name={field}
                          className="form-control"
                          placeholder={field}
                          value={editForm[field] || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                    ))}
                    <div className="col-12 mt-2 d-flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={handleSaveEdit}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingIndex(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <strong>{addr.street}, {addr.city}</strong><br />
                      <span className="text-muted">{addr.state}, {addr.country} - {addr.zipCode}</span>
                    </div>
                    <div className="d-flex gap-2 mt-2 mt-md-0">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditClick(idx)}>
                        Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteAddress(idx)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No addresses saved yet.</p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

    </div>
  );
}
