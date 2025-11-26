import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Profile() {
  const { user, updateProfile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    setGeneralError('');
    setSuccess('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }
    
    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError('');
    setErrors({});
    setSuccess('');

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const result = await updateProfile(formData);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
    } else {
      // Check if the error is field-specific or general
      const errorMessage = result.error.toLowerCase();
      if (errorMessage.includes('email')) {
        setErrors({ email: result.error });
      } else if (errorMessage.includes('username')) {
        setErrors({ username: result.error });
      } else if (errorMessage.includes('phone')) {
        setErrors({ phone: result.error });
      } else {
        setGeneralError(result.error);
      }
    }
    
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="text-center text-neutral-300">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
        <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
               <label htmlFor="first_name" className="block text-sm font-medium text-neutral-300 mb-2">
                 First Name
               </label>
               <input
                 id="first_name"
                 name="first_name"
                 type="text"
                 required
                 className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                   errors.first_name ? 'border-red-500' : 'border-neutral-600'
                 }`}
                 value={formData.first_name}
                 onChange={handleChange}
               />
               {errors.first_name && (
                 <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>
               )}
             </div>

                         <div>
               <label htmlFor="last_name" className="block text-sm font-medium text-neutral-300 mb-2">
                 Last Name
               </label>
               <input
                 id="last_name"
                 name="last_name"
                 type="text"
                 required
                 className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                   errors.last_name ? 'border-red-500' : 'border-neutral-600'
                 }`}
                 value={formData.last_name}
                 onChange={handleChange}
               />
               {errors.last_name && (
                 <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>
               )}
             </div>
          </div>

                     <div>
             <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">
               Username
             </label>
             <input
               id="username"
               name="username"
               type="text"
               required
               className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                 errors.username ? 'border-red-500' : 'border-neutral-600'
               }`}
               value={formData.username}
               onChange={handleChange}
             />
             {errors.username && (
               <p className="mt-1 text-sm text-red-400">{errors.username}</p>
             )}
           </div>

                     <div>
             <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
               Email Address
             </label>
             <input
               id="email"
               name="email"
               type="email"
               required
               className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                 errors.email ? 'border-red-500' : 'border-neutral-600'
               }`}
               value={formData.email}
               onChange={handleChange}
             />
             {errors.email && (
               <p className="mt-1 text-sm text-red-400">{errors.email}</p>
             )}
           </div>

                     <div>
             <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-2">
               Phone Number
             </label>
             <input
               id="phone"
               name="phone"
               type="tel"
               className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                 errors.phone ? 'border-red-500' : 'border-neutral-600'
               }`}
               value={formData.phone}
               onChange={handleChange}
             />
             {errors.phone && (
               <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
             )}
           </div>

          {generalError && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="text-sm text-red-200">{generalError}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-900/50 p-4">
              <div className="text-sm text-green-200">{success}</div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
