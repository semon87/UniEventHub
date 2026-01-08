import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate import
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";

export default function ClubDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubRes, eventsRes] = await Promise.all([
          API.get(`/clubs/${id}`),
          API.get(`/events?organizer=${id}`)
        ]);
        
        if (clubRes.data.success) {
            setClub(clubRes.data.data);
        }
        if (eventsRes.data.success) {
            setEvents(eventsRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  if (!club) return <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>Club not found</div>;

  const getPhotoUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000/${path}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      {/* CLUB HERO HEADER */}
      <div style={{ background: "linear-gradient(to bottom, #27272a, #09090b)", padding: "4rem 2rem", textAlign: "center", borderBottom: "1px solid #27272a" }}>
         <div style={{ width: "120px", height: "120px", borderRadius: "50%", border: "4px solid #09090b", margin: "0 auto 1.5rem", overflow: "hidden", background: "#18181b" }}>
            <img src={getPhotoUrl(club.profilePhoto)} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
         </div>
         <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{club.name}</h1>
         <p style={{ color: "#a1a1aa", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>{club.description}</p>
         <div style={{ marginTop: "1rem", color: "#a1a1aa", fontSize: "0.9rem" }}>
            📧 {club.email} 
         </div>
      </div>

      <main style={{ padding: "3rem 2rem", maxWidth: "1280px", margin: "0 auto", width: "100%", flex: 1 }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "2rem" }}>Events by {club.name}</h2>
        
        {events.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {events.map(event => (
              <div key={event._id} style={{ background: "#000", border: "1px solid #27272a", borderRadius: "12px", overflow: "hidden" }}>
                 <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem", border: "1px dashed #27272a", borderRadius: "12px", color: "#a1a1aa" }}>
            No events scheduled yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
