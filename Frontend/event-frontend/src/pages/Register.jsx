import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    studentId: "",
    department: "",
    batch: "",
    email: "",
    password: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (role === "student") {
        await API.post("/auth/student/register", {
          name: form.name,
          studentId: form.studentId,
          department: form.department,
          batch: form.batch,
          email: form.email,
          password: form.password,
        });
        navigate("/student-login");
      } else {
        await API.post("/auth/club/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          description: form.description,
        });
        navigate("/club-login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card" style={{ maxWidth: "500px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Create Account</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem" }}>
          Join us as a {role === "student" ? "Student" : "Club Admin"}
        </p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
          <button
            className={`btn ${role === "student" ? "btn-primary" : "btn-outline"}`}
            style={{ flex: 1 }}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`btn ${role === "club" ? "btn-primary" : "btn-outline"}`}
            style={{ flex: 1 }}
            onClick={() => setRole("club")}
          >
            Club
          </button>
        </div>

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

        <form onSubmit={submit}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            
            {role === "student" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <input name="studentId" placeholder="Student ID" onChange={handleChange} required style={{ marginBottom: 0 }} />
                  <input name="batch" placeholder="Batch (e.g. 2024)" onChange={handleChange} required style={{ marginBottom: 0 }} />
                </div>
                <input name="department" placeholder="Department" onChange={handleChange} required />
              </>
            )}

            <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

            {role === "club" && (
              <textarea
                name="description"
                placeholder="Club Description"
                onChange={handleChange}
                required
                rows="3"
              />
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem" }}>
            Register
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "var(--primary)", fontWeight: "600" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
