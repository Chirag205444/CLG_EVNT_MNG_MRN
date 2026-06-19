import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../component/Navbar';
import HeroSection from '../component/HeroSection';
import HighlightsSection from '../component/HighlightsSection';
import EventFeed from '../component/EventFeed';

function Home({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const feedSectionRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">

      {/* Navigation Header */}
      <Navbar
        user={user}
        onLogout={onLogout}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onCategoriesClick={() => {
          if (feedSectionRef.current) {
            feedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        onBotIconClick={() => {
          if (feedSectionRef.current) {
            feedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* MAIN LAYOUT BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-4 sm:py-5 space-y-8">

        {/* HERO SECTION */}
        <HeroSection user={user} />

        {/* CAMPUS HIGHLIGHTS THIS WEEK */}
        <HighlightsSection />

        {/* EVENT FEED & AI ASSISTANT SECTION */}
        <EventFeed ref={feedSectionRef} selectedCategory={selectedCategory} />

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
