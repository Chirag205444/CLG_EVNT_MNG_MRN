import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  Trash2, 
  Edit, 
  Users, 
  Loader2,
  MapPin
} from 'lucide-react';
import { MdEventNote } from 'react-icons/md';

// Helpers matching HighlightsSection & EventFeed
const getCategoryStyles = (category) => {
  switch (category?.toLowerCase()) {
    case 'workshop':
      return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'placement':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'hackathon':
      return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'event':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'announcement':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    default:
      return 'bg-rose-50 text-rose-700 border-rose-100';
  }
};

const formatLongDate = (dateStr) => {
  if (!dateStr) return 'To Be Decided';
  try {
    const cleanDate = new Date(dateStr);
    if (isNaN(cleanDate.getTime())) return dateStr;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return cleanDate.toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const getEventStatus = (eventDate) => {
  if (!eventDate) return 'Upcoming';
  const today = new Date();
  const eDate = new Date(eventDate);

  const todayReset = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const eDateReset = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());

  if (eDateReset.getTime() === todayReset.getTime()) {
    return 'Today';
  } else if (eDateReset < todayReset) {
    return 'Completed';
  } else {
    return 'Upcoming';
  }
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'Today':
      return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
    case 'Completed':
      return 'bg-slate-100 text-slate-500 border-slate-200';
    case 'Upcoming':
    default:
      return 'bg-sky-50 text-sky-700 border-sky-200';
  }
};

const getDescriptionPreview = (desc) => {
  if (!desc) return '';
  if (desc.length <= 110) return desc;
  return desc.substring(0, 110) + '...';
};

function CoMyEvents({ user, onLogout }) {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Custom toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  // Custom delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, activityId: null, activityTitle: '' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type });
    }, 3000);
  };

  useEffect(() => {
    const fetchMyActivities = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/my-posts`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            },
            withCredentials: true
          }
        );
        if (response.data && response.data.success) {
          setActivities(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch my activities:", err);
        showToast("Error loading activities.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyActivities();
  }, [user?.token]);

  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, activityId: id, activityTitle: title });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, activityId: null, activityTitle: '' });
  };

  const confirmDelete = async () => {
    const { activityId } = deleteModal;
    closeDeleteModal();
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/${activityId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          },
          withCredentials: true
        }
      );
      if (response.data && response.data.success) {
        // Remove deleted card immediately from UI state
        setActivities(prev => prev.filter(a => (a._id || a.id) !== activityId));
        showToast("Activity deleted successfully!");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      showToast("Failed to delete activity. Please try again.", "error");
    }
  };

  // Summaries Calculations
  const totalCount = activities.length;
  const upcomingCount = activities.filter(a => {
    const status = getEventStatus(a.eventDate);
    return status === 'Upcoming' || status === 'Today';
  }).length;
  const completedCount = activities.filter(a => getEventStatus(a.eventDate) === 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 relative">
      {/* Header Navigation */}
      <Navbar 
        user={user} 
        onLogout={onLogout}
        selectedCategory={null}
        setSelectedCategory={(cat) => navigate('/', { state: { selectedCategory: cat } })}
        onCategoriesClick={() => navigate('/')}
        onBotIconClick={() => navigate('/')}
      />

      {/* Main Structural Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-6 sm:py-8 flex flex-col space-y-6">
        
        {/* Breadcrumb Back Button */}
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-brand-accent transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Page Header Title and Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            My Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Manage and monitor all activities you have created.
          </p>
        </div>

        {/* Header Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Events</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                {isLoading ? '...' : totalCount}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-5.5 h-5.5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upcoming Events</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                {isLoading ? '...' : upcomingCount}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed Events</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                {isLoading ? '...' : completedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section: Loading Skeletons, Empty State, or Events Cards Grid */}
        <div className="pt-4">
          {isLoading ? (
            /* Loading State: Responsive Skeletons Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : activities.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-slate-100 rounded-2xl p-10 sm:p-16 text-center max-w-xl mx-auto space-y-5 shadow-xs animate-fade-in my-6">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <MdEventNote className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">No Activities Yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Create your first activity and engage students across campus.
                </p>
              </div>
              <button
                onClick={() => navigate('/create-activity')}
                className="px-6 py-2.5 bg-brand-accent text-white text-xs font-bold rounded-xl hover:bg-brand-accent/90 hover:shadow-md transition-all shadow-xs"
              >
                Go to Create Activity
              </button>
            </div>
          ) : (
            /* Events Grid (Responsive: 1 mobile, 2 tablet, 3 desktop) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {activities.map((activity) => {
                const actId = activity._id || activity.id;
                const dateStatus = getEventStatus(activity.eventDate);
                const categoryBadge = activity.category || 'Event';
                
                return (
                  <div
                    key={actId}
                    onClick={() => navigate(`/activity/${actId}`)}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Top Row: Category Badge & Status Badge */}
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getCategoryStyles(activity.category)}`}>
                        {categoryBadge}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getStatusStyles(dateStatus)}`}>
                        {dateStatus}
                      </span>
                    </div>

                    {/* Card Title & Description Preview */}
                    <div className="space-y-1.5 flex-1 min-h-[90px]">
                      <h3 className="font-extrabold text-slate-800 text-sm sm:text-base hover:text-brand-accent transition-colors leading-snug break-words">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed break-words">
                        {getDescriptionPreview(activity.description)}
                      </p>
                    </div>

                    {/* Metadata Section */}
                    <div className="mt-4 pt-3.5 border-t border-slate-50/80 space-y-2 text-[10px] text-slate-400 font-bold">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Event: {formatLongDate(activity.eventDate)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{activity.venue || 'Online'}</span>
                        </span>
                      </div>
                      
                      {activity.registrationDeadline && (
                        <div className="flex items-center gap-1.5 text-slate-500 border-t border-dashed border-slate-50 pt-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Deadline: {formatLongDate(activity.registrationDeadline)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Footer Buttons (stopPropagation prevents card click) */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-events/${actId}/registrations`);
                        }}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-1"
                        title="View registrations"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Registrations</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-events/edit/${actId}`);
                        }}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-1"
                        title="Edit event"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(actId, activity.title);
                        }}
                        className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-[10px] font-bold rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-1"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal Overlay */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-backdrop-in" onClick={closeDeleteModal} />
          
          {/* Modal Container */}
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-slate-100 relative z-10 animate-modal-in space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-800">Delete Activity?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{deleteModal.activityTitle}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-rose-600/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom absolute bottom-right toast notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-800 animate-slide-in text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
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

// SkeletonCard component for loading state placeholder representation
const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between animate-pulse space-y-4 select-none">
    <div className="flex justify-between items-center mb-1">
      <div className="h-4 w-16 bg-slate-200 rounded" />
      <div className="h-4 w-14 bg-slate-200 rounded" />
    </div>
    
    <div className="space-y-2 flex-1 min-h-[90px]">
      <div className="h-4.5 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-5/6" />
    </div>
    
    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
      <div className="h-3 bg-slate-200 rounded w-1/3" />
      <div className="h-3 bg-slate-200 rounded w-1/4" />
    </div>
    
    <div className="pt-3 border-t border-slate-50 flex gap-2">
      <div className="h-8.5 bg-slate-100 rounded flex-1" />
      <div className="h-8.5 bg-slate-100 rounded flex-1" />
      <div className="h-8.5 bg-slate-100 rounded flex-1" />
    </div>
  </div>
);

export default CoMyEvents;
