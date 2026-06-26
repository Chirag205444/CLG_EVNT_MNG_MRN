import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import {
  User,
  Mail,
  Calendar,
  Shield,
  AlertTriangle,
  Loader2,
  Trash2,
  Lock,
  ArrowLeft
} from 'lucide-react';

function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  const [tempName, setTempName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type });
    }, 3000);
  };

  const handleSaveChanges = async () => {
    setIsSaveModalOpen(false);

    const trimmedName = tempName.trim();
    if (!trimmedName) {
      showToast("Full Name cannot be empty.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user?.token || storedUser?.token;

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
        { name: trimmedName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data && response.data.user) {
        const updatedUser = {
          ...storedUser,
          ...response.data.user,
          token: token
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('auth-change'));
        showToast("Profile changes saved successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to update profile changes.";
      showToast(errorMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    setIsDeleting(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user?.token || storedUser?.token;

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      showToast("Account deleted successfully.");
      setTimeout(() => {
        onLogout();
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error("Error deleting account:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to delete account.";
      showToast(errorMsg, "error");
      setIsDeleting(false);
    }
  };

  const getMemberSinceFromId = (userIdHex) => {
    if (!userIdHex) return 'N/A';
    try {
      const timestamp = parseInt(userIdHex.substring(0, 8), 16) * 1000;
      const date = new Date(timestamp);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return 'N/A';
    }
  };

  const nameInitial = tempName ? tempName.trim().charAt(0).toUpperCase() : 'U';
  const memberSince = getMemberSinceFromId(user?.id || user?._id);
  const isSaveDisabled = tempName.trim() === (user?.name || '') || !tempName.trim();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <Navbar
        user={user}
        onLogout={onLogout}
        selectedCategory={null}
        setSelectedCategory={(cat) => navigate('/', { state: { selectedCategory: cat } })}
        onCategoriesClick={() => navigate('/')}
        onBotIconClick={() => navigate('/')}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-4 sm:py-6 flex flex-col space-y-4 animate-fade-in">

        {/* Back Navigation Button */}
        <div className="max-w-xl mx-auto w-full mb-1">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-brand-accent transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home Feed</span>
          </button>
        </div>

        {/* Profile Content Card - Centered Compact Width */}
        <div className="bg-white border border-slate-100/90 rounded-3xl p-4 sm:p-5 shadow-sm space-y-5 max-w-xl mx-auto w-full">

          {/* Top Center - Avatar & Basic Info */}
          <div className="flex flex-col pt-2 items-center text-center space-y-2 border-b border-slate-50 pb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent text-white flex items-center justify-center font-black text-2xl shadow-md border-4 border-slate-50 relative group">
              {nameInitial}
            </div>

            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-850 truncate max-w-md" title={user?.name}>
                {user?.name}
              </h2>
              <p className="text-xs pb-2 text-slate-400 font-medium truncate max-w-md" title={user?.email}>
                {user?.email}
              </p>
            </div>

            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-light text-brand-accent border border-brand-highlight/20">
              {user?.role}
            </div>
          </div>

          {/* Bottom - Form Details */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-850 border-b border-slate-50 pb-2 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Input */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-3 pr-3 py-1.5 bg-slate-50/55 border border-slate-200 hover:border-slate-350 focus:border-brand-accent focus:bg-white rounded-xl text-sm font-semibold text-slate-800 transition-all outline-hidden focus:shadow-xs"
                  />
                </div>
              </div>

              {/* Email Address Read-only */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <span className="inline-flex items-center gap-1 text-[9px] text-slate-400 font-semibold">
                    <Lock className="w-2.5 h-2.5" /> Read-only
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-3 pr-3 py-1.5 bg-slate-50/40 border border-slate-100 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Role Read-only */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Role
                  </label>
                  <span className="inline-flex items-center gap-1 text-[9px] text-slate-400 font-semibold">
                    <Lock className="w-2.5 h-2.5" /> Read-only
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                    disabled
                    className="w-full pl-3 pr-3 py-1.5 bg-slate-50/40 border border-slate-100 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Member Since Read-only */}
              <div className="space-y-1 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Member Since
                  </label>
                  <span className="inline-flex items-center gap-1 text-[9px] text-slate-400 font-semibold">
                    <Lock className="w-2.5 h-2.5" /> Read-only
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={memberSince}
                    disabled
                    className="w-full pl-3 pr-3 py-1.5 bg-slate-50/40 border border-slate-100 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Actions Button */}
            <div className="flex justify-end pt-4 border-t border-slate-50">
              <button
                onClick={() => setIsSaveModalOpen(true)}
                disabled={isSaveDisabled || isSaving}
                className="px-4 py-2 bg-brand-accent text-white text-xs font-bold rounded-xl hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:shadow-sm"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-white border border-rose-100/80 rounded-3xl p-4 sm:p-5 shadow-xs/40 space-y-3 max-w-xl mx-auto w-full">
          <h3 className="text-xs sm:text-sm font-extrabold text-rose-600 border-b border-rose-50 pb-2 flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Danger Zone</span>
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs text-slate-700 font-bold">
                Delete Account
              </p>
              <p className="text-[10px] sm:text-xs text-slate-405 font-semibold leading-relaxed">
                Permanently delete your CampusHub account and remove all RSVP information. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-3.5 py-1.5 border border-rose-250 hover:bg-rose-50/40 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Delete Account
            </button>
          </div>
        </div>

      </main>

      {/* Save Changes Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-backdrop-in"
            onClick={() => setIsSaveModalOpen(false)}
          />

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 space-y-5 animate-modal-in relative z-10">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-extrabold text-slate-850 text-sm sm:text-base tracking-tight">
                Confirm Profile Changes
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                Are you sure you want to save these profile changes?
              </p>
              <p className="text-[10px] sm:text-xs text-rose-500 font-semibold leading-relaxed bg-rose-50/50 border border-rose-100/30 rounded-xl p-3">
                Note: Updating your profile name will only affect future event registrations. Existing registrations will continue to display the name that was used at the time of registration.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-550 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-backdrop-in"
            onClick={() => setIsDeleteModalOpen(false)}
          />

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 space-y-5 animate-modal-in relative z-10">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
                Delete Account
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                Are you sure you want to permanently delete your CampusHub account?
              </p>
              <p className="text-[10px] sm:text-xs text-rose-600 font-semibold leading-relaxed bg-rose-50 border border-rose-100 rounded-xl p-3">
                Warning: This action is permanent and cannot be undone. You will lose access to your account and all associated data.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-550 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-800 animate-slide-in text-xs font-bold">
          <span className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-400'} animate-ping`}></span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} CampusHub Activity Board. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#about" className="hover:text-brand-accent transition-colors font-medium">About</a>
            <a href="#help" className="hover:text-brand-accent transition-colors font-medium">Help Center</a>
            <a href="#privacy" className="hover:text-brand-accent transition-colors font-medium">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Profile;
