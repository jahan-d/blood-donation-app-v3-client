# Blood Donation App v3 — Frontend Client

**The user interface for the Blood Donation Management System** — built with React 19, Vite, Tailwind CSS 4, and Firebase Authentication.

This client application provides an intuitive dashboard for Donors, Volunteers, and Admins to manage blood donation requests and funding.

---

## 🚀 Live Demo
**Visit:** [https://blooddonationappv3.web.app/](https://blooddonationappv3.web.app/)

---

## 🛠️ Tech Stack

- **React 19** – Modern UI library
- **Vite** – Fast build tool
- **Tailwind CSS 4** – Utility-first styling
- **DaisyUI** – Component library
- **TanStack Query** – Server state management
- **Firebase Auth** – Secure user authentication
- **Axios** – HTTP client

---

## 📌 Key Features

- **Responsive Design** – Fully optimized for mobile and desktop
- **Role-Based Dashboards** – Custom views for Donors, Volunteers, and Admins
- **Real-Time Data** – Efficient data fetching with caching
- **Secure Payments** – Integrated Stripe payment elements
- **Authentication** – Email/Password and Social Login via Firebase

---

## 📁 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_apiKey=<YOUR_FIREBASE_API_KEY>
VITE_authDomain=blooddonationappv3.firebaseapp.com
VITE_projectId=blooddonationappv3
VITE_storageBucket=blooddonationappv3.appspot.com
VITE_messagingSenderId=<YOUR_SENDER_ID>
VITE_appId=<YOUR_APP_ID>
```

---

## 🛠 Running Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/jahan-d/blood-donation-app-v3-client.git
   cd blood-donation-app-v3-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the client**
   ```bash
   npm run dev
   ```

4. **Open in browser:** `http://localhost:5173`

---

## ☁️ Deployment (Firebase)

1. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
2. **Build for Production**
   ```bash
   npm run build
   ```
3. **Deploy**
   ```bash
   firebase deploy
   ```

---

## 📝 Author

**Jahan**
- Portfolio: [jahan-d.web.app](https://jahan-d.web.app)
- GitHub: [@jahan-d](https://github.com/jahan-d)
