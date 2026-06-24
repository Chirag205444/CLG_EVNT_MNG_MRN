import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import { Calendar, MapPin, Loader2, Award, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return 'To Be Decided';
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
};

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

const getAvatarBgClass = (category) => {
  switch (category?.toLowerCase()) {
    case 'workshop':
      return 'bg-purple-100 text-purple-700';
    case 'placement':
      return 'bg-emerald-100 text-emerald-700';
    case 'hackathon':
      return 'bg-indigo-100 text-indigo-700';
    case 'event':
      return 'bg-blue-100 text-blue-700';
    case 'announcement':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-rose-100 text-rose-700';
  }
};

const getInitials = (name) => {
  if (!name) return 'CH';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

function MyRegistrations({ user, onLogout }) {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const token = user?.token || storedUser?.token;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/registrations/my-registrations`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );

        if (response.data && response.data.success) {
          setRegistrations(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching my registrations:', err);
        setError('Failed to load your registrations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]);

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

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-6 sm:py-8 space-y-6">
        {/* Header Title Section */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Award className="w-8 h-8 text-brand-primary" />
            <span>My Registered Activities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Manage your RSVPs, check event dates, and keep track of registered placements, workshops, and events.
          </p>
        </div>

        {/* List of Registrations */}
        {isLoading ? (
          /* Skeleton Loading Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-xs animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 bg-slate-200 rounded w-1/2" />
                    <div className="h-2.5 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center max-w-md mx-auto space-y-4">
            <div className="text-rose-500 text-3xl">⚠️</div>
            <p className="font-bold text-slate-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-brand-accent text-white text-xs font-bold rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : registrations.length === 0 ? (
          /* Empty State View */
          <div className="bg-white border border-slate-100 rounded-2xl p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto w-full space-y-5 my-6">
            <div className="w-16 h-16 bg-brand-light text-brand-accent rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">No Registrations Yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                You haven't registered for any activities yet. Find upcoming opportunities on the homepage.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-brand-accent text-white text-xs font-bold rounded-xl hover:bg-brand-accent/90 hover:shadow-md transition-all shadow-xs flex items-center gap-1.5 mx-auto active:scale-98"
            >
              <span>Explore Activities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Grid of Activity Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg) => {
              const activity = reg.post;
              if (!activity) return null; // safety check
              
              const creatorName = activity.coordinatorOrg || 'Coordinator';
              const cleanEventDate = activity.eventDate ? activity.eventDate.split('T')[0] : '';
              const formattedEventDate = formatDate(cleanEventDate);
              const venue = activity.venue || 'Online';

              return (
                <div
                  key={reg._id}
                  onClick={() => navigate(`/activity/${activity._id || activity.id}`)}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Top Row: Avatar & Coordinator Name */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-9 h-9 rounded-full ${getAvatarBgClass(activity.category)} flex items-center justify-center font-bold text-xs shrink-0 shadow-inner`}>
                        {getInitials(creatorName)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                          {creatorName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-355" />
                          <span>Registered {formatDate(reg.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="space-y-1.5 flex-1 mb-4">
                      <h3 className="font-extrabold text-slate-800 text-sm sm:text-base hover:text-brand-accent transition-colors leading-snug">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div className="pt-3.5 border-t border-slate-50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3.5 text-[10px] text-slate-400 font-semibold min-w-0 flex-1">
                      <span className="flex items-center gap-1 min-w-0">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{formattedEventDate}</span>
                      </span>
                      <span className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{venue}</span>
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Registered</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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

export default MyRegistrations;
