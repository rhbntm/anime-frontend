import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTokenRefresh } from "../hooks/useTokenRefresh.js";
import AuthStatus from "../components/AuthStatus.jsx";
import logo from "../assets/taposnapo.jpg";
import bgAstolfo from "../assets/astolfo.jpg";

export default function RootLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Enable automatic token refresh
  useTokenRefresh();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen text-neutral-100">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(10,10,10,0.7), rgba(10,10,10,0.85)), url(${bgAstolfo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8 w-8 rounded object-cover" />
            <span className="font-semibold tracking-tight">Animan Forgis on the Jeep</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {/* <NavLink to="/" className={({ isActive }) => isActive ? "text-white" : "text-neutral-300 hover:text-white"}>Home</NavLink> */}
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-white" : "text-neutral-300 hover:text-white"}>Dashboard</NavLink>
                <NavLink to="/favorites" className={({ isActive }) => isActive ? "text-white" : "text-neutral-300 hover:text-white"}>Favorites</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "text-white" : "text-neutral-300 hover:text-white"}>Profile</NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-300">
                  Welcome, {user?.first_name || user?.username || 'User'}!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-neutral-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm text-neutral-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-400">
        Built with React + Vite
      </footer>
      <AuthStatus />
    </div>
  );
}


