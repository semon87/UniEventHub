import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyTicketsPage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await API.get("/events");
        const allEvents = res.data.data;
        const joined = allEvents.filter(e => e.goingStudents.some(s => s._id === user.id || s === user.id));
        setMyEvents(joined);
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [user.id]);

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "10%", right: "5%", width: "35vw", height: "35vw", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "20%", left: "5%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(70px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 50%)", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" }}></div>
      
      <Navbar />
      <main style={{ padding: "3rem 2rem", maxWidth: "1000px", margin: "0 auto", width: "100%", flex: 1, position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>My Tickets</h1>

        {myEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", border: "1px dashed #27272a", borderRadius: "12px" }}>
            <p style={{ color: "#a1a1aa" }}>You haven't purchased any tickets yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
             {myEvents.map(event => (
               <div key={event._id} style={{ display: "flex", background: "#18181b", borderRadius: "12px", overflow: "hidden", border: "1px solid #27272a" }}>
                 {/* Left Stub */}
                 <div style={{ background: "#27272a", width: "15px", position: "relative" }}>
                   {/* Decorative dots could go here */}
                 </div>
                 
                 {/* Main Ticket Info */}
                 <div style={{ padding: "2rem", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{event.title}</h3>
                      <p style={{ color: "#a1a1aa" }}>{new Date(event.startDateTime).toLocaleString()} • {event.venue}</p>
                      <div style={{ marginTop: "1rem", display: "inline-block", background: "#a855f7", color: "white", padding: "0.2rem 0.8rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>
                        ADMIT ONE
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                       <div style={{ fontSize: "0.9rem", color: "#a1a1aa", marginBottom: "0.5rem" }}>Paid Amount</div>
                       <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
                         {event.entryFee > 0 ? `$${event.entryFee}` : "Free"}
                       </div>
                    </div>
                 </div>

                 {/* Cancel Action */}
                 <div style={{ width: "100px", background: "#18181b", borderLeft: "1px dashed #27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <button 
                      onClick={async () => {
                         if(!window.confirm("Are you sure you want to cancel this ticket?")) return;
                         try {
                           await API.post(`/events/${event._id}/leave`);
                           setMyEvents(myEvents.filter(e => e._id !== event._id));
                           alert("Ticket cancelled successfully.");
                         } catch (err) {
                           alert(err.response?.data?.message || "Failed to cancel");
                         }
                      }}
                      style={{ 
                        background: "transparent", 
                        border: "none", 
                        color: "#ef4444", 
                        cursor: "pointer", 
                        fontSize: "0.85rem", 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        gap: "5px" 
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>✖</span>
                      Cancel
                    </button>
                 </div>
               </div>
             ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
