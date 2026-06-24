import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import { 
  ArrowLeft, 
  Users, 
  Trash2, 
  Search, 
  Download, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Loader2, 
  User, 
  Mail, 
  Hash, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return 'To Be Decided';
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
};

const formatShortDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
};

function RegistrationsPlaceholder({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams(); // postId

  const [post, setPost] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, regId: null, studentName: '' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type });
    }, 3000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user?.token || storedUser?.token;
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Post Detail
      const resPost = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`, {
        headers,
        withCredentials: true
      });
      if (resPost.data && resPost.data.success) {
        setPost(resPost.data.data);
      }

      // 2. Fetch Registrations list
      const resRegs = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/post/${id}`, {
        headers,
        withCredentials: true
      });
      if (resRegs.data && resRegs.data.success) {
        setRegistrations(resRegs.data.data);
      }
    } catch (err) {
      console.error("Error loading event registrations data:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to load registrations. Ensure you are authorized.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleOpenDelete = (regId, studentName) => {
    setDeleteModal({ isOpen: true, regId, studentName });
  };

  const handleConfirmRemove = async () => {
    if (!deleteModal.regId) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user?.token || storedUser?.token;

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/registrations/${deleteModal.regId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data && response.data.success) {
        setRegistrations(prev => prev.filter(reg => reg._id !== deleteModal.regId));
        showToast("Registration removed successfully!");
      }
    } catch (err) {
      console.error("Error removing registration:", err);
      const errorMsg = err.response?.data?.message || "Failed to remove registration.";
      showToast(errorMsg, "error");
    } finally {
      setDeleteModal({ isOpen: false, regId: null, studentName: '' });
    }
  };

  // Filter registrations locally
  const filteredRegistrations = registrations.filter(reg => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      reg.studentName?.toLowerCase().includes(query) ||
      reg.studentEmail?.toLowerCase().includes(query) ||
      reg.usn?.toLowerCase().includes(query)
    );
  });

  // Calculate metrics
  const totalRegistrations = registrations.length;
  let seatsAvailable = 'Unlimited';
  if (post && post.maxParticipants !== null && post.maxParticipants !== undefined) {
    seatsAvailable = Math.max(0, post.maxParticipants - totalRegistrations);
  }
  const deadline = post && post.registrationDeadline ? formatDate(post.registrationDeadline) : 'No Deadline';

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

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-6 sm:py-8 flex flex-col space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div>
          <button
            onClick={() => navigate('/my-events')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-brand-accent transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to My Events</span>
          </button>
        </div>

        {isLoading ? (
          /* Loading Skeleton Header */
          <div className="space-y-4 animate-pulse">
            <div className="h-7 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
          </div>
        ) : error ? (
          /* Error State View */
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto w-full space-y-5 my-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Failed to Load Registrations</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {error}
              </p>
            </div>
            <button
              onClick={fetchData}
              className="px-6 py-2.5 bg-brand-accent text-white text-xs font-bold rounded-xl hover:bg-brand-accent/90 hover:shadow-md transition-all shadow-xs"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          /* Event Content & Registrations Dashboard */
          <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight truncate">
                  {post?.title || "Activity Registrations"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  View and manage student registrations
                </p>
              </div>

              {/* Action Buttons: Export CSV (UI Only Placeholder) */}
              <div className="shrink-0">
                <button
                  onClick={() => showToast("Export CSV functionality coming soon!", "info")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-sm"
                  title="CSV Export is currently disabled"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Summary Statistics Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Total Registrations */}
              <div className="bg-white border border-slate-100/90 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-accent flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Registrations</span>
                  <span className="text-xl font-black text-slate-800 leading-tight block mt-0.5">{totalRegistrations}</span>
                </div>
              </div>

              {/* Card 2: Seats Available */}
              <div className="bg-white border border-slate-100/90 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Seats Available</span>
                  <span className="text-xl font-black text-slate-800 leading-tight block mt-0.5">{seatsAvailable}</span>
                </div>
              </div>

              {/* Card 3: Deadline */}
              <div className="bg-white border border-slate-100/90 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Registration Deadline</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 leading-tight block mt-1 truncate">{deadline}</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content Container */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-5">
              
              {/* Search Bar Block */}
              <div className="relative max-w-md w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Name, Email or USN"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all shadow-2xs"
                />
              </div>

              {/* Table / List Rendering */}
              {registrations.length === 0 ? (
                /* Empty Registrations State */
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 shadow-2xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800">No Registrations Yet</h3>
                    <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-normal">
                      No students have registered for this event.
                    </p>
                  </div>
                </div>
              ) : filteredRegistrations.length === 0 ? (
                /* Search No Results State */
                <div className="text-center py-12 text-slate-400 space-y-1">
                  <p className="font-bold text-sm text-slate-800">No matching registrations found</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting your search query.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto border border-slate-100 rounded-2xl shadow-3xs">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50/70 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">USN</th>
                          <th className="px-6 py-4">Registered On</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredRegistrations.map((reg) => (
                          <tr 
                            key={reg._id} 
                            className="hover:bg-slate-50/40 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-slate-800">{reg.studentName}</td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                              <a href={`mailto:${reg.studentEmail}`} className="hover:text-brand-accent hover:underline">
                                {reg.studentEmail}
                              </a>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-700 tracking-wide">{reg.usn}</td>
                            <td className="px-6 py-4 text-slate-450 font-semibold">{formatShortDate(reg.registeredAt)}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleOpenDelete(reg._id, reg.studentName)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-[11px] font-bold rounded-lg cursor-pointer transition-colors border border-transparent hover:border-rose-100/30"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Remove</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Responsive Cards View */}
                  <div className="block md:hidden grid grid-cols-1 gap-4">
                    {filteredRegistrations.map((reg) => (
                      <div 
                        key={reg._id}
                        className="border border-slate-100 rounded-2xl p-4 bg-white shadow-2xs space-y-3.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-slate-850 text-sm">{reg.studentName}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold">{formatShortDate(reg.registeredAt)}</span>
                          </div>
                          <div className="space-y-1 text-slate-500 text-xs font-semibold">
                            <p className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`mailto:${reg.studentEmail}`} className="hover:text-brand-accent">{reg.studentEmail}</a>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Hash className="w-3.5 h-3.5 text-slate-400" />
                              <span>USN: <span className="text-slate-750 font-bold">{reg.usn}</span></span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-slate-100">
                          <button
                            onClick={() => handleOpenDelete(reg._id, reg.studentName)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl cursor-pointer transition-colors border border-rose-100/30 bg-rose-50/20"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                            <span>Remove Student</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
          </>
        )}

      </main>

      {/* Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-backdrop-in"
            onClick={() => setDeleteModal({ isOpen: false, regId: null, studentName: '' })}
          />

          {/* Modal Content */}
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 space-y-5 animate-modal-in relative z-10">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
                Remove Registration
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
              Are you sure you want to remove <span className="text-slate-800 font-extrabold">{deleteModal.studentName}</span>'s registration from the event? This action will free up their seat.
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
              <button
                onClick={() => setDeleteModal({ isOpen: false, regId: null, studentName: '' })}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-550 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom absolute bottom-right toast notification */}
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

export default RegistrationsPlaceholder;
