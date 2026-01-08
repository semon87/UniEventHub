import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/axios";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  // Custom CSS for dark theme calendar
  const calendarStyles = `
    .react-calendar { background: #18181b; border: 1px solid #27272a; color: #fafafa; width: 100%; border-radius: 12px; font-family: 'Inter', sans-serif; padding: 1rem; }
    .react-calendar__navigation button { color: #fafafa; font-size: 1.1rem; }
    .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: #27272a; }
    .react-calendar__month-view__days__day { color: #fafafa; }
    .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background-color: #27272a; border-radius: 6px; }
    .react-calendar__tile--now { background: #27272a; border-radius: 6px; }
    .react-calendar__tile--active { background: #a855f7 !important; color: white !important; border-radius: 6px; }
  `;

  useEffect(() => {
      const fetchEvents = async () => {
        try {
          const res = await API.get("/events");
          setEvents(res.data.data);
        } catch(e) { console.error(e); }
      }
      fetchEvents();
  }, []);

  const eventsOnDate = events.filter(e => new Date(e.startDateTime).toDateString() === date.toDateString());

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{calendarStyles}</style>
      
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "10%", right: "5%", width: "35vw", height: "35vw", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "20%", left: "5%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(70px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 50%)", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" }}></div>
      
      <Navbar />
      <main style={{ padding: "3rem 2rem", maxWidth: "1000px", margin: "0 auto", width: "100%", flex: 1, position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>Event Calendar</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
          <div>
             <Calendar onChange={setDate} value={date} />
          </div>
          
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Events on {date.toLocaleDateString()}</h2>
            {eventsOnDate.length === 0 ? (
              <p style={{ color: "#a1a1aa" }}>No events scheduled for this day.</p>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {eventsOnDate.map(e => (
                  <div key={e._id} style={{ background: "#18181b", padding: "1rem", borderRadius: "8px", borderLeft: "4px solid #a855f7" }}>
                    <div style={{ fontWeight: "bold" }}>{e.title}</div>
                    <div style={{ fontSize: "0.9rem", color: "#a1a1aa" }}>{new Date(e.startDateTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
