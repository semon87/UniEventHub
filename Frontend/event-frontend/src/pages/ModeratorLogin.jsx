import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Eye, EyeOff } from "lucide-react";

export default function ModeratorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("mod@uni.edu");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/moderator/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      navigate("/moderator/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#09090b",
      color: "var(--text-main)",
      position: "relative",
      overflow: "hidden" 
    }}>
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>

      <div className="card" style={{ maxWidth: "400px", width: "100%", padding: "2rem", border: "1px solid #27272a", background: "#18181b", borderRadius: "16px", zIndex: 1, position: "relative" }}>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")}
          style={{ 
            position: "absolute", 
            top: "1rem", 
            left: "1rem", 
            background: "transparent", 
            color: "#a1a1aa", 
            border: "none", 
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          ← Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "2rem", marginTop: "1rem", fontSize: "1.8rem", fontWeight: "800" }}>Moderator Access</h2>
        
        {error && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            color: "#ef4444", 
            padding: "0.75rem", 
            borderRadius: "8px", 
            marginBottom: "1rem",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa", fontSize: "0.9rem" }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "#27272a", border: "1px solid #3f3f46", color: "white", outline: "none" }}
            />
          </div>
          
          <div style={{ marginBottom: "2rem", position: "relative" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa", fontSize: "0.9rem" }}>Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "#27272a", border: "1px solid #3f3f46", color: "white", outline: "none" }}
            />
            <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "10px", top: "35px", background: "transparent", color: "#a1a1aa", border: "none", cursor: "pointer" }}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "white", fontWeight: "600", border: "none", cursor: "pointer" }}>Login</button>
        </form>
      </div>
    </div>
  );
}
