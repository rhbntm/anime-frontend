import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../services/apiClient.js';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch dashboard data and stats in parallel
      const [dashboardResponse, statsResponse] = await Promise.all([
        api.get('/dashboard/'),
        api.get('/dashboard/stats')
      ]);

      setDashboardData(dashboardResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center text-neutral-300">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-neutral-300">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="rounded-md bg-red-900/50 p-4 max-w-md mx-auto">
          <div className="text-sm text-red-200">{error}</div>
          <button
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-neutral-300">
          Welcome back, {user?.first_name || user?.username || 'User'}!
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                {key.replace(/_/g, ' ')}
              </h3>
              <p className="text-2xl font-bold text-white mt-2">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Dashboard Content */}
      {dashboardData && (
        <div className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
          <h2 className="text-xl font-semibold text-white mb-4">Dashboard Overview</h2>
          <div className="space-y-4">
            {Object.entries(dashboardData).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-neutral-700 last:border-b-0">
                <span className="text-neutral-300 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-white font-medium">
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh Dashboard
        </button>
      </div>
    </div>
  );
}
