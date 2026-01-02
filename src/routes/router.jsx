// src/router/router.jsx
import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Search from "../pages/Search";
import DonationRequests from "../pages/DonationRequests";
import DonationRequestDetails from "../pages/DonationRequestDetails";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import ErrorPage from "../pages/ErrorPage";

// Dashboard Pages
import Profile from "../pages/dashboard/Profile";
import MyDonationRequests from "../pages/dashboard/MyDonationRequests";
import CreateDonationRequest from "../pages/dashboard/CreateDonationRequest";
import AllUsers from "../pages/dashboard/AllUsers";
import AllDonationRequests from "../pages/dashboard/AllDonationRequests";
import Funding from "../pages/dashboard/Funding";
import AddBlog from "../pages/dashboard/AddBlog";
import DashboardHome from "../pages/dashboard/DashboardHome";

import PrivateRoute from "../components/PrivateRoute";
import RoleRoute from "../components/RoleRoute";

// Role Groups
const adminRoles = ["admin"];
const donorRoles = ["donor"];
const volunteerRoles = ["volunteer"];
const adminAndVolunteerRoles = ["admin", "volunteer"];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/search", element: <Search /> },
      { path: "/donation-requests", element: <DonationRequests /> },
      { path: "/donation-requests/:id", element: <DonationRequestDetails /> },
      { path: "/blog", element: <Blog /> },
      { path: "/contact", element: <Contact /> },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },

      // Donor routes
      {
        element: <RoleRoute allowedRoles={donorRoles}><Outlet /></RoleRoute>,
        children: [
          { path: "my-donation-requests", element: <MyDonationRequests /> },
          { path: "create-donation-request", element: <CreateDonationRequest /> },
        ],
      },

      // Shared Admin & Volunteer Routes
      {
        element: <RoleRoute allowedRoles={adminAndVolunteerRoles}><Outlet /></RoleRoute>,
        children: [
          { path: "all-donation-requests", element: <AllDonationRequests /> },
          { path: "funding", element: <Funding /> },
          { path: "content-management-add-blog", element: <AddBlog /> },
        ],
      },

      // Admin Only routes
      {
        element: <RoleRoute allowedRoles={adminRoles}><Outlet /></RoleRoute>,
        children: [
          { path: "all-users", element: <AllUsers /> },
        ],
      },

      // Volunteer Only routes (if any in future)
      /* 
      {
        element: <RoleRoute allowedRoles={volunteerRoles}><Outlet /></RoleRoute>,
        children: []
      }
      */
    ],
  },

  { path: "*", element: <ErrorPage /> },
]);

// Helper Outlet component since RoleRoute expects children, but we are using Layout Route style
import { Outlet } from "react-router";
