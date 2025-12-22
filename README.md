<<<<<<< HEAD
# Blood Donation Application (v3)

A MERN stack application to connect blood donors with those in need.

## Live URL
[
blooddonationapp-lsuveq169-jahan-ds-projects.vercel.app
blooddonationappv3.web.app/
]

## Features
- **Authentication**: JWT-based login/register with functionality for Donors, Volunteers, and Admins.
- **Dashboard**: Role-based dashboards for managing requests, users, and funding.
- **Donation Requests**: Create, view, edit, and delete donation requests.
- **Search**: Search for blood donors by blood group and location.
- **Funding**: Secure donation system using Stripe.
- **Blog**: Read and manage health-related blogs.
- **Responsiveness**: Fully responsive design for mobile, tablet, and desktop.

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, DaisyUI, React Query, Axios, Stripe Elements.
- **Backend**: Node.js, Express, MongoDB, JWT, Stripe API.

## Admin Credentials
- **Email**: jahanebnadelower@gmail.com
- **Password**: asdfghjkl

## Setup Instructions
1. Clone the repository.
2. `cd server` -> `npm install` -> `npm start`
3. `cd client/Blood Donation app v3` -> `npm install` -> `npm run dev`
=======
# 🩸 Blood Donation Management System – Client

A modern, responsive blood donation management web application built with **React + Vite**, **Firebase Authentication**, and **Tailwind CSS (DaisyUI)**.  
This client handles user authentication, role-based dashboards, donation requests, and donor searching.

🔗 **Live Site:** https://your-firebase-app.web.app  
🔗 **Backend API:** https://your-vercel-server.vercel.app

---

## 🚀 Features

### 🔐 Authentication
- Email & Password authentication (Firebase)
- Persistent login state
- Secure logout
- Role-based access control (Admin | Donor | Volunteer)

### 👥 User Roles
- **Donor**
  - Create blood donation requests
  - View own donation requests
- **Volunteer**
  - View all donation requests
- **Admin**
  - Manage users
  - Manage all donation requests
  - Funding overview

### 🧭 Navigation
- Protected routes (PrivateRoute)
- Role-based dashboard sidebar
- Responsive navbar & layout

### 🎨 UI / UX
- Fully responsive design
- Dark mode friendly UI
- Built with Tailwind CSS + DaisyUI
- Loading spinners & graceful error handling

---

## 🛠️ Tech Stack

### Frontend
- **React 18**
- **Vite**
- **React Router**
- **@tanstack/react-query**
- **Axios**
- **Firebase Authentication**
- **Tailwind CSS**
- **DaisyUI**
- **React Icons**

### Hosting
- **Firebase Hosting**

---

## 📁 Project Structure

src/
│
├── api/
│ └── axiosInstance.js
│
├── components/
│ ├── Navbar.jsx
│ ├── Sidebar.jsx
│ └── Spinner.jsx
│
├── context/
│ └── AuthContext.jsx
│
├── hooks/
│ ├── useUsers.js
│ └── useUserRole.js
│
├── pages/
│ ├── Login.jsx
│ ├── Register.jsx
│ └── Dashboard/
│
├── router/
│ └── router.jsx
│
├── firebase/
│ └── firebase.init.js
│
└── main.jsx

yaml
Copy code

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_sender_id
VITE_appId=your_firebase_app_id

VITE_API_URL=https://your-vercel-server.vercel.app
⚠️ Never commit .env files to GitHub.

🧪 Local Development
1️⃣ Install dependencies
bash
Copy code
npm install
2️⃣ Run development server
bash
Copy code
npm run dev
3️⃣ Build for production
bash
Copy code
npm run build
🔐 Route Protection
Authenticated routes are protected using Firebase auth state.

Unauthorized users are redirected to /login.

Role-based routes are handled via custom hooks.

📦 Deployment
Client (Firebase Hosting)
bash
Copy code
npm run build
firebase deploy
Server (Vercel)
Handled separately in the server repository.

🧠 Notes
React Query is used for efficient server-state management.

Axios interceptor handles secure API requests.

Firebase auth state sync ensures smooth login redirects.

Designed for scalability and real-world usage.

📜 License
This project is for educational and demonstration purposes.
You may modify and reuse it freely.

✨ Author
Jahan
Computer Science Student
Aspiring Full-Stack Developer
>>>>>>> df15295966f80ee2f34bbbe0e0bb2289c0549546
