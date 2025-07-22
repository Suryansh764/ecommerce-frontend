import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light px-4">
      <div className="text-center shadow p-5 rounded-4 bg-white" style={{ maxWidth: "500px" }}>
        <i className="bi bi-hourglass-split display-2 text-primary mb-3"></i>
        <h1 className="fw-bold mb-3">Coming Soon</h1>
        <p className="text-muted mb-4">
          We're working on something awesome. This page will be live very soon. Stay tuned!
        </p>

        {/* Optional: Email signup */}
        {/* <div className="input-group mb-4">
          <input
            type="email"
            className="form-control rounded-start-pill"
            placeholder="Enter your email"
          />
          <button className="btn btn-dark rounded-end-pill px-4">Notify Me</button>
        </div> */}

        <Link to="/" className="btn btn-outline-dark rounded-pill px-4">
          <i className="bi bi-arrow-left me-2"></i>Back to Home
        </Link>
      </div>
    </div>
  );
}
