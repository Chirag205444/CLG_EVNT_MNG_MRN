# 🎓 CampusHub - AI-Powered Campus Event Management Platform

CampusHub is a modern **full-stack MERN application** that streamlines campus event management by connecting **students** and **coordinators** on a single platform. It enables coordinators to publish and manage events while allowing students to discover, register, and stay updated about workshops, hackathons, placement drives, and campus activities.

What makes CampusHub unique is its **AI-powered Campus Assistant**, which answers student queries using real-time event data stored in the application's database instead of acting as a generic chatbot.

---

## 🚀 Live Demo

**URL**:https://clg-evnt-mng-mrn-git-master-chirag4.vercel.app/

---

# ✨ Features

## 🔐 Authentication & Authorization

- JWT-based Authentication
- Secure Login & Registration
- Role-based Access Control
- Student & Coordinator Roles
- Protected Routes
- Persistent Authentication

---

## 📅 Event Management

Coordinators can:

- Create Events
- Edit Existing Events
- Delete Events
- View Event Details
- Manage Event Registrations

Supported Event Categories:

- Workshop
- Placement
- Hackathon
- Event
- Club Activity
- Announcement
- Others

---

## 🎯 Smart Event Discovery

Students can:

- Browse campus events
- Search events
- Filter by category
- View detailed event information
- Register for events
- Infinite scrolling for smooth browsing

---

## 📝 Event Registration

Students can register with:

- Prefilled Name
- Prefilled Email
- USN
- One-click Registration

Additional Features:

- Duplicate registration prevention
- Live seat availability
- Registration deadline handling
- Registration confirmation

---

## 👨‍💼 Coordinator Dashboard

Each coordinator can:

- View only their events
- Edit events
- Delete events
- View registrations
- Remove registrations
- Export registrations as CSV

Registration Dashboard includes:

- Total Registrations
- Seats Available
- Registration Deadline
- Student Registration Table

---

## 📤 CSV Export

Coordinators can export registrations as CSV.

The generated file contains:

- Student Name
- Email
- USN
- Registration Date

CSV filename is automatically generated using the event title.

---

## 👤 User Profile

Users can:

- Update Name
- View Email (Read-only)
- Delete Account
- Confirmation dialog before updating profile

Past registrations remain unchanged to preserve historical records.

---

## 🤖 AI Campus Assistant

CampusHub includes an AI-powered assistant built using **Google Gemini**.

Instead of answering using general internet knowledge, the assistant:

- Retrieves relevant data from MongoDB
- Understands user intent
- Generates contextual responses using Gemini

Example Questions:

- What workshops are happening this week?
- Upcoming placement drives
- Show my registrations
- Registration deadlines
- Available hackathons

---

## ⚡ Infinite Scrolling

Event Feed uses lazy loading.

- Initially loads 10 events
- Automatically loads additional events while scrolling
- Smooth user experience
- Optimized backend pagination

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- CSV Generation

---

## AI

- Google Gemini API

---

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

# 📂 Project Structure

```
CampusHub
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   └── utils
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   ├── services
│   ├── utils
│   └── config
│
└── README.md
```

---


# 🌟 Key Highlights

- Full-stack MERN Architecture
- JWT Authentication
- Role-Based Authorization
- Infinite Scrolling
- AI Integration using Google Gemini
- Event Registration System
- CSV Export
- Responsive UI
- Production Deployment
- MongoDB Atlas
- Modern UI/UX

---

# 🚀 Future Improvements

- Email Notifications
- Calendar Integration
- Event Recommendations
- Attendance Tracking
- QR Code Check-in
- Push Notifications
- AI Event Summaries
- Analytics Dashboard
- Multi-College Support

---

# 👨‍💻 Author

**Chirag Shetty**

- GitHub: https://github.com/Chirag205444
- LinkedIn: https://www.linkedin.com/in/chirag-shetty-9564742bb/

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
