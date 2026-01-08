import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function ClubLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/club/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/club-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Club login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Club Admin</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem" }}>
          Manage your club and events
        </p>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            padding: "0.75rem",
            borderRadius: "var(--radius)",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={login}>
          <div>
            <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="club@uni.edu"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Login
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem" }}>
          <Link to="/" style={{ color: "var(--text-muted)" }}>Back to Home</Link>
          <span style={{ margin: "0 0.5rem", color: "var(--border)" }}>|</span>
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: "600" }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
