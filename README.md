# Event Platform

A full-stack event management application built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse events, view details, and RSVP. Authenticated users can create and manage their own events. Administrators have platform-wide control.

## 🚀 Features Implemented

### User Authentication & Roles
- **Secure Signup/Login**: JWT-based authentication with password hashing (Bcrypt).
- **Admin Role**: Special admin account (`admin@gmail.com`) with elevated privileges to edit or delete any event.

### Event Management
- **Create Events**: Users can host events with images, capacity limits, and location details.
- **edit Events**: Creators and Admins can update event details and images.
- **Delete Events**: Restricted to the event creator or Admins.
- **Image Uploads**: Handled via Multer and served statically.

### RSVP System (High Concurrency)
- **Join/Leave Events**: Users can RSVP to events.
- **Capacity Enforcement**: Strict checks to prevent overbooking.
- **Atomic Reliability**: Race-condition proof.

### UI/UX
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Home Page**: Featured "Trending Categories" and "Upcoming Events" timeline.
- **Modern Cards**: Event cards with date badges, status indicators, and hover effects.

---

## 🛠️ Technical Explanation: RSVP Concurrency

### The Challenge
In a high-traffic scenario, if an event has **1 spot left** and **two users** click "RSVP" at the exact same millisecond, a standard "Find -> Check -> Save" pattern in Node.js would fail. Both requests would see `attendees.length < capacity` (e.g., 49 < 50), and both would save, resulting in 51/50 attendees.

### The Solution: Atomic Database Operations
We solved this by **pushing the logic into the MongoDB engine** using an atomic `findOneAndUpdate` operation.

**Code implementation (`backend/src/routes/events.js`):**

```javascript
const updated = await Event.findOneAndUpdate(
  {
    _id: eventId,
    // 1. Concurrency Check: Ensure strictly less than capacity AT THE MOMENT of update
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
    // 2. Idempotency: Ensure user isn't already in the list
    attendees: { $ne: userId } 
  },
  { 
    // 3. atomic Update
    $addToSet: { attendees: userId } 
  },
  { new: true }
);
```

**Why this works:**
1.  **Atomicity**: MongoDB guarantees that a single document modification is atomic.
2.  **Query Condition**: The `$expr` check happens *inside* the write lock on the document. If the condition fails (capacity reached), no document matches, and the update returns `null`.
3.  **No Race Condition**: Even with parallel requests, only the first one to acquire the lock will satisfy the condition and increment the array. The second will fail gracefully.

---

## 💻 Running Locally

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### 1. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/eventplatform  # Or your Atlas connection string
JWT_SECRET=your_super_secret_key_123
```

Start the server:
```bash
npm run dev
```
Server runs on: `http://localhost:4000`

### 2. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Start the client:
```bash
npm run dev
```
Client runs on: `http://localhost:5173`

### 3. Admin Credentials
The system automatically seeds an admin user if not present:
- **Email**: `admin@gmail.com`
- **Password**: `admin`

---

## 🌐 Deployment Note
To deploy this application:

1.  **Backend**: Push the `backend` folder to **Render** (Web Service).
2.  **Frontend**: Push the `frontend` folder to **Render** (Static Site).
3.  **Database**: Use **MongoDB Atlas**.

### Environment Variables (Render)
Make sure to set these in your Render Dashboard:

| Service | Variable | Value Example |
| :--- | :--- | :--- |
| **Backend** | `MONGODB_URI` | `mongodb+srv://...` |
| **Backend** | `JWT_SECRET` | `your_secret_key` |
| **Frontend** | `VITE_API_URL` | `https://your-backend-app.onrender.com/api` (Must end in `/api`) |
