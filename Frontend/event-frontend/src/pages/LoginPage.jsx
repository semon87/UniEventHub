import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPhotoUrl } from "../utils/imageUrl";
import axios, { BASE_URL } from "../api/axios";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [showLogin, setShowLogin] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLoginClick = (selectedRole) => {
    setRole(selectedRole);
    setShowLogin(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const url = role === "student" ? "/auth/student/login" : "/auth/club/login";
      const res = await axios.post(url, { email, password });
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(role === "student" ? "/browse-events" : "/club-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const [sliderEvents, setSliderEvents] = useState([]);
  const [currentIndex, setUrlIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events"); // Public endpoint
        // Response format is { success: true, count: N, data: [...] }
        setSliderEvents(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch events for slider", err);
      }
    };
    fetchEvents();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (sliderEvents.length === 0) return;
    
    const interval = setInterval(() => {
      setUrlIndex((prev) => (prev >= sliderEvents.length - 2 ? 0 : prev + 1));
    }, 2000); // Auto slide every 2s

    return () => clearInterval(interval);
  }, [sliderEvents]);

  const nextSlide = () => {
    setUrlIndex((prev) => (prev >= sliderEvents.length - 2 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setUrlIndex((prev) => (prev === 0 ? sliderEvents.length - 2 : prev - 1));
  };



  /* Removed smooth scroll logic */

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "var(--bg-primary)" }}>
      {/* Background Orbs */}
      <div style={{
        position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw",
        background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 70%)",
        filter: "blur(80px)", zIndex: 0
      }}></div>
      <div style={{
        position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw",
        background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(0,0,0,0) 70%)",
        filter: "blur(80px)", zIndex: 0
      }}></div>
      
      {/* Central Neon Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "60vw", height: "60vw",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
        filter: "blur(100px)", zIndex: 0, pointerEvents: "none"
      }}></div>

      {/* Navbar */}
      <nav className="container landing-nav">
        <div style={{ marginLeft: "2rem", fontSize: "1.5rem", fontWeight: "800", background: "linear-gradient(to right, white, var(--text-muted))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          UniEventHub
        </div>
        <div className="nav-links" style={{ width: "32px", height: "32px",marginLeft: "15rem" }}>
          <span style={{ cursor: "pointer", color: "white" }} onClick={() => navigate("/")}>Home</span>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/developers")}>Developers</span>
        </div>
        <div >
          
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container" style={{ position: "relative", zIndex: 10, marginTop: "4rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingBottom: "4rem" }}>
        <h1 className="hero-title">
          Welcome to <br /> UniEventHub
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "600px", marginBottom: "3rem", padding: "0 1rem" }}>
          The ultimate platform for university events. Discover, join, and organize events with a seamless premium experience.
        </p>

        <div className="hero-buttons">
          <button 
            className="btn" 
            style={{ 
              background: "linear-gradient(135deg, #6366f1, #a855f7)", 
              color: "white", padding: "1.2rem", fontSize: "1.1rem",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)"
            }}
            onClick={() => handleLoginClick("student")}
          >
            Student Login
          </button>
          <button 
            className="btn" 
            style={{ 
              background: "transparent", border: "1px solid var(--accent)", color: "var(--accent)",
              padding: "1.2rem", fontSize: "1.1rem"
            }}
            onClick={() => handleLoginClick("club")}
          >
            Club Login
          </button>
        </div>

       

        {/* Interactive Event Carousel (Tickify Style) */}
        {sliderEvents.length > 0 && (
          <div className="carousel-container">
            <h2 style={{ 
              textAlign: "center", 
              marginBottom: "3rem", 
              fontSize: "clamp(2rem, 4vw, 3rem)", 
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "4px",
              background: "linear-gradient(to right, #ffffff, var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 10px rgba(139, 92, 246, 0.3))"
            }}>
              Happenings on Campus
            </h2>
            
            <div className="carousel-wrapper">
              <button className="carousel-btn prev" onClick={prevSlide}>
                ←
              </button>
              
              <div className="carousel-track-container">
                <div 
                  className="carousel-track" 
                  style={{ transform: `translateX(-${currentIndex * 50}%)` }}
                >
                  {sliderEvents.map((event, index) => (
                    <div key={event._id} className="carousel-slide">
                      <div className="carousel-card">
                        <img 
                          src={getPhotoUrl(event.coverImage) || "https://placehold.co/800x400"} 
                          alt={event.title} 
                          className="carousel-image" 
                        />
                        <div className="carousel-overlay">
                            <h3>{event.title}</h3>
                            <p>📅 {new Date(event.startDateTime).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="carousel-btn next" onClick={nextSlide}>
                →
              </button>
            </div>
          </div>
        )}
          {/* Feature Cards / Preview */}
        <div className="feature-grid">
          {[
            { title: "Upcoming Events", desc: "Browse the latest hackathons and workshops.", icon: "📅", color: "var(--primary)" },
            { title: "Popular Societies", desc: "Join clubs that match your interests.", icon: "🚀", color: "var(--accent)" },
            { title: "Latest News", desc: "Stay updated with campus activities.", icon: "📰", color: "var(--secondary)" }
          ].map((card, i) => (
            <div key={i} className="glass-panel" style={{ 
              textAlign: "left", padding: "1rem"
            }}>
              <div style={{ 
                width: "40px", height: "40px", borderRadius: "8px", marginBottom: "1rem",
                background: `linear-gradient(135deg, ${card.color}22, ${card.color}44)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem"
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "var(--text-main)" }}>{card.title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{card.desc}</p>
            </div>
          ))}
        </div>
        {/* Detailed Features Section */}
        <section style={{ marginTop: "8rem", width: "100%", paddingBottom: "4rem" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", marginBottom: "3rem", textAlign: "center" }}>Why UniEventHub?</h2>
          
          <div className="why-section-grid">
            {/* Feature 1: For Students */}
            <div style={{ textAlign: "left", position: "relative", padding: "2rem", borderRadius: "16px", backdropFilter: "blur(10px)", border: "1px solid var(--glass-border)", overflow: "hidden" }}>
              {/* Ambient Glow */}
              <div style={{ position: "absolute", top: "-50%", left: "-30%", width: "150%", height: "150%", background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }}></div>
              <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{ fontSize: "1.8rem", color: "var(--primary)", marginBottom: "1rem" }}>For Students</h3>
              <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Never miss out on campus life. Get personalized recommendations, one-click registration, and all your tickets in one place.
              </p>
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.5rem" }}>
                {["⚡ Instant Registration", "📅 Calendar Sync", "🔔 Live Updates"].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1rem" }}>
                    <span style={{ color: "var(--accent)" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              </div>
            </div>
            
            {/* Feature 1 */}
            <div className="glass-panel" style={{ background: "linear-gradient(135deg, var(--glass-bg), rgba(255,255,255,0.05))", height: "250px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 0 }}>
              <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", bottom: "20px", border: "2px dashed var(--border)", borderRadius: "12px" }}></div>
              <span style={{ fontSize: "5rem" }}>🎓</span>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel" style={{ background: "linear-gradient(135deg, var(--glass-bg), rgba(255,255,255,0.05))", height: "250px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 0 }}>
              <div style={{ position: "absolute", inset: "0", background: "conic-gradient(from 180deg at 50% 50%, var(--secondary) 0deg, transparent 60deg)", opacity: 0.2 }}></div>
              <span style={{ fontSize: "5rem" }}>📊</span>
            </div>

            {/* Feature 2: For Club Organizers */}
            <div style={{ textAlign: "left", position: "relative", padding: "2rem", borderRadius: "16px", backdropFilter: "blur(10px)", border: "1px solid var(--glass-border)", overflow: "hidden" }}>
              {/* Ambient Glow - Teal/Secondary */}
              <div style={{ position: "absolute", top: "-50%", right: "-30%", width: "150%", height: "150%", background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }}></div>
              <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{ fontSize: "1.8rem", color: "var(--primary)", marginBottom: "1rem" }}>For Club Organizers</h3>
              <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Manage your events like a pro. Track attendance, manage budgets, and engage with your community effortlessly.
              </p>
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.5rem" }}>
                {["👥 Participant Tracking", "💰 Fee Collection", "📈 Engagement Analytics"].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1rem" }}>
                    <span style={{ color: "var(--accent)" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Login Modal/Overlay */}
      {showLogin && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "400px", border: "1px solid var(--border)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2>{role === "student" ? "Student" : "Club"} Login</h2>
              <button onClick={() => setShowLogin(false)} style={{ background: "none", color: "var(--text-muted)", fontSize: "1.5rem" }}>&times;</button>
            </div>
            {/* ... Rest of form ... */}
            
            {error && <div style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "0.5rem", borderRadius: "4px", marginBottom: "1rem" }}>{error}</div>}
            
            <form onSubmit={submit}>
              <input 
                type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required 
                style={{ background: "rgba(0,0,0,0.2)" }}
              />
              
              <div style={{ position: "relative" }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  style={{ background: "rgba(0,0,0,0.2)" }}
                />
                <button 
                   type="button" 
                   onClick={() => setShowPassword(!showPassword)}
                   style={{ position: "absolute", right: "10px", top: "15px", background: "transparent", color: "#a1a1aa" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", marginTop: "-0.5rem" }}>
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe} 
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ width: "auto", margin: 0 }} 
                  />
                  <label htmlFor="remember" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Remember me</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>Login</button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Don't have an account? <span onClick={() => navigate("/register")} style={{ color: "var(--accent)", cursor: "pointer" }}>Register</span>
            </p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
