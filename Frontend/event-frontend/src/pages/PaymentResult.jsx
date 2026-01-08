import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = window.location.pathname.split("/").pop(); // success, fail, cancel
  const message = searchParams.get("message");
  const tranId = searchParams.get("tran_id");

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem" }}>
        
        {status === "success" && (
            <>
                <CheckCircle size={80} color="#10b981" />
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Payment Successful!</h1>
                <p style={{ color: "#a1a1aa" }}>Transaction ID: {tranId}</p>
                <p>You have successfully joined the event.</p>
                <button onClick={() => navigate("/my-tickets")} className="btn" style={{ background: "#27272a", color: "white", padding: "1rem 2rem", borderRadius: "8px", marginTop: "1rem" }}>
                    View My Tickets
                </button>
            </>
        )}

        {status === "fail" && (
            <>
                <XCircle size={80} color="#ef4444" />
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Payment Failed</h1>
                <p style={{ color: "#a1a1aa" }}>{message || "Something went wrong."}</p>
                <button onClick={() => navigate("/browse-events")} className="btn" style={{ background: "#27272a", color: "white", padding: "1rem 2rem", borderRadius: "8px", marginTop: "1rem" }}>
                    Browse Events
                </button>
            </>
        )}

        {status === "cancel" && (
            <>
                <AlertCircle size={80} color="#f59e0b" />
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Payment Cancelled</h1>
                <p style={{ color: "#a1a1aa" }}>You cancelled the transaction.</p>
                <button onClick={() => navigate("/browse-events")} className="btn" style={{ background: "#27272a", color: "white", padding: "1rem 2rem", borderRadius: "8px", marginTop: "1rem" }}>
                    Browse Events
                </button>
            </>
        )}

      </main>
      <Footer />
    </div>
  );
}
