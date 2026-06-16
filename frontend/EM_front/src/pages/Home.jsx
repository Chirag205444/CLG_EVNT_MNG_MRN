import React, { useState } from 'react';
import { HiAcademicCap } from 'react-icons/hi';
import Navbar from '../component/Navbar';

function Home({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      
      {/* Navigation Header */}
      <Navbar 
        user={user} 
        onLogout={onLogout} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      {/* MAIN LAYOUT BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* HERO SECTION PLACEHOLDER */}
        <section className="bg-gradient-to-br from-brand-light/70 via-white to-brand-light/30 border border-brand-highlight/25 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
          <div className="absolute top-4 right-10 w-24 h-24 rounded-full bg-brand-accent/5 blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-brand-primary/5 blur-xl"></div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-brand-light border border-brand-highlight/40 text-brand-accent text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
              <span>Activity Feed</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-3.5">
              Welcome back, <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">{user.name}</span>!
            </h1>
            <p className="text-slate-500 text-sm mt-2.5 max-w-xl leading-relaxed">
              Discover and engage in upcoming college events, explore placements opportunities, join workshops, read announcements, and interact with academic clubs.
            </p>
          </div>
        </section>

        {/* FEATURED ACTIVITIES SECTION PLACEHOLDER */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-accent"></span>
              <span>Featured Activities</span>
            </h2>
            <button className="text-xs font-semibold text-brand-accent hover:underline cursor-pointer">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-brand-light text-brand-accent border border-brand-highlight/20">
                    {item === 1 ? 'Hackathon' : item === 2 ? 'Placement' : 'Workshop'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">RSVP Open</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-md group-hover:text-brand-accent transition-colors">
                  {item === 1 ? 'Campus CodeQuest 2026' : item === 2 ? 'Google Offcampus Drive' : 'Fullstack React Architecture'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  Join other coding clubs in this amazing event. Great networking opportunities and tech talks.
                </p>
                <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Auditorium Hall</span>
                  <span className="text-slate-700">June 25, 2026</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTIVITY FEED SECTION PLACEHOLDER */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Feed</h2>
              <div className="flex space-x-1">
                {['All', 'My Interests', 'Official'].map((tab, idx) => (
                  <button 
                    key={tab} 
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      idx === 0 
                        ? 'bg-brand-primary text-white' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed Cards */}
            <div className="space-y-4">
              {[1, 2].map((feed) => (
                <div key={feed} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs/50 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-highlight/60 text-brand-primary flex items-center justify-center font-bold text-xs">
                      {feed === 1 ? 'CS' : 'PD'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {feed === 1 ? 'Club Coordinator CS' : 'Placement Director'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">2 hours ago</div>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-sm sm:text-md">
                    {feed === 1 ? 'Important Notice: Hackathon Submissions extended' : 'Tech Talk: Preparing for Tech Placements in 2026'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Make sure to upload your repository before the deadline. We are excited to see your builds. Refer to requirements.
                  </p>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                      {feed === 1 ? 'announcement' : 'placement'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats/Links */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Coordinator Quick Actions</h3>
              <div className="space-y-2.5">
                <button 
                  onClick={() => alert('Create post coming soon!')}
                  className="w-full py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primary/95 transition-colors cursor-pointer"
                >
                  Create New Activity Post
                </button>
                <button 
                  onClick={() => alert('Manage registrations coming soon!')}
                  className="w-full py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Manage My Events
                </button>
              </div>
            </div>

            {/* Platform Help Center */}
            <div className="bg-brand-light/50 border border-brand-highlight/25 rounded-2xl p-5 text-center">
              <span className="inline-flex p-2 bg-white rounded-xl text-brand-accent shadow-xs mb-3">
                <HiAcademicCap className="w-5 h-5" />
              </span>
              <h4 className="text-xs font-bold text-slate-800">Need Guidance?</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                Check our documentation or contact the activity board coordinator.
              </p>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER PLACEHOLDER */}
      <footer className="bg-white border-t border-slate-100 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
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

export default Home;
