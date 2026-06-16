import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Loader2, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';



function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Axios request with backend API path as placeholder
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email: email.toLowerCase().trim(),
        password
      }, {
        withCredentials: true // Recommended for handling HTTP-only JWT cookies
      });

      console.log('Login Response:', response.data);

      // Handle successful login
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('auth-change'));
      }

      // For demonstration, navigate to a dashboard page (e.g. '/' or '/dashboard')
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err);
      // Fetch precise backend error if available, otherwise fallback
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to connect to the server. Please try again later.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light/50 via-white to-brand-light/30 px-4 py-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md">

        {/* Card wrapper */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 transition-all hover:shadow-2xl">

          <div className="mb-5 flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-md shadow-brand-highlight/10 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Welcome Back</h3>
              <p className="text-xs text-slate-400 mt-0.5">Sign in to your Activity Hub profile.</p>
            </div>
          </div>

          {/* Error message section */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start space-x-2.5 text-rose-700 animate-slide-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="text-xs font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm"
                  placeholder="name@college.edu"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-medium text-brand-accent hover:text-brand-accent/90 transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-slate-300 rounded accent-brand-accent cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-500 cursor-pointer select-none">
                Remember my device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-brand-primary/10 hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Navigation to Register */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New to the platform?{' '}
              <Link to="/register" className="font-semibold text-brand-accent hover:text-brand-accent/90 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default UserLogin;
