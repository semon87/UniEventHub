import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import ClubLogin from "./pages/ClubLogin";
import StudentDashboard from "./pages/StudentDashboard";
import ClubDashboard from "./pages/ClubDashboard";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import EventDetailsPage from "./pages/EventDetailsPage";
import StatsDashboard from "./pages/StatsDashboard";
import ClubsPage from "./pages/ClubsPage";
import CalendarPage from "./pages/CalendarPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import ClubDetailsPage from "./pages/ClubDetailsPage";
import PaymentResult from "./pages/PaymentResult";
import ModeratorLogin from "./pages/ModeratorLogin";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import CreateEventPage from "./pages/CreateEventPage";
import DevelopersPage from "./pages/DevelopersPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Assuming ProtectedRoute is in components

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/club-login" element={<ClubLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/developers" element={<DevelopersPage />} />
        
        <Route path="/club/create-event" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
        
        {/* Moderator Routes (Hidden) */}
        <Route path="/moderator/login" element={<ModeratorLogin />} />
        <Route path="/moderator/dashboard" element={<ProtectedRoute><ModeratorDashboard /></ProtectedRoute>} />
        
        {/* Protected Routes */}
        <Route path="/browse-events" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} /> 
        {/* Redirect old dashboard link if necessary, or just use browse-events as main */}
        <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

        <Route path="/stats-dashboard" element={<ProtectedRoute><StatsDashboard /></ProtectedRoute>} />
        <Route path="/clubs" element={<ProtectedRoute><ClubsPage /></ProtectedRoute>} />
        <Route path="/clubs/:id" element={<ProtectedRoute><ClubDetailsPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
        <Route path="/payment/success" element={<ProtectedRoute><PaymentResult /></ProtectedRoute>} />
        <Route path="/payment/fail" element={<ProtectedRoute><PaymentResult /></ProtectedRoute>} />
        <Route path="/payment/cancel" element={<ProtectedRoute><PaymentResult /></ProtectedRoute>} />
        
        <Route path="/club-dashboard" element={<ProtectedRoute><ClubDashboard /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
