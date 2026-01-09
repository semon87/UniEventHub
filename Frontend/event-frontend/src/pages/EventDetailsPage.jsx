import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data.data);
        
        // Check if joined
        if (user && res.data.data.goingStudents.some(s => s._id === user.id)) {
          setJoined(true);
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user?.id]);

  const handleJoin = async () => {
    try {
      if (event.entryFee > 0) {
          // Paid Event: Initiate Payment
          const res = await API.post("/payment/init", { eventId: id });
          if (res.data.url) {
              window.location.replace(res.data.url);
          } else {
              alert("Failed to initiate payment session");
          }
      } else {
          // Free Event: Direct Join
          await API.post(`/events/${id}/join`);
          setJoined(true);
          alert("You have joined this event!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process request");
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to cancel your registration for this event?")) {
      return;
    }
    try {
      await API.post(`/events/${id}/leave`);
      setJoined(false);
      alert("You have successfully cancelled your registration.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel registration");
    }
  };

  const getPhotoUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path}`;
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#09090b", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>;
  if (!event) return <div style={{ minHeight: "100vh", background: "#09090b", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>Event not found</div>;

  const date = new Date(event.startDateTime);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "10%", right: "5%", width: "35vw", height: "35vw", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "20%", left: "5%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(70px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 50%)", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" }}></div>
      
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem", position: "relative", zIndex: 1, flex: 1 }}>
        
        {/* COVER IMAGE */}
        <div style={{ 
          width: "100%", 
          height: "400px", 
          borderRadius: "12px", 
          overflow: "hidden", 
          marginBottom: "2rem",
          background: "#27272a"
        }}>
          <img 
            src={getPhotoUrl(event.coverImage)} 
            alt={event.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>

        {/* HEADER & ACTIONS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
           <div>
             <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem", lineHeight: 1.2 }}>{event.title}</h1>
             <p style={{ color: "#a1a1aa", fontSize: "1.1rem" }}>Hosted by <span style={{ color: "white", fontWeight: "600" }}>{event.organizer?.name}</span></p>
           </div>
           
             <div style={{ textAlign: "right" }}>
               {user?.role === "student" && (
                 <button 
                   onClick={handleJoin}
                   disabled={joined || (event.participantLimit > 0 && event.goingStudents.length >= event.participantLimit)}
                   className="btn"
                   style={{ 
                     background: joined ? "#27272a" : (event.participantLimit > 0 && event.goingStudents.length >= event.participantLimit) ? "#ef4444" : "linear-gradient(135deg, #a855f7, #ec4899)", 
                     color: "white", 
                     padding: "0.8rem 2rem", 
                     borderRadius: "8px", 
                     fontWeight: "bold",
                     border: "none",
                     cursor: (joined || (event.participantLimit > 0 && event.goingStudents.length >= event.participantLimit)) ? "default" : "pointer",
                     fontSize: "1rem"
                   }}
                 >
                   {joined ? "Joined ✅" : (event.participantLimit > 0 && event.goingStudents.length >= event.participantLimit) ? "Event Full ⛔" : event.entryFee > 0 ? `Pay $${event.entryFee} & Join` : "Get Ticket"}
                 </button>
               )}
             </div>
        </div>

        {/* DETAILS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem" }}>
          
          {/* LEFT: DESCRIPTION */}
          <div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", borderBottom: "1px solid #27272a", paddingBottom: "0.5rem" }}>About Event</h3>
            <p style={{ color: "#d4d4d8", lineHeight: "1.8", whiteSpace: "pre-wrap", fontSize: "1.05rem" }}>
              {event.description}
            </p>
          </div>

          {/* RIGHT: INFO CARD */}
          <div>
            <div style={{ background: "#18181b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #27272a" }}>
              
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                 <div style={{ background: "#27272a", padding: "0.8rem", borderRadius: "8px", textAlign: "center", minWidth: "60px" }}>
                   <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#ec4899" }}>{month}</div>
                   <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{day}</div>
                 </div>
                 <div>
                   <div style={{ fontSize: "0.9rem", color: "#a1a1aa" }}>Date & Time</div>
                   <div style={{ fontWeight: "600" }}>{date.toLocaleDateString()}</div>
                   <div style={{ fontSize: "0.9rem", color: "#d4d4d8" }}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                 </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                 <div style={{ fontSize: "0.9rem", color: "#a1a1aa", marginBottom: "0.2rem" }}>Location</div>
                 <div style={{ fontWeight: "600", fontSize: "1.05rem" }}>{event.venue}</div>
              </div>

              <div>
                 <div style={{ fontSize: "0.9rem", color: "#a1a1aa", marginBottom: "0.2rem" }}>Ticket Price</div>
                 <div style={{ fontWeight: "600", fontSize: "1.2rem", color: "#a855f7" }}>
                   {event.entryFee > 0 ? `$${event.entryFee}` : "Free"}
                 </div>
              </div>

            </div>
          </div>

        </div>

      </div>
      
      <Footer />
    </div>
  );
}
