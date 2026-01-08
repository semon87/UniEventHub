import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, LogOut } from "lucide-react";

export default function ModeratorDashboard() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const clubsRes = await API.get("/moderator/clubs/pending");
      const eventsRes = await API.get("/moderator/events/pending");
      setClubs(clubsRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error("Failed to fetch pending items", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClubAction = async (id, action) => {
    try {
      await API.put(`/moderator/clubs/${id}`, { status: action });
      fetchPendingItems();
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleEventAction = async (id, action) => {
    try {
      await API.put(`/moderator/events/${id}`, { status: action });
      fetchPendingItems();
    } catch (err) {
      alert("Action failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/moderator/login");
  };

  if (loading) return <div className="container" style={{ paddingTop: "2rem" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", position: "relative", overflow: "hidden" }}>
      
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>

      {/* Navbar */}
      <nav style={{ 
        padding: "1rem 2rem", 
        borderBottom: "1px solid #27272a", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        background: "rgba(9, 9, 11, 0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", items: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.5rem" }}>🛡️</span>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Moderator Dashboard</h1>
        </div>
        <button onClick={logout} style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            background: "rgba(239, 68, 68, 0.1)", 
            color: "#ef4444", 
            border: "1px solid rgba(239, 68, 68, 0.2)", 
            padding: "0.5rem 1rem", 
            borderRadius: "8px", 
            cursor: "pointer" 
        }}>
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <main className="container" style={{ padding: "2rem", maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", borderBottom: "1px solid #27272a", paddingBottom: "0.5rem", fontSize: "1.8rem" }}>Pending Club Registrations</h2>
          {clubs.length === 0 ? (
             <div style={{ padding: "2rem", background: "#18181b", borderRadius: "12px", border: "1px dashed #27272a", textAlign: "center", color: "#a1a1aa" }}>
               No pending club registrations.
             </div>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
              {clubs.map(club => (
                <div key={club._id} className="card" style={{ background: "#18181b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #27272a" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                      <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🏛️</div>
                      <div>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{club.name}</h3>
                        <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>{club.email}</p>
                      </div>
                  </div>
                  <p style={{ marginBottom: "1.5rem", color: "#d4d4d8", lineHeight: "1.6" }}>{club.description}</p>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => handleClubAction(club._id, "approved")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10b981", color: "white", fontWeight: "600", cursor: "pointer" }}>
                      <Check size={18} /> Approve
                    </button>
                    <button onClick={() => handleClubAction(club._id, "rejected")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "0.6rem", borderRadius: "8px", border: "1px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: "600", cursor: "pointer" }}>
                      <X size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 style={{ marginBottom: "1.5rem", borderBottom: "1px solid #27272a", paddingBottom: "0.5rem", fontSize: "1.8rem" }}>Pending Events</h2>
          {events.length === 0 ? (
             <div style={{ padding: "2rem", background: "#18181b", borderRadius: "12px", border: "1px dashed #27272a", textAlign: "center", color: "#a1a1aa" }}>
               No pending events.
             </div>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
              {events.map(event => (
                <div key={event._id} className="card" style={{ background: "#18181b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #27272a" }}>
                  <img 
                    src={event.coverImage.startsWith("http") ? event.coverImage : `http://localhost:5000/${event.coverImage}`} 
                    alt={event.title} 
                    style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" }}
                  />
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{event.title}</h3>
                  <div style={{ display: "flex", gap: "1rem", color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                     <span>👤 {event.organizer?.name || "Unknown"}</span>
                     <span>📅 {new Date(event.startDateTime).toLocaleDateString()}</span>
                  </div>
                  <p style={{ marginBottom: "1.5rem", fontSize: "0.95rem", color: "#d4d4d8", lineHeight: "1.5" }}>{event.description.substring(0, 100)}...</p>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => handleEventAction(event._id, "approved")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10b981", color: "white", fontWeight: "600", cursor: "pointer" }}>
                      <Check size={18} /> Approve
                    </button>
                    <button onClick={() => handleEventAction(event._id, "rejected")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "0.6rem", borderRadius: "8px", border: "1px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: "600", cursor: "pointer" }}>
                      <X size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
