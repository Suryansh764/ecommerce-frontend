import { useEffect, useState } from "react";

const BACKEND_URL = "https://ecommerce-backend-theta-lake.vercel.app";

export default function AddressManager({ userId, onSelectAddress, onAddAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${userId}`);
      const data = await res.json();
      const fetchedAddresses = data?.data?.user?.addresses || [];
      setAddresses(fetchedAddresses);

      if (fetchedAddresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(fetchedAddresses[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  const handleAdd = async () => {
    const isFormValid = Object.values(form).every((val) => val.trim() !== "");
    if (!isFormValid) return alert("Please fill in all address fields");

    const addressObj = { user: userId, ...form };

    try {
      await fetch(`${BACKEND_URL}/api/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: [addressObj] }),
      });

      setForm({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });

      await fetchAddresses();
      if (typeof onAddAddress === "function") {
        onAddAddress(); 
      }
    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  useEffect(() => {
    if (selectedAddressId && typeof onSelectAddress === "function") {
      onSelectAddress(selectedAddressId);
    }
  }, [selectedAddressId, onSelectAddress]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const selectedAddress = addresses.find((addr) => addr._id === selectedAddressId);

  return (
    <div className="mb-5">
      <h5 className="fw-semibold mb-3">Shipping Address</h5>

      {addresses.length > 0 && (
        <div className="mb-3">
          <select
            className="form-select"
            value={selectedAddressId || ""}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.street}, {addr.city} ({addr.postalCode})
              </option>
            ))}
          </select>

          {selectedAddress && (
            <div className="card mt-3 p-3 shadow-sm border rounded">
              <p className="mb-1 fw-semibold">{selectedAddress.street}</p>
              <p className="mb-1 text-muted">
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
              </p>
              <p className="mb-1 text-muted">{selectedAddress.country}</p>
              <p className="text-muted small">📞 {selectedAddress.phone}</p>
            </div>
          )}
        </div>
      )}

      <h6 className="fw-bold mt-4">Add New Address</h6>
      <div className="row g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Street"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="col-12">
          <button className="btn btn-outline-primary w-100 mt-2" onClick={handleAdd}>
            Add Address
          </button>
        </div>
      </div>
    </div>
  );
}
