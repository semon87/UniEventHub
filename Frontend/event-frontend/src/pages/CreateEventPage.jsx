import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { BASE_URL } from "../api/axios";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Check if we are editing (passed via state)
  const editEvent = location.state?.event;
  const isEditing = !!editEvent;

  const [form, setForm] = useState({
    title: editEvent?.title || "",
    description: editEvent?.description || "",
    startDateTime: editEvent?.startDateTime ? new Date(editEvent.startDateTime).toISOString().slice(0, 16) : "",
    endDateTime: editEvent?.endDateTime ? new Date(editEvent.endDateTime).toISOString().slice(0, 16) : "",
    venue: editEvent?.venue || "",
    entryFee: editEvent?.entryFee || 0,
    participantLimit: editEvent?.participantLimit || 0,
    eventType: editEvent?.eventType || "Other",
  });
  
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(editEvent?.coverImage ? (editEvent.coverImage.startsWith("http") ? editEvent.coverImage : `${BASE_URL}/${editEvent.coverImage}`) : null);

  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(form).forEach(key => data.append(key, form[key]));
      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      if (isEditing) {
        await API.put(`/events/${editEvent._id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Event updated successfully!");
      } else {
        await API.post("/events", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Event created successfully!");
      }

      navigate("/club-dashboard"); // Return to dashboard
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", padding: "2rem" }}>
       
       {/* Background Elements */}
       <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>
       <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }}></div>

       <div className="card" style={{ maxWidth: "800px", width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "2rem", position: "relative", zIndex: 1 }}>
         
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{isEditing ? "Edit Event" : "Create New Event"}</h1>
            <button onClick={() => navigate("/club-dashboard")} style={{ background: "transparent", color: "#a1a1aa", border: "none", cursor: "pointer", fontSize: "1rem" }}>Cancel</button>
         </div>

         {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>}

         <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
            
            {/* Title */}
            <div>
               <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>Event Title</label>
               <input 
                  type="text" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})}
                  required
                  placeholder="e.g. Annual Tech Symposium"
                  style={{ width: "100%", padding: "0.8rem", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "white", outline: "none" }}
               />
            </div>

            {/* Description */}
            <div>
               <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>Description</label>
               <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  required
                  rows={5}
                  placeholder="Describe your event..."
                  style={{ width: "100%", padding: "0.8rem", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "white", outline: "none", resize: "vertical" }}
               />
            </div>

            {/* Image Upload */}
            <div>
               <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>Cover Image</label>
               <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{ 
                    border: dragActive ? "2px dashed #8b5cf6" : "2px dashed #3f3f46", 
                    borderRadius: "8px", 
                    padding: "2rem", 
                    textAlign: "center", 
                    cursor: "pointer", 
                    background: previewUrl ? `url(${previewUrl}) center/cover` : (dragActive ? "rgba(139, 92, 246, 0.1)" : "transparent"), 
                    height: "200px", 
                    position: "relative", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    transition: "all 0.2s ease"
                  }} 
                  onClick={() => document.getElementById("fileInput").click()}
               >
                  {!previewUrl && <span style={{ color: dragActive ? "#8b5cf6" : "#71717a" }}>{dragActive ? "Drop image here" : "Click or Drag to upload image"}</span>}
                  <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
               </div>
            </div>

            {/* Grid for Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
               <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>Start Date & Time</label>
                  <input 
                     type="datetime-local" 
                     value={form.startDateTime}
                     onChange={e => setForm({...form, startDateTime: e.target.value})}
                     required
                     style={{ width: "100%", padding: "0.8rem", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "white", outline: "none" }}
                  />
               </div>
               <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>End Date & Time</label>
                  <input 
                     type="datetime-local" 
                     value={form.endDateTime}
                     onChange={e => setForm({...form, endDateTime: e.target.value})}
                     required
                     style={{ width: "100%", padding: "0.8rem", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "white", outline: "none" }}
                  />
               </div>
            </div>

          
            {/* Event Type */}
            <div>
               <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>Event Category</label>
               <select 
                  value={form.eventType} 
                  onChange={e => setForm({...form, eventType: e.target.value})}
                  style={{ width: "100%", padding: "0.8rem", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "white", outline: "none" }}
               >
                  {["Workshop", "Seminar", "Club Activity", "Competition", "Concert", "Sports", "Other"].map(type => (
                      <option key={type} value={type}>{type}</option>
                  ))}
               </select>
            </div>

            <div>
               <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>Venue</label>
               <input 
                  type="text" 
                  value={form.venue} 
                  onChange={e => setForm({...form, venue: e.target.value})}
                  required
                  placeholder="e.g. Auditorium A"
                  style={{ width: "100%", padding: "0.8rem", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "white", outline: "none" }}
               />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
               <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>Entry Fee ($)</label>
                  <input 
                     type="number" 
                     value={form.entryFee} 
                     onChange={e => setForm({...form, entryFee: e.target.value})}
                     min="0"
                     style={{ width: "100%", padding: "0.8rem", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "white", outline: "none" }}
                  />
               </div>
               <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa" }}>Participant Limit (0 = Unlimited)</label>
                  <input 
                     type="number" 
                     value={form.participantLimit} 
                     onChange={e => setForm({...form, participantLimit: e.target.value})}
                     min="0"
                     style={{ width: "100%", padding: "0.8rem", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "white", outline: "none" }}
                  />
               </div>
            </div>

            <button 
               type="submit" 
               disabled={loading}
               style={{ 
                  marginTop: "1rem", 
                  background: "linear-gradient(135deg, #6366f1, #a855f7)", 
                  color: "white", 
                  padding: "1rem", 
                  borderRadius: "8px", 
                  border: "none", 
                  fontWeight: "bold", 
                  cursor: loading ? "default" : "pointer", 
                  opacity: loading ? 0.7 : 1,
                  fontSize: "1.1rem"
               }}
            >
               {loading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
            </button>

         </form>

       </div>
    </div>
  );
}
