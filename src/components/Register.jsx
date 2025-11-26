import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm password validation
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError('');
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      // Check if the error is field-specific or general
      const errorMessage = result.error.toLowerCase();
      if (errorMessage.includes('email')) {
        setErrors({ email: result.error });
      } else if (errorMessage.includes('username')) {
        setErrors({ username: result.error });
      } else if (errorMessage.includes('password')) {
        setErrors({ password: result.error });
      } else if (errorMessage.includes('phone')) {
        setErrors({ phone: result.error });
      } else {
        setGeneralError(result.error);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-300">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                             <div>
                 <label htmlFor="first_name" className="block text-sm font-medium text-neutral-300">
                   First Name
                 </label>
                 <input
                   id="first_name"
                   name="first_name"
                   type="text"
                   required
                   className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-neutral-400 text-white bg-neutral-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                     errors.first_name ? 'border-red-500' : 'border-neutral-600'
                   }`}
                   placeholder="First name"
                   value={formData.first_name}
                   onChange={handleChange}
                 />
                 {errors.first_name && (
                   <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>
                 )}
               </div>
                             <div>
                 <label htmlFor="last_name" className="block text-sm font-medium text-neutral-300">
                   Last Name
                 </label>
                 <input
                   id="last_name"
                   name="last_name"
                   type="text"
                   required
                   className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-neutral-400 text-white bg-neutral-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                     errors.last_name ? 'border-red-500' : 'border-neutral-600'
                   }`}
                   placeholder="Last name"
                   value={formData.last_name}
                   onChange={handleChange}
                 />
                 {errors.last_name && (
                   <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>
                 )}
               </div>
            </div>

                         <div>
               <label htmlFor="username" className="block text-sm font-medium text-neutral-300">
                 Username
               </label>
               <input
                 id="username"
                 name="username"
                 type="text"
                 required
                 className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-neutral-400 text-white bg-neutral-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                   errors.username ? 'border-red-500' : 'border-neutral-600'
                 }`}
                 placeholder="Username"
                 value={formData.username}
                 onChange={handleChange}
               />
               {errors.username && (
                 <p className="mt-1 text-sm text-red-400">{errors.username}</p>
               )}
             </div>

                         <div>
               <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                 Email Address
               </label>
               <input
                 id="email"
                 name="email"
                 type="email"
                 autoComplete="email"
                 required
                 className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-neutral-400 text-white bg-neutral-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                   errors.email ? 'border-red-500' : 'border-neutral-600'
                 }`}
                 placeholder="Email address"
                 value={formData.email}
                 onChange={handleChange}
               />
               {errors.email && (
                 <p className="mt-1 text-sm text-red-400">{errors.email}</p>
               )}
             </div>

                         <div>
               <label htmlFor="phone" className="block text-sm font-medium text-neutral-300">
                 Phone Number
               </label>
               <input
                 id="phone"
                 name="phone"
                 type="tel"
                 className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-neutral-400 text-white bg-neutral-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                   errors.phone ? 'border-red-500' : 'border-neutral-600'
                 }`}
                 placeholder="Phone number"
                 value={formData.phone}
                 onChange={handleChange}
               />
               {errors.phone && (
                 <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
               )}
             </div>

                         <div>
               <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                 Password
               </label>
               <input
                 id="password"
                 name="password"
                 type="password"
                 autoComplete="new-password"
                 required
                 className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-neutral-400 text-white bg-neutral-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                   errors.password ? 'border-red-500' : 'border-neutral-600'
                 }`}
                 placeholder="Password"
                 value={formData.password}
                 onChange={handleChange}
               />
               {errors.password && (
                 <p className="mt-1 text-sm text-red-400">{errors.password}</p>
               )}
             </div>

                         <div>
               <label htmlFor="confirm_password" className="block text-sm font-medium text-neutral-300">
                 Confirm Password
               </label>
               <input
                 id="confirm_password"
                 name="confirm_password"
                 type="password"
                 autoComplete="new-password"
                 required
                 className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-neutral-400 text-white bg-neutral-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                   errors.confirm_password ? 'border-red-500' : 'border-neutral-600'
                 }`}
                 placeholder="Confirm password"
                 value={formData.confirm_password}
                 onChange={handleChange}
               />
               {errors.confirm_password && (
                 <p className="mt-1 text-sm text-red-400">{errors.confirm_password}</p>
               )}
             </div>
          </div>

          {generalError && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="text-sm text-red-200">{generalError}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
