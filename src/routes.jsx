import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./ui/RootLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Home = React.lazy(() => import("./pages/Home.jsx"));
const Results = React.lazy(() => import("./pages/Results.jsx"));
const AnimeDetail = React.lazy(() => import("./pages/AnimeDetail.jsx"));
const Favorites = React.lazy(() => import("./pages/Favorites.jsx"));
const Login = React.lazy(() => import("./components/Login.jsx"));
const Register = React.lazy(() => import("./components/Register.jsx"));
const Profile = React.lazy(() => import("./components/Profile.jsx"));
const Dashboard = React.lazy(() => import("./components/Dashboard.jsx"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "results", element: <Results /> },
      { path: "anime/:id", element: <AnimeDetail /> },
      { 
        path: "favorites", 
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "dashboard", 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ) 
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);


