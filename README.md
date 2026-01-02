# 🩸 Blood Donation Application — Client

Frontend application for the **Blood Donation Platform**, built with modern React and optimized for performance, accessibility, and scalability.

## 🚀 Overview

This is the **frontend (client-side)** of the Blood Donation Application.
It provides a responsive, user-friendly interface for donors, patients, volunteers, and administrators to interact with the system.

The client communicates with a RESTful backend API and focuses on clean UI/UX, efficient data fetching, and real-world usability.

## ✨ Features

- 🔐 **Firebase Authentication**: Secure role-based access control (Admin, Volunteer, Donor).
- 📍 **Location-based Search**: Filter donors by District and Upazila.
- 🩸 **Donation Requests**: Create, manage, and view donation requests.
- 💳 **Stripe Payment**: Integrated donation funding via Stripe Checkout (Redirect Flow).
- ⚡ **TanStack Query**: Efficient server-state management with caching and revalidation.
- 🎨 **Modern UI**: Full responsive design using TailwindCSS & DaisyUI.
- 🔔 **Notifications**: Real-time feedback using toast notifications.

## 🛠 Tech Stack

- **React (v18+)**
- **Vite**
- **TailwindCSS**
- **DaisyUI**
- **TanStack Query**
- **Axios**
- **Firebase Authentication**

## 📂 Project Structure

```
client/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Route pages
│   ├── hooks/       # Custom hooks (e.g. useAxiosSecure)
│   ├── context/     # AuthProvider
│   └── routes/      # Router configuration
├── public/          # Static assets
└── README.md
```

## 🔐 Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_API_URL=http://localhost:5000  # Or your production API URL
VITE_STRIPE_PK=pk_test_...         # Stripe Publishable Key
```

## ▶️ Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🎯 Responsibilities

- Handle UI rendering and routing.
- Manage authentication state.
- Communicate with backend APIs.
- Validate and submit user input.
- Display real-time feedback.

## 👨‍💻 Author

**Jahan Ebna Delower**
*Frontend / Full Stack Web Developer*

- 🌐 [Portfolio](https://jahan-d.web.app)
- 💻 [GitHub](https://github.com/jahan-d)
