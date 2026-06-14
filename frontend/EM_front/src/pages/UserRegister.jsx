import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, Loader2, GraduationCap, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';


function UserRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // Supports backend's student/coordinator roles
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field validations
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // Axios request with backend API path as placeholder
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role
      }, {
        withCredentials: true 
      });

      console.log('Register Response:', response.data);

      setSuccess('Registration successful! Redirecting you to the login page...');

      // Auto-redirect to login page after 2.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      console.error('Registration Error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to complete registration. Please try again.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light/50 via-white to-brand-light/30 px-4 py-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md">

        {/* Card wrapper */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-6 transition-all hover:shadow-2xl">

          <div className="mb-4 flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-md shadow-brand-highlight/10 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Create an Account</h3>
              <p className="text-xs text-slate-400 mt-0.5">Get started with your Activity Hub profile.</p>
            </div>
          </div>

          {/* Success message section */}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start space-x-2.5 text-emerald-700 animate-slide-in">
              <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 shrink-0 text-emerald-600" />
              <div className="text-xs font-medium">
                {success}
                <div className="mt-1 flex items-center text-[10px] text-emerald-600/80 font-normal">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Redirecting to login...
                </div>
              </div>
            </div>
          )}

          {/* Error message section */}
          {error && !success && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start space-x-2.5 text-rose-700 animate-slide-in">
              <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0" />
              <span className="text-xs font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm"
                  placeholder="name@college.edu"
                />
              </div>
            </div>

            {/* Role Field */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Profile Type
              </span>
              <div className="flex bg-slate-100 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${role === 'student'
                      ? 'bg-white shadow-sm text-brand-accent'
                      : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('coordinator')}
                  className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${role === 'coordinator'
                      ? 'bg-white shadow-sm text-brand-accent'
                      : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Coordinator
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm"
                  placeholder="Minimum 6 characters"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm"
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full relative flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-brand-primary/10 hover:shadow-lg transition-all mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Navigation to Login */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-accent hover:text-brand-accent/90 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default UserRegister;
