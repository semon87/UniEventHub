
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../api/axios";
import { getPhotoUrl } from "../utils/imageUrl";
import Footer from "../components/Footer";

export default function ClubDashboard() {
  const [club, setClub] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  // Modals
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Data State
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participants, setParticipants] = useState({
    interested: [],
    going: [],
  });
  const [loading, setLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: club?.name || "",
    description: club?.description || "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  const fetchEvents = async () => {
    if (!club) return;
    try {
      const res = await API.get(`/events?organizer=${club.id || club._id}&showAll=true`);
      setEvents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    console.log("Club Dashboard Mounted");
    if (!club) {
      console.warn("No club user found, redirecting...");
      navigate("/");
    } else {
      fetchEvents();
    }
  }, [club]);

  // ... (existing handlers) ...
  const handleEdit = (event) => {
    navigate("/club/create-event", { state: { event } });
  };

  const handleViewParticipants = async (eventId) => {
    setSelectedEventId(eventId);
    try {
      const res = await API.get(`/events/${eventId}/attendees`);
      setParticipants(res.data.data);
      setShowParticipantsModal(true);
    } catch (err) {
      console.error("Failed to fetch participants", err);
      alert("Failed to fetch participants.");
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setLoading(true);
    try {
      await API.delete(`/events/${eventId}`);
      alert("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("description", profileForm.description);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const res = await API.put(`/clubs/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setClub(res.data.data);
      alert("Profile updated successfully!");
      setShowEditProfile(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const openCreateModal = () => {
    navigate("/club/create-event");
  };

  // Calculate Stats
  const stats = {
    totalEvents: events.length,
    totalParticipants: events.reduce(
      (acc, curr) => acc + (curr.goingStudents?.length || 0),
      0
    ),
    totalRevenue: events.reduce(
      (acc, curr) =>
        acc + (curr.entryFee || 0) * (curr.goingStudents?.length || 0),
      0
    ),
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        color: "#fafafa",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "35vw",
          height: "35vw",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
          filter: "blur(90px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          width: "30vw",
          height: "30vw",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "-5%",
          width: "25vw",
          height: "25vw",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "-5%",
          width: "28vw",
          height: "28vw",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          filter: "blur(75px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "70vw",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 50%)",
          filter: "blur(120px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>
      {/* Club Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(9, 9, 11, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #27272a",
          padding: "0.8rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              🏛️
            </div>
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                color: "white",
              }}
            >
              UniEventHub
            </span>
          </div>

          {/* NAV LINKS */}

          {/* CLUB PROFILE */}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main
        style={{
          padding: "3rem 2rem",
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER ROW */}
        <header style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  letterSpacing: "-1px",
                  marginBottom: "0.5rem",
                }}
              >
                Club Dashboard
              </h1>
              <p style={{ color: "#a1a1aa", fontSize: "1.1rem" }}>
                Manage your events and track performance.
              </p>
            </div>

            {/* Club Profile & Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#18181b",
                  padding: "0.5rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid #27272a",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#27272a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {club?.profilePhoto ? (
                    <img
                      src={getPhotoUrl(club.profilePhoto)}
                      alt="Club Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "1.2rem" }}>🏛️</span>
                  )}
                </div>
                <span style={{ fontWeight: "600" }}>{club?.name}</span>
              </div>

              <button
                onClick={() => setShowEditProfile(true)}
                style={{
                  padding: "0.6rem",
                  borderRadius: "8px",
                  background: "#27272a",
                  color: "#a1a1aa",
                  border: "1px solid #3f3f46",
                  cursor: "pointer",
                }}
                title="Settings"
              >
                ⚙️
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: "0.6rem",
                  borderRadius: "8px",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                  cursor: "pointer",
                }}
                title="Logout"
              >
                ➜]
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={openCreateModal}
              style={{
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: "600",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>+</span> Create Event
            </button>
          </div>
        </header>

        {/* STATS ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              background: "#18181b",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #27272a",
            }}
          >
            <div
              style={{
                color: "#a1a1aa",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
              }}
            >
              Total Events
            </div>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "#a855f7",
              }}
            >
              {stats.totalEvents}
            </div>
          </div>
          <div
            style={{
              background: "#18181b",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #27272a",
            }}
          >
            <div
              style={{
                color: "#a1a1aa",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
              }}
            >
              Total Participants
            </div>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "#06b6d4",
              }}
            >
              {stats.totalParticipants}
            </div>
          </div>
          <div
            style={{
              background: "#18181b",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #27272a",
            }}
          >
            <div
              style={{
                color: "#a1a1aa",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
              }}
            >
              Revenue
            </div>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "#10b981",
              }}
            >
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* EVENTS GRID */}
        {/* EVENTS GRID */}
        <div style={{ display: "grid", gap: "1rem" }}>
          {events.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                background: "#18181b",
                borderRadius: "16px",
                border: "1px dashed #27272a",
              }}
            >
              <div
                style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}
              >
                📅
              </div>
              <p style={{ color: "#a1a1aa", fontSize: "1.1rem" }}>
                No events created yet.
              </p>
              <button
                onClick={openCreateModal}
                style={{
                  marginTop: "1rem",
                  color: "#a855f7",
                  background: "transparent",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: "1px solid #a855f7",
                }}
              >
                Create your first event
              </button>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: "1.5rem",
                  alignItems: "center",
                  padding: "1.25rem",
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "12px",
                  transition: "transform 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#27272a",
                  }}
                >
                  <img
                    src={
                      getPhotoUrl(event.coverImage) ||
                      "https://placehold.co/100"
                    }
                    alt="Event"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div>
                  <h3
                    style={{
                      marginBottom: "0.25rem",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                    }}
                  >
                    {event.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      color: "#a1a1aa",
                      fontSize: "0.85rem",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📅 {new Date(event.startDateTime).toLocaleDateString()}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📍 {event.venue}
                    </span>
                    <span
                      style={{
                        background:
                          event.entryFee > 0
                            ? "rgba(16, 185, 129, 0.1)"
                            : "#27272a",
                        color: event.entryFee > 0 ? "#10b981" : "#fafafa",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: "600",
                      }}
                    >
                      {event.entryFee > 0 ? `$${event.entryFee}` : "Free"}
                    </span>
                    {/* Status Badge */}
                    <span
                      style={{
                        background:
                          event.status === "approved"
                            ? "rgba(16, 185, 129, 0.1)"
                            : event.status === "rejected"
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(245, 158, 11, 0.1)",
                        color:
                          event.status === "approved"
                            ? "#10b981"
                            : event.status === "rejected"
                            ? "#ef4444"
                            : "#f59e0b",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: "600",
                        textTransform: "capitalize",
                        border: `1px solid ${
                          event.status === "approved"
                            ? "rgba(16, 185, 129, 0.2)"
                            : event.status === "rejected"
                            ? "rgba(239, 68, 68, 0.2)"
                            : "rgba(245, 158, 11, 0.2)"
                        }`,
                      }}
                    >
                      {event.status || "Pending"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    title="Participants"
                    onClick={() => handleViewParticipants(event._id)}
                    style={{
                      padding: "0.6rem",
                      borderRadius: "8px",
                      background: "#27272a",
                      color: "#a1a1aa",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    👥{" "}
                    <span style={{ fontSize: "0.8rem", marginLeft: "4px" }}>
                      {event.goingStudents?.length || 0}
                    </span>
                  </button>
                  <button
                    title="Edit"
                    onClick={() => handleEdit(event)}
                    style={{
                      padding: "0.6rem",
                      borderRadius: "8px",
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "#6366f1",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDelete(event._id)}
                    style={{
                      padding: "0.6rem",
                      borderRadius: "8px",
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#f87171",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />


      {/* EDIT PROFILE MODAL */}
      {showEditProfile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{
              width: "450px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-main)" }}>
              Club Settings
            </h2>
            <form
              onSubmit={handleProfileUpdate}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--bg-primary)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--border)",
                  }}
                >
                  {profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : club?.profilePhoto ? (
                    <img
                      src={getPhotoUrl(club.profilePhoto)}
                      alt="Current"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "2rem" }}>🏛️</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="club-photo-upload"
                    style={{
                      display: "block",
                      marginBottom: "0.2rem",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      color: "var(--primary)",
                      textDecoration: "underline",
                    }}
                  >
                    Change Logo
                  </label>
                  <input
                    id="club-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
                >
                  Club Name
                </label>
                <input
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    padding: "0.6rem",
                    borderRadius: "var(--radius)",
                    color: "var(--text-main)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
                >
                  Description
                </label>
                <textarea
                  value={profileForm.description}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    padding: "0.6rem",
                    borderRadius: "var(--radius)",
                    color: "var(--text-main)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARTICIPANTS MODAL */}
      {showParticipantsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{
              width: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ color: "var(--text-main)" }}>Participants List</h2>
              <button
                onClick={() => setShowParticipantsModal(false)}
                style={{
                  background: "none",
                  color: "var(--text-muted)",
                  fontSize: "1.5rem",
                }}
              >
                &times;
              </button>
            </div>
            {participants.going.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No one joined yet.</p>
            ) : (
              <ul style={{ listStyle: "none", display: "grid", gap: "0.5rem" }}>
                {participants.going.map((p) => (
                  <li
                    key={p._id}
                    style={{
                      background: "var(--bg-primary)",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "var(--text-main)",
                        }}
                      >
                        {p.name}{" "}
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.85rem",
                          }}
                        >
                          ({p.studentId})
                        </span>
                      </div>
                      <div
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {p.email}
                      </div>
                    </div>
                    {/* Display Paid Amount based on the event fee */}
                    {(() => {
                      const evt = events.find((e) => e._id === selectedEventId);
                      if (evt && evt.entryFee > 0) {
                        return (
                          <span
                            style={{
                              color: "#10b981",
                              fontWeight: "bold",
                              fontSize: "0.9rem",
                            }}
                          >
                            Paid: ${evt.entryFee}
                          </span>
                        );
                      }
                      return (
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.9rem",
                          }}
                        >
                          Free
                        </span>
                      );
                    })()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
