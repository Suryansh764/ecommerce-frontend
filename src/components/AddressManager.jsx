import { useEffect, useState } from "react";

const BACKEND_URL = "https://localhost:3000"; // Replace with your backend URL
export default function AddressManager({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${userId}/addresses`);
      const data = await res.json();
      setAddresses(data?.data?.user?.addresses || []);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  const handleAdd = async () => {
    if (!newAddress.trim()) return;

    const addressObj = {
      user: userId,
      address: newAddress.trim(),
    };

    try {
      await fetch(`${BACKEND_URL}/api/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: [addressObj] }),
      });
      setNewAddress("");
      fetchAddresses();
    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="mb-4">
      <h5 className="fw-semibold">Shipping Address</h5>
      {addresses.length > 0 ? (
        <ul className="list-group mb-2">
          {addresses.map((addr) => (
            <li key={addr._id} className="list-group-item small text-muted">
              {addr.address}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted small">No saved addresses yet.</p>
      )}

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={newAddress}
          placeholder="Add new address"
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}
