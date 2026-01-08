import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function StatsDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [stats, setStats] = useState({ joinedCount: 0, totalSpent: 0, liveEvents: [], myEvents: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User's Data (assuming API endpoint logic or deriving from events)
        // Since we don't have a direct /stats endpoint, we'll fetch all events and filter client-side 
        // OR fetch user profile if it had populated events (it doesn't fully).
        // Let's use the 'Browse Events' logic but filtered for "MY" events.
        
        // Use user's ID to filter "goingStudents" in all events
        const res = await API.get("/events"); // Optimization: Backend should have /my-events
        const allEvents = res.data.data;
        const myEvents = allEvents.filter(e => e.goingStudents.some(s => s._id === user.id || s === user.id));
        
        const now = new Date();
        const liveEvents = allEvents.filter(e => new Date(e.startDateTime) <= now && new Date(e.endDateTime) >= now);

        const joinedCount = myEvents.length;
        const totalSpent = myEvents.reduce((acc, curr) => acc + (curr.entryFee || 0), 0);

        setStats({ joinedCount, totalSpent, liveEvents, myEvents });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const StatCard = ({ title, value, sub, color }) => (
    <div style={{ background: "#18181b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #27272a" }}>
      <div style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{title}</div>
      <div style={{ fontSize: "2rem", fontWeight: "bold", color: color || "#fafafa" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.8rem", color: "#71717a", marginTop: "0.5rem" }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "10%", right: "5%", width: "35vw", height: "35vw", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "20%", left: "5%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(70px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "40%", right: "-5%", width: "25vw", height: "25vw", background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "60%", left: "-5%", width: "28vw", height: "28vw", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(75px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 50%)", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" }}></div>
      
      <Navbar />
      
      <main style={{ padding: "3rem 2rem", maxWidth: "1280px", margin: "0 auto", width: "100%", flex: 1, position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>Dashboard</h1>
        
        {/* STATS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <StatCard title="Events Joined" value={stats.joinedCount} sub="You are an active member!" color="#a855f7" />
          <StatCard title="Total Spent" value={`$${stats.totalSpent}`} sub="Investment in experiences" color="#10b981" />
           </div>

        {/* LIVE NOW SECTION */}
        {stats.liveEvents.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "10px", height: "10px", background: "#ef4444", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 10px #ef4444" }}></span>
              Happening Now
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {stats.liveEvents.map(event => (
                <div key={event._id} style={{ background: "#18181b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #ef4444" }}>
                  <h3 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{event.title}</h3>
                  <p style={{ color: "#a1a1aa", marginTop: "0.5rem" }}>{event.venue}</p>
                  <Link to={`/events/${event._id}`} style={{ display: "inline-block", marginTop: "1rem", color: "#ef4444", fontWeight: "600" }}>Join Now &rarr;</Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECENTLY JOINED */}
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>My Upcoming Events</h2>
          {stats.myEvents.length === 0 ? (
            <p style={{ color: "#a1a1aa" }}>You haven't joined any events yet. Go browse!</p>
          ) : (
            <div style={{ background: "#18181b", borderRadius: "12px", border: "1px solid #27272a", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#27272a", color: "#a1a1aa", fontSize: "0.9rem" }}>
                    <th style={{ padding: "1rem" }}>Event</th>
                    <th style={{ padding: "1rem" }}>Date</th>
                    <th style={{ padding: "1rem" }}>Location</th>
                    <th style={{ padding: "1rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.myEvents.slice(0, 5).map(event => (
                    <tr key={event._id} style={{ borderBottom: "1px solid #27272a" }}>
                      <td style={{ padding: "1rem", fontWeight: "500" }}>{event.title}</td>
                      <td style={{ padding: "1rem", color: "#a1a1aa" }}>{new Date(event.startDateTime).toLocaleDateString()}</td>
                      <td style={{ padding: "1rem", color: "#a1a1aa" }}>{event.venue}</td>
                      <td style={{ padding: "1rem" }}>
                         <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem" }}>Going</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}
