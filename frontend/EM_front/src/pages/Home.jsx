import React, { useState } from 'react';
import { HiAcademicCap } from 'react-icons/hi';
import Navbar from '../component/Navbar';
import HeroSection from '../component/HeroSection';
import HighlightsSection from '../component/HighlightsSection';

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
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-4 sm:py-5 space-y-8">

        {/* HERO SECTION */}
        <HeroSection user={user} />

        {/* CAMPUS HIGHLIGHTS THIS WEEK */}
        <HighlightsSection />

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
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${idx === 0
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

export default Home;
