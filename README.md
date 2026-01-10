# 🎓 UniEventHub

**UniEventHub** is a full-stack university event management platform built to seamlessly connect students and clubs. It features role-based access for students, club administrators, and moderators, enabling secure event creation, discovery, and ticket purchasing with real-time tracking and analytics.

🔗 Live Site: https://unievent-hub.vercel.app
---

## 🚀 Key Features

### 🔐 Authentication & Authorization
- Secure **Login & Signup**
- **Role-based access control**:
  - Student
  - Club Admin
  - Moderator

---

### 🛡️ Moderator Panel
- Approve or reject **club registrations**
- Grant permissions for **event hosting**
- Maintain platform integrity and authenticity

---

### 🎟️ Student Features
- Browse upcoming events with **advanced filters**
- View registered clubs and their events
- Purchase **event passes** securely
- Personal **student dashboard**:
  - View registered events
  - Track payment history

---

### 🏛️ Club Admin Features
- Host and manage events
- Edit event details in real time
- Track:
  - Total attendees
  - Total revenue per event
- Upload event banners and images

---

### 💳 Payment Integration
- Secure **SSLCommerz payment gateway**
- Seamless online payment for event passes
- Transaction verification and tracking

---

## 🧰 Tech Stack

### Frontend
- React.js

### Backend
- Node.js

### Database
- MongoDB Atlas

### Cloud & Deployment
- Cloudinary – Image and media storage
- Railway – Backend hosting
- Vercel – Frontend deployment

---

## 👨‍💻 Author
Developed for academic and learning purposes.

---

## 🛡️ Moderator Access (Restricted)

The **Moderator Panel** is a protected and hidden route, accessible only to authorized moderators.

🔗 **Moderator Login URL:**  
https://unievent-hub.vercel.app/moderator/login  
*(This route is intentionally hidden from public navigation for security purposes.)*

---

## 🔄 System Workflow

The platform follows a controlled approval-based workflow to ensure authenticity and quality of events:

1. **Club Registration**  
   - A club submits a registration request.

2. **Moderator Login & Review**  
   - Moderator logs in through the restricted panel.
   - Reviews and approves or rejects the club registration.

3. **Club Authentication**  
   - Approved clubs can log in as **Club Admins**.

4. **Event Creation**  
   - Club Admin creates and submits an event.

5. **Event Approval**  
   - Moderator reviews and approves the event.

6. **Event Hosting**  
   - Approved events become visible to students and are officially hosted on the platform.

---

This approval-based system ensures platform integrity, prevents unauthorized events, and maintains a trusted university event ecosystem.




