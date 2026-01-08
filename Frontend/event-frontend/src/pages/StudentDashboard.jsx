import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Filter, ChevronDown, Check, X } from "lucide-react";

export default function StudentDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // Store all events for filtering
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  


  // Filter categories
  const filters = [
    { key: "all", label: "All Events" },
    { key: "joined", label: "Joined" },
    { key: "not_joined", label: "Not Joined" },
    { key: "past", label: "Past Events" },
    { key: "new", label: "New Events" },
  ];

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        setAllEvents(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Apply filters
  useEffect(() => {
    const now = new Date();
    const userId = user?.id;

    let filtered = allEvents;

    // 1. Search Filter
    if (searchTerm) {
        filtered = filtered.filter(e => 
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            e.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 2. Type Filter
    if (filterType !== 'all') {
        filtered = filtered.filter(e => e.eventType === filterType);
    }

    // 3. Tab Filters
    switch (activeFilter) {
      case "joined":
        filtered = filtered.filter(e => e.goingStudents?.includes(userId));
        break;
      case "not_joined":
        // Exclude events that have already started (Live or Past)
        filtered = filtered.filter(e => !e.goingStudents?.includes(userId) && new Date(e.startDateTime) > now);
        break;
      case "past":
        filtered = filtered.filter(e => new Date(e.endDateTime) < now);
        break;
      case "new":
         // Exclude events that have already started
        filtered = filtered.filter(e => new Date(e.startDateTime) > now);
        break;
      default: // "all"
         // Exclude events that have already started
        filtered = filtered.filter(e => new Date(e.startDateTime) > now);
        break;
    }

    // Sort by date (newest/upcoming first)
    // filtered.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

    setEvents(filtered);
  }, [activeFilter, allEvents, user, searchTerm, filterType]);

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      
      {/* Background Orbs - Purple Top Left */}
      <div style={{
        position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw",
        background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(0,0,0,0) 70%)",
        filter: "blur(80px)", zIndex: 0, pointerEvents: "none"
      }}></div>
      
      {/* Teal Bottom Right */}
      <div style={{
        position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw",
        background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(0,0,0,0) 70%)",
        filter: "blur(80px)", zIndex: 0, pointerEvents: "none"
      }}></div>
      
      {/* Pink/Magenta Top Right */}
      <div style={{
        position: "absolute", top: "10%", right: "5%", width: "35vw", height: "35vw",
        background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
        filter: "blur(90px)", zIndex: 0, pointerEvents: "none"
      }}></div>
      
      {/* Green/Emerald Bottom Left */}
      <div style={{
        position: "absolute", bottom: "20%", left: "5%", width: "30vw", height: "30vw",
        background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
        filter: "blur(70px)", zIndex: 0, pointerEvents: "none"
      }}></div>
      
      {/* Orange/Amber Mid Right */}
      <div style={{
        position: "absolute", top: "40%", right: "-5%", width: "25vw", height: "25vw",
        background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
        filter: "blur(60px)", zIndex: 0, pointerEvents: "none"
      }}></div>
      
      {/* Blue Mid Left */}
      <div style={{
        position: "absolute", top: "60%", left: "-5%", width: "28vw", height: "28vw",
        background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        filter: "blur(75px)", zIndex: 0, pointerEvents: "none"
      }}></div>
      
      {/* Central Neon Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "70vw", height: "70vw",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
        filter: "blur(120px)", zIndex: 0, pointerEvents: "none"
      }}></div>
      
      <Navbar />
      
      {/* MAIN CONTENT */}
      <main style={{ padding: "3rem 2rem", maxWidth: "1280px", margin: "0 auto", width: "100%", flex: 1, position: "relative", zIndex: 1 }}>
        
        <header style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-1px", marginBottom: "0.5rem" }}>Browse Events</h1>
              <p style={{ color: "#a1a1aa", fontSize: "1.1rem" }}>Discover and join the best events on campus.</p>
          </div>

          {/* Controls Toolbar: Tabs + Search + Filter */}
          <div style={{ 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "space-between", 
            flexWrap: "wrap", 
            gap: "1.5rem",
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "0.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}>
            
            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
                {filters.map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        style={{
                            background: activeFilter === filter.key ? "#27272a" : "transparent",
                            color: activeFilter === filter.key ? "white" : "#a1a1aa",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Right Side: Search and Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, justifyContent: "flex-end", minWidth: "300px" }}>
                
                {/* Search Input - Refactored to Flex for better alignment */}
                <div style={{ 
                    position: "relative", 
                    width: "100%", 
                    maxWidth: "400px",
                    height: "43px",
                    display: "flex",
                    alignItems: "center",
                    background: "#09090b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    padding: "0 0.8rem",
                    transition: "border-color 0.2s, box-shadow 0.2s"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#8b5cf6"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#3f3f46"}
                tabIndex={-1} // Allow focus detection on container if needed, but mainly for style
                >
                    <Search size={18} style={{ color: "#a1a1aa", minWidth: "18px" }} />
                    <input 
                        type="text" 
                        placeholder="Search events..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                            flex: 1,
                            padding: "0.6rem 0.5rem", 
                            background: "transparent", 
                            border: "none", 
                            color: "white", 
                            outline: "none",
                            fontSize: "0.95rem",
                            width: "100%",
                            marginTop: "1rem",
                        }}
                    />
                     {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm("")}
                            style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer", display: "flex", padding: "0" }}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Custom Filter Dropdown */}
                <div style={{ position: "relative" }} ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px", 
                            padding: "0.6rem 1rem", 
                            background: "#09090b", 
                            border: "1px solid #3f3f46", 
                            borderRadius: "8px", 
                            color: "white", 
                            cursor: "pointer",
                            fontSize: "0.95rem",
                            minWidth: "160px",
                            justifyContent: "space-between"
                        }}
                    >
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Filter size={16} color="#a1a1aa" />
                            {filterType === 'all' ? 'Category' : filterType}
                        </span>
                        <ChevronDown size={16} color="#a1a1aa" style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                    </button>

                    {isDropdownOpen && (
                        <div style={{ 
                            position: "absolute", 
                            top: "120%", 
                            right: 0, 
                            width: "200px", 
                            background: "#18181b", 
                            border: "1px solid #27272a", 
                            borderRadius: "12px", 
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)", 
                            zIndex: 50,
                            overflow: "hidden",
                            animation: "fadeIn 0.2s ease-out"
                        }}>
                             <div 
                                onClick={() => { setFilterType('all'); setIsDropdownOpen(false); }}
                                style={{ padding: "0.8rem 1rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: filterType === 'all' ? "#27272a" : "transparent" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#27272a"}
                                onMouseLeave={(e) => e.currentTarget.style.background = filterType === 'all' ? "#27272a" : "transparent"}
                             >
                                <span style={{ color: "white", fontSize: "0.9rem" }}>All Categories</span>
                                {filterType === 'all' && <Check size={14} color="#8b5cf6" />}
                             </div>
                             
                             {["Workshop", "Seminar", "Club Activity", "Competition", "Concert", "Sports", "Other"].map(type => (
                                <div 
                                    key={type} 
                                    onClick={() => { setFilterType(type); setIsDropdownOpen(false); }}
                                    style={{ padding: "0.8rem 1rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: filterType === type ? "#27272a" : "transparent" }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#27272a"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = filterType === type ? "#27272a" : "transparent"}
                                >
                                    <span style={{ color: "white", fontSize: "0.9rem" }}>{type}</span>
                                    {filterType === type && <Check size={14} color="#8b5cf6" />}
                                </div>
                             ))}
                        </div>
                    )}
                </div>

            </div>

          </div>
        </header>

        {/* EVENTS GRID */}
        {loadingEvents ? (
           <div style={{ textAlign: "center", padding: "4rem", color: "#a1a1aa" }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem", border: "1px dashed #27272a", borderRadius: "12px" }}>
            <p style={{ color: "#a1a1aa", fontSize: "1.1rem" }}>
              {activeFilter === "joined" && "You haven't joined any events yet."}
              {activeFilter === "not_joined" && "No available events to join."}
              {activeFilter === "past" && "No past events found."}
              {activeFilter === "new" && "No upcoming events found."}
              {activeFilter === "all" && "No events found."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
             {events.map((event) => (
               <div key={event._id} style={{ background: "#000", border: "1px solid #27272a", borderRadius: "12px", overflow: "hidden", transition: "all 0.2s" }}>
                 <EventCard event={event} />
               </div>
             ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
