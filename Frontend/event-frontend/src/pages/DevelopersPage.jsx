import React from "react";
import { Github, Linkedin, ArrowLeft, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DevelopersPage() {
  const navigate = useNavigate();

  const developers = [
    {
      id: 1,
      name: "Md. Ashraful Islam Semon",
      role: "Full Stack Developer",
      image: "/dev_images/md_ashraful_islam_semon.png",
      github: "https://github.com/semon87",
      linkedin: "https://linkedin.com/in/ashraful-semon87",
    },
    {
      id: 2,
      name: "Suvra Chandra Das",
      role: "Backend Engineer",
      image: "/dev_images/suvra_chandra_das.jpeg",
      github: "https://github.com/shuvr09",
      linkedin: "https://www.linkedin.com/in/suvra-chandra-das/",
    },
    {
      id: 3,
      name: "Srabon Das",
      role: "Frontend Specialist",
      image: "/dev_images/srabon_das.jpeg",
      github: "https://github.com/srabon",
      linkedin: "https://www.linkedin.com/in/srabon-das-546a53353/",
    },
    {
      id: 4,
      name: "Md Mahfuzur Rahman",
      role: "UI/UX Designer",
      image: "/dev_images/md_mahfuzur_rahman.jpeg",
      github: "https://github.com/mahfuzur_rahman",
      linkedin: "https://www.linkedin.com/in/mahfuzur-rahman-546a53353/",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "white", position: "relative", overflow: "hidden" }}>
        {/* Background Elements */}
        <div style={{
            position: "absolute", top: "-20%", left: "-10%", width: "50vw", height: "50vw",
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            filter: "blur(100px)", zIndex: 0
        }}></div>
        <div style={{
            position: "absolute", bottom: "-20%", right: "-10%", width: "50vw", height: "50vw",
            background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
            filter: "blur(100px)", zIndex: 0
        }}></div>

        <nav className="container landing-nav">
            <div style={{ marginLeft: "2rem", fontSize: "1.5rem", fontWeight: "800", background: "linear-gradient(to right, white, var(--text-muted))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            UniEventHub
            </div>
            <div className="nav-links" style={{ width: "32px", height: "32px",marginLeft: "15rem" }}>
            <span style={{ cursor: "pointer", color: "white" }} onClick={() => navigate("/")}>Home</span>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/developers")}>Developers</span>
            </div>
            <div >
            
            </div>
        </nav>

        <main className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 4rem", position: "relative", zIndex: 10 }}>
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                <div style={{ 
                    display: "inline-flex", alignItems: "center", gap: "10px", 
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))", 
                    padding: "0.5rem 1rem", borderRadius: "20px", marginBottom: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.1)"
                }}>
                    <Code2 size={20} color="#c4b5fd" />
                    <span style={{ color: "#c4b5fd", fontWeight: "600", fontSize: "0.9rem" }}>THE MINDS BEHIND IT</span>
                </div>
                <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: "800", marginBottom: "1rem" }}>
                    Meet the <span style={{ background: "linear-gradient(to right, #a855f7, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Developers</span>
                </h1>
                <p style={{ color: "#a1a1aa", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
                    Passionate engineering students building the future of campus event management.
                </p>
            </div>

            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                gap: "2.5rem",
                justifyContent: "center"
            }}>
                {developers.map((dev) => (
                    <div key={dev.id} className="dev-card" style={{
                        background: "rgba(24, 24, 27, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "24px",
                        padding: "2.5rem 2rem",
                        textAlign: "center",
                        backdropFilter: "blur(12px)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: "default"
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-10px)";
                        e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(139, 92, 246, 0.3)";
                        e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                    }}
                    >
                        <div style={{ 
                            width: "180px", height: "180px", margin: "0 auto 1.5rem", borderRadius: "50%", 
                            overflow: "hidden", border: "4px solid rgba(139, 92, 246, 0.3)", padding: "4px",
                            boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)"
                        }}>
                             <img 
                                src={dev.image} 
                                alt={dev.name} 
                                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", background: "#27272a" }} 
                             />
                        </div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>{dev.name}</h3>
                        <p style={{ color: "#a855f7", fontWeight: "600", fontSize: "0.95rem", marginBottom: "1.5rem" }}>{dev.role}</p>
                        
                        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                            <a href={dev.github} target="_blank" rel="noopener noreferrer" style={{
                                color: "#a1a1aa", padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.05)",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#a1a1aa"; }}
                            >
                                <Github size={20} />
                            </a>
                            <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" style={{
                                color: "#a1a1aa", padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.05)",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#0077b5"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#a1a1aa"; }}
                            >
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    </div>
  );
}
