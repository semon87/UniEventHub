import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Ticket, 
  Users, 
  LogOut, 
  User, 
  Compass,
  Menu,
  X,
  Settings 
} from "lucide-react";
import { useState } from "react";
import { getPhotoUrl } from "../utils/imageUrl";
import EditProfileModal from "./EditProfileModal";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <button 
        onClick={() => { navigate(to); setIsMenuOpen(false); }}
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          background: isActive ? "#27272a" : "transparent",
          color: isActive ? "#fafafa" : "#a1a1aa",
          border: "none",
          padding: "0.5rem 0.8rem",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: "500",
          transition: "all 0.2s"
        }}
        onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = "#fafafa" }}
        onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = "#a1a1aa" }}
      >
        <Icon size={18} />
        {label}
      </button>
    );
  };



  return (
    <nav style={{ 
      position: "sticky", 
      top: 0, 
      zIndex: 50, 
      background: "rgba(9, 9, 11, 0.8)", 
      backdropFilter: "blur(12px)", 
      borderBottom: "1px solid #27272a",
      padding: "0.8rem 2rem"
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/browse-events")}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #a855f7, #ec4899)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>U</div>
          <span style={{ fontSize: "1.2rem", fontWeight: "700", letterSpacing: "-0.5px", color: "white" }}>UniEventHub</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Note: "browse-events" was "student-dashboard" but plan says rename route. 
              For now keeping "student-dashboard" as route name in code until App.jsx refactor. 
              Actually, I will refactor routes soon, let's assume valid paths. 
          */}
          <NavLink to="/browse-events" icon={Compass} label="Browse" />
          <NavLink to="/stats-dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavLink to="/clubs" icon={Users} label="Clubs" />
          <NavLink to="/calendar" icon={CalendarDays} label="Calendar" />
          <NavLink to="/my-tickets" icon={Ticket} label="Tickets" />
        </div>

        {/* USER PROFILE */}
        <div className="user-profile" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ textAlign: "right", display: "none" }}> {/* Hidden on mobile usually, keeping simple */}
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fafafa" }}>{user?.name}</div>
              </div>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#27272a", overflow: "hidden", border: "1px solid #3f3f46", cursor: "pointer" }}>
                  {user?.profilePhoto ? (
                    <img src={getPhotoUrl(user.profilePhoto)} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa" }}>
                      <User size={18} />
                    </div>
                  )}
              </div>
              <button 
                onClick={() => setShowEditProfile(true)}
                style={{ background: "transparent", border: "none", color: "#a1a1aa", cursor: "pointer", transition: "color 0.2s" }}
                title="Settings"
                onMouseEnter={e => e.currentTarget.style.color = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.color = "#a1a1aa"}
              >
                <Settings size={20} />
              </button>
              <button 
                onClick={handleLogout}
                style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                title="Logout"
              >
                <LogOut size={20} />
              </button>
           </div>
        </div>

      </div>
      
      {showEditProfile && (
        <EditProfileModal 
            user={user} 
            onClose={() => setShowEditProfile(false)} 
            onUpdate={(updatedUser) => setUser(updatedUser)} 
        />
      )}
    </nav>
  );
}
