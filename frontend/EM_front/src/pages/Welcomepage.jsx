import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Compass, Users, Calendar } from 'lucide-react';

function Welcomepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/50 via-white to-brand-light/30 flex flex-col font-sans overflow-x-hidden">

      {/* Navigation Header */}
      <header className="px-6 pt-3 py-1 max-w-7xl mx-auto w-full flex justify-between items-center z-10">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-md shadow-brand-highlight/10 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight text-base sm:text-lg">
            College Activity Hub
          </span>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="text-xs font-semibold text-slate-600 hover:text-brand-accent transition-colors py-1.5 px-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm cursor-pointer"
        >
          Sign In
        </button>
      </header>

      {/* Main Content split layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-3 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">

        {/* Left Column: Playful Illustration container */}
        <div className="lg:col-span-7 flex justify-center items-center relative order-2 lg:order-1">

          {/* Decorative Background Elements */}
          <div className="absolute top-4 left-10 w-3 h-3 rounded-full bg-brand-accent opacity-80 animate-ping-slow"></div>
          <div className="absolute bottom-10 right-10 w-5 h-5 rounded-full bg-brand-primary/40 opacity-60 animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-0 w-6 h-6 rounded-full bg-brand-accent/20 blur-md"></div>

          {/* Main Illustration Wrapper - Size adjusted to fit within viewport */}
          <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md bg-brand-light/20 rounded-3xl p-3 border border-brand-highlight/20 shadow-xs overflow-hidden hover:shadow-sm transition-shadow">

            {/* Visual grid dots */}
            <div className="absolute top-3 right-3 grid grid-cols-3 gap-1 opacity-25">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1.2 h-1.2 rounded-full bg-slate-600"></div>
              ))}
            </div>

            <img
              src="/welcome_illustration.png"
              alt="Welcome Illustration"
              className="w-full h-auto object-contain rounded-2xl relative z-10 transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Right Column: Hero copywriting */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left order-1 lg:order-2 space-y-4 lg:-ml-12">

          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-brand-light border border-brand-highlight/35 text-brand-accent text-[10px] sm:text-xs font-semibold w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
            <span>Discover Campus Life</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Connect. Participate. <br />
              <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-[#e67e22] bg-clip-text text-transparent">
                Lead Your Campus.
              </span>
            </h1>

            <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
              Welcome to the central platform for all campus clubs, events, and student communities.
              Find your circle, RSVP to upcoming activities, and coordinate events smoothly with student leaders.
            </p>
          </div>

          {/* Quick Platform Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="flex items-center space-x-1.5">
              <div className="p-1.5 bg-brand-light text-brand-accent rounded-lg shrink-0">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Explore</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="p-1.5 bg-brand-light text-brand-primary rounded-lg shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Events</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Clubs</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-row items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="flex-1 sm:flex-initial flex items-center justify-center py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent/90 shadow-md shadow-brand-highlight/20 transition-all cursor-pointer group"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="flex-1 sm:flex-initial flex items-center justify-center py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 shadow-md shadow-brand-primary/20 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100/80 bg-white/60 backdrop-blur-sm px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} College Activity Hub. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#github" className="text-slate-400 hover:text-brand-accent transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a href="#twitter" className="text-slate-400 hover:text-brand-accent transition-colors" aria-label="Twitter">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#instagram" className="text-slate-400 hover:text-brand-accent transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Welcomepage;
