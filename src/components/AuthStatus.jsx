import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authService } from '../services/authService.js';

export default function AuthStatus() {
  const { user, isAuthenticated } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const expiration = authService.getTokenExpiration();
      const isExpired = authService.isTokenExpired();
      
      setTokenInfo({
        expiration,
        isExpired,
        token: authService.getToken()?.substring(0, 20) + '...'
      });
    } else {
      setTokenInfo(null);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !tokenInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-neutral-800/90 backdrop-blur-sm rounded-lg p-3 border border-neutral-700 text-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${tokenInfo.isExpired ? 'bg-red-500' : 'bg-green-500'}`}></div>
        <span className="text-neutral-300">
          {tokenInfo.isExpired ? 'Token Expired' : 'Authenticated'}
        </span>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-400 hover:text-blue-300 ml-2"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>
      
      {showDetails && (
        <div className="space-y-1 text-neutral-400">
          <div>Token: {tokenInfo.token}</div>
          <div>Expires: {tokenInfo.expiration?.toLocaleString() || 'Unknown'}</div>
          <div>User: {user?.username || user?.email}</div>
        </div>
      )}
    </div>
  );
}
