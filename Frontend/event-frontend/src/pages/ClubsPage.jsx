import { useEffect, useState } from "react";
import API, { BASE_URL } from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
         try {
             const res = await API.get("/clubs");
             if(res.data.success) {
               setClubs(res.data.data);
             }
         } catch(e) { 
           console.error("Failed to fetch clubs", e); 
         } finally {
           setLoading(false);
         }
    }
    fetchClubs();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "10%", right: "5%", width: "35vw", height: "35vw", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "20%", left: "5%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(70px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 50%)", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" }}></div>
      
      <Navbar />
      <main style={{ padding: "3rem 2rem", maxWidth: "1280px", margin: "0 auto", width: "100%", flex: 1, position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>Student Clubs</h1>
        
        {loading ? (
           <div style={{ textAlign: "center", color: "#a1a1aa" }}>Loading clubs...</div>
        ) : clubs.length === 0 ? (
           <div style={{ textAlign: "center", color: "#a1a1aa" }}>No clubs found.</div>
        ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
           {clubs.map(club => (
             <div key={club._id} style={{ background: "#18181b", padding: "2rem", borderRadius: "12px", border: "1px solid #27272a", textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", background: "#27272a", borderRadius: "50%", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", overflow: "hidden" }}>
                   {club.profilePhoto ? (
                     <img src={`${BASE_URL}/${club.profilePhoto}`} style={{width:"100%", height:"100%", objectFit:"cover"}} alt={club.name} />
                   ) : (
                     "🏛️"
                   )}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{club.name}</h3>
                <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>{club.description}</p>
                <Link to={`/clubs/${club._id}`} className="btn" style={{ background: "#27272a", color: "white", padding: "0.5rem 1rem", borderRadius: "6px", border: "none" }}>View Events</Link>
             </div>
           ))}
        </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
