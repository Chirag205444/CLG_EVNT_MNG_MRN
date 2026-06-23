import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../component/Navbar';
import { ArrowLeft, Users, ShieldAlert } from 'lucide-react';

function RegistrationsPlaceholder({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
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
            onClick={() => navigate('/my-events')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-brand-accent transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to My Events</span>
          </button>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-brand-primary" />
            <span>Event Registrations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Monitor and manage student RSVPs and attendees list for your posted activities.
          </p>
        </div>

        {/* Placeholder Info Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto w-full space-y-5 my-6">
          <div className="w-16 h-16 bg-brand-light text-brand-accent rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">Registrations Coming Soon</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Registrations functionality is coming soon. This dashboard will be fully connected once the Registration schema and model are implemented.
            </p>
          </div>

          <button
            onClick={() => navigate('/my-events')}
            className="px-6 py-2.5 bg-brand-accent text-white text-xs font-bold rounded-xl hover:bg-brand-accent/90 hover:shadow-md transition-all shadow-xs"
          >
            Return to Dashboard
          </button>
        </div>

      </main>

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
