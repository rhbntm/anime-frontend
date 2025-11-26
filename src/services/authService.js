import { api } from './apiClient.js';

class AuthService {
  constructor() {
    this.cleanupCorruptedData();
    this.token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    this.user = userData && userData !== 'undefined' ? JSON.parse(userData) : null;
  }

  // Set authentication token and user data
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Clear authentication data
  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Registration
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      this.setAuth(token, user);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  }

  // Login
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      this.setAuth(token, user);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      this.user = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch profile' 
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      this.user = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  }

  // Check authentication status
  async checkAuth() {
    try {
      const response = await api.get('/auth/check');
      return { success: true, data: response.data };
    } catch (error) {
      this.clearAuth();
      return { 
        success: false, 
        error: error.response?.data?.message || 'Authentication check failed' 
      };
    }
  }

  // Initialize authentication (call this on app start)
  async initialize() {
    if (this.token) {
      // Set the authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      
      try {
        // Verify token is still valid AND get fresh user data from database
        const response = await api.get('/auth/check');
        
        if (response.data && response.data.user) {
          // Token is valid, update user data from database
          this.user = response.data.user;
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return { success: true, user: response.data.user };
        } else {
          // Token exists but no user data returned
          this.clearAuth();
          return { success: false, error: 'Invalid token' };
        }
      } catch (error) {
        // Token is invalid/expired, clear everything
        this.clearAuth();
        return { 
          success: false, 
          error: error.response?.data?.message || 'Authentication failed' 
        };
      }
    }
    
    return { success: false, error: 'No token found' };
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      const { token, user } = response.data;
      this.setAuth(token, user);
      return { success: true, data: response.data };
    } catch (error) {
      this.clearAuth();
      return { 
        success: false, 
        error: error.response?.data?.message || 'Token refresh failed' 
      };
    }
  }

  cleanupCorruptedData() {
    const userData = localStorage.getItem('user');
    if (userData === 'undefined' || userData === 'null') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  // Check if token is expired (basic check)
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      // Decode JWT token to check expiration (basic implementation)
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      // If we can't decode the token, consider it expired
      return true;
    }
  }

  // Get token expiration time
  getTokenExpiration() {
    if (!this.token) return null;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
