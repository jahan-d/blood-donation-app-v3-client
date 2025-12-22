// src/router/router.jsx
import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../pages/dashboard/DashboardLayout";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Search from "../pages/Search";
import DonationRequests from "../pages/DonationRequests";

// Dashboard Pages
import Profile from "../pages/dashboard/Profile";
import MyDonationRequests from "../pages/dashboard/MyDonationRequests";
import CreateDonationRequest from "../pages/dashboard/CreateDonationRequest";
import AllUsers from "../pages/dashboard/AllUsers";
import AllDonationRequests from "../pages/dashboard/AllDonationRequests";
import Funding from "../pages/dashboard/Funding";

import PrivateRoute from "../components/PrivateRoute";
import RoleRoute from "../components/RoleRoute";

// Role Groups
const adminRoles = ["admin"];
const donorRoles = ["donor"];
const volunteerRoles = ["volunteer"];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/search", element: <Search /> },
      { path: "/donation-requests", element: <DonationRequests /> },
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
      { path: "profile", element: <Profile /> },

      // Donor routes
      {
        element: (
          <RoleRoute allowedRoles={donorRoles}>
            <></>
          </RoleRoute>
        ),
        children: [
          { path: "my-donation-requests", element: <MyDonationRequests /> },
          { path: "create-donation-request", element: <CreateDonationRequest /> },
        ],
      },

      // Admin routes
      {
        element: (
          <RoleRoute allowedRoles={adminRoles}>
            <></>
          </RoleRoute>
        ),
        children: [
          { path: "all-users", element: <AllUsers /> },
          { path: "all-donation-requests", element: <AllDonationRequests /> },
          { path: "funding", element: <Funding /> },
        ],
      },

      // Volunteer routes
      {
        element: (
          <RoleRoute allowedRoles={volunteerRoles}>
            <></>
          </RoleRoute>
        ),
        children: [
          { path: "all-donation-requests", element: <AllDonationRequests /> },
          { path: "funding", element: <Funding /> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
