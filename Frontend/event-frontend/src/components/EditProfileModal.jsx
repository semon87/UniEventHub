import React, { useState, useEffect } from "react";
import { getPhotoUrl } from "../utils/imageUrl";
import API, { BASE_URL } from "../api/axios";
import { X, Camera } from "lucide-react";

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    studentId: user?.studentId || "",
    department: user?.department || "",
    batch: user?.batch || "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (user.role === "student") {
          data.append("studentId", formData.studentId);
          data.append("department", formData.department);
          data.append("batch", formData.batch);
      }
      // For club we might have description etc, but let's stick to student for now or generic name
      
      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      // Check URL based on role which we can infer or pass
      const url = user.role === "club" ? "/clubs/profile" : "/students/profile";
      
      const res = await API.put(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const updatedUser = { ...user, ...res.data.data };
        // Ensure role is preserved if backend didn't return it in data object explicitly (it does in previous code though)
        updatedUser.role = user.role; 
        
        localStorage.setItem("user", JSON.stringify(updatedUser)); 
        onUpdate(updatedUser);
        onClose();
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "flex-end", zIndex: 100, backdropFilter: "blur(2px)" }}>
      <div className="slide-in" style={{ background: "#09090b", width: "400px", height: "100vh", padding: "2rem", borderLeft: "1px solid #27272a", position: "relative", overflowY: "auto", boxShadow: "-5px 0 25px rgba(0,0,0,0.5)" }}>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          .slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        `}</style>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", color: "#a1a1aa" }}>
           <X size={20} />
        </button>
        
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem" }}>Edit Profile</h2>
        
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Photo Upload */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ position: "relative", width: "80px", height: "80px" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "2px solid #3f3f46" }}>
                    {profilePhoto ? (
                        <img src={URL.createObjectURL(profilePhoto)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : user?.profilePhoto ? (
                        <img src={getPhotoUrl(user.profilePhoto)} alt="Current" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div style={{ width: "100%", height: "100%", background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#a1a1aa" }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <label htmlFor="photo-upload" style={{ position: "absolute", bottom: -5, right: -5, background: "#a855f7", borderRadius: "50%", padding: "6px", cursor: "pointer", border: "2px solid #18181b", color: "white" }}>
                    <Camera size={16} />
                </label>
                <input id="photo-upload" type="file" accept="image/*" onChange={e => setProfilePhoto(e.target.files[0])} style={{ display: "none" }} />
            </div>
            <div>
                <h3 style={{ fontWeight: "600", color: "#fafafa" }}>{user?.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>{user?.role === "student" ? "Student" : "Club Admin"}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
             <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.9rem", color: "#a1a1aa" }}>Full Name</label>
                <input 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ background: "#27272a", border: "1px solid #3f3f46", padding: "0.8rem", borderRadius: "8px", color: "white", outline: "none", fontSize: "0.95rem" }}
                />
             </div>

             {user?.role === "student" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.9rem", color: "#a1a1aa" }}>Student ID</label>
                            <input 
                            value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}
                            style={{ background: "#27272a", border: "1px solid #3f3f46", padding: "0.8rem", borderRadius: "8px", color: "white", outline: "none", fontSize: "0.95rem" }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.9rem", color: "#a1a1aa" }}>Batch</label>
                            <input 
                            value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})}
                            style={{ background: "#27272a", border: "1px solid #3f3f46", padding: "0.8rem", borderRadius: "8px", color: "white", outline: "none", fontSize: "0.95rem" }}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.9rem", color: "#a1a1aa" }}>Department</label>
                        <input 
                        value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                        style={{ background: "#27272a", border: "1px solid #3f3f46", padding: "0.8rem", borderRadius: "8px", color: "white", outline: "none", fontSize: "0.95rem" }}
                        />
                    </div>
                </>
             )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" onClick={onClose} style={{ background: "transparent", color: "#a1a1aa", padding: "0.8rem 1.5rem" }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ background: "#f4f4f5", color: "#18181b", padding: "0.8rem 1.5rem", borderRadius: "8px", fontWeight: "600", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
