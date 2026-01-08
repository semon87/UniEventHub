export default function Footer() {
  return (
    <footer style={{ 
      background: "#09090b", 
      borderTop: "1px solid #27272a", 
      padding: "2rem", 
      textAlign: "center",
      color: "#71717a",
      fontSize: "0.9rem",
      marginTop: "auto"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p>&copy; {new Date().getFullYear()} UniEventHub. All rights reserved.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>
        </div>
      </div>
    </footer>
  );
}
