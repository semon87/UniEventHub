import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/axios";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const getPhotoUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path}`;
  };

  const date = new Date(event.startDateTime);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  return (
    <div 
      className="event-card" 
      onClick={() => navigate(`/events/${event._id}`)}
      style={{ 
        cursor: "pointer", 
        background: "#000", // Tickify uses black/dark cards
        borderRadius: "12px", 
        overflow: "hidden", 
        position: "relative",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "transform 0.2s",
        border: "1px solid #27272a"
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      {/* IMAGE SECTION */}
      <div style={{ position: "relative", height: "180px" }}>
        <img 
          src={getPhotoUrl(event.coverImage)} 
          alt={event.title} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
        
        {/* DATE BADGE (Tickify Style) */}
        <div style={{ 
          position: "absolute", 
          bottom: "10px", 
          left: "10px", 
          background: "black", 
          color: "white", 
          borderRadius: "6px", 
          padding: "5px 10px", 
          textAlign: "center",
          fontWeight: "bold",
          zIndex: 10,
          border: "1px solid #3f3f46"
        }}>
          <div style={{ fontSize: "1.2rem", lineHeight: 1 }}>{day}</div>
          <div style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>{month}</div>
        </div>

        {/* PRICE BADGE (Right side) */}
        {event.entryFee > 0 && (
          <div style={{ 
             position: "absolute", 
             top: "10px", 
             right: "10px", 
             background: "rgba(0,0,0,0.7)", 
             color: "white", 
             padding: "4px 8px", 
             borderRadius: "4px", 
             fontSize: "0.8rem", 
             fontWeight: "600",
             backdropFilter: "blur(4px)"
          }}>
            ${event.entryFee}
          </div>
        )}

        {/* JOINED STATUS BADGE */}
        {(() => {
           const user = JSON.parse(localStorage.getItem("user"));
           // Check if joined (goingStudents can be array of IDs or Objects)
           const isJoined = event.goingStudents?.some(s => (s._id || s) === user?.id);
           if (isJoined) {
               return (
                   <div style={{ 
                       position: "absolute", 
                       top: "10px", 
                       left: "10px", 
                       background: "#10b981", 
                       color: "white", 
                       padding: "4px 8px", 
                       borderRadius: "4px", 
                       fontSize: "0.8rem", 
                       fontWeight: "700",
                       zIndex: 20
                   }}>
                       ✓ JOINED
                   </div>
               );
           }
           return null;
        })()}
      </div>

      {/* TEXT CONTENT SECTION */}
      <div style={{ padding: "1rem" }}>
        <h3 style={{ 
           fontSize: "1.1rem", 
           fontWeight: "700", 
           marginBottom: "0.5rem", 
           color: "#fafafa",
           whiteSpace: "nowrap", 
           overflow: "hidden", 
           textOverflow: "ellipsis" 
        }}>
          {event.title}
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", fontSize: "0.9rem", color: "#a1a1aa" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
             <span>📍</span> 
             <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.venue}</span>
           </div>
           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
             <span>🏛️</span> 
             <span>{event.organizer?.name}</span>
           </div>
           
           {/* Participant Limit */}
           <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
             <span>👥</span>
             <span style={{ 
               color: (event.participantLimit > 0 && event.goingStudents?.length >= event.participantLimit) ? "#ef4444" : "#a1a1aa" 
             }}>
               {event.goingStudents?.length || 0}
               {event.participantLimit > 0 ? ` / ${event.participantLimit}` : " joined"}
             </span>
             {event.participantLimit > 0 && event.goingStudents?.length >= event.participantLimit && (
               <span style={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: "bold", border: "1px solid #ef4444", padding: "0 4px", borderRadius: "4px" }}>FULL</span>
             )}
           </div>
        </div>
      </div>

    </div>
  );
}
