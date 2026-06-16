import React, { useState, useRef, useEffect } from 'react';
import { 
  FiBell, 
  FiChevronDown, 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiHome 
} from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';
import { 
  MdCampaign, 
  MdEvent, 
  MdWorkOutline, 
  MdSchool, 
  MdCode, 
  MdGroups 
} from 'react-icons/md';

export const categories = [
  { name: 'Events', icon: MdEvent },
  { name: 'Placements', icon: MdWorkOutline },
  { name: 'Workshops', icon: MdSchool },
  { name: 'Announcements', icon: MdCampaign },
  { name: 'Hackathons', icon: MdCode },
  { name: 'Club Activities', icon: MdGroups }
];

function Navbar({ user, onLogout, selectedCategory, setSelectedCategory }) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName === selectedCategory ? null : catName);
  };

  return (
    <>
      {/* Overlay for Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity duration-300 lg:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Slide-in Mobile Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-sm shrink-0">
              <HiAcademicCap className="w-5.5 h-5.5" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-md">CampusHub</span>
          </div>
          <button 
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FiX className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* User Brief info in Mobile drawer */}
          <div className="p-4 rounded-xl bg-brand-light/45 border border-brand-highlight/20 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-highlight text-brand-primary flex items-center justify-center font-bold text-lg shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{user.role}</div>
              <div className="text-sm font-bold text-slate-800 leading-tight">{user.name}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsMobileDrawerOpen(false)}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-accent bg-brand-light/60 border-l-3 border-brand-accent transition-colors"
            >
              <FiHome className="w-4.5 h-4.5" />
              <span>Home Feed</span>
            </button>
          </div>

          {/* Categories Sublist */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3.5">
              Categories
            </div>
            <div className="grid grid-cols-1 gap-1">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isSelected 
                        ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className="w-4.5 h-4.5 shrink-0" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-100 space-y-2">
          <button 
            onClick={() => {
              setIsMobileDrawerOpen(false);
              alert('Profile page coming soon!');
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <FiUser className="w-4.5 h-4.5 text-slate-400" />
            <span>My Profile</span>
          </button>
          
          <button 
            onClick={() => {
              setIsMobileDrawerOpen(false);
              onLogout();
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50/70 transition-colors"
          >
            <FiLogOut className="w-4.5 h-4.5 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN TOP NAVBAR */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Brand Container */}
            <div className="flex items-center space-x-3">
              {/* Mobile Hamburger Button */}
              <button 
                onClick={() => setIsMobileDrawerOpen(true)}
                className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors lg:hidden"
                aria-label="Open menu"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              
              {/* Logo & Brand Title */}
              <div className="flex items-center space-x-2.5 cursor-pointer">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-md shadow-brand-highlight/10 shrink-0">
                  <HiAcademicCap className="w-5.5 h-5.5" />
                </div>
                <span className="font-bold text-slate-800 tracking-tight text-lg sm:text-xl">
                  CampusHub
                </span>
              </div>
            </div>

            {/* Right Desktop Controls & Mobile Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Desktop Categories Dropdown Toggle */}
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`hidden lg:flex items-center space-x-1.5 text-sm font-semibold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  isCategoriesOpen 
                    ? 'border-brand-accent bg-brand-light text-brand-accent'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                <span>Categories</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-250 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Notifications Center */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsProfileOpen(false);
                  }}
                  className={`p-2.5 rounded-xl border text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer relative ${
                    isNotificationsOpen ? 'bg-slate-50 text-slate-800 border-slate-300' : 'border-slate-200'
                  }`}
                  aria-label="Notifications"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                </button>

                {/* Notifications Dropdown menu */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-4 px-4 z-40 animate-slide-in text-center">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                      <span className="font-bold text-slate-800 text-sm">Notifications</span>
                      <span className="text-[10px] bg-brand-light text-brand-accent px-2 py-0.5 rounded-full font-semibold">Soon</span>
                    </div>
                    <div className="py-6 flex flex-col items-center justify-center text-slate-400">
                      <FiBell className="w-8 h-8 text-brand-highlight mb-2 animate-bounce-slow" />
                      <p className="text-xs font-semibold text-slate-500">Notifications coming soon</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">We will notify you about RSVP updates and announcement posts.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer ${
                    isProfileOpen ? 'bg-slate-50 text-slate-800 border-slate-300' : 'border-slate-200'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-highlight text-brand-primary flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
                  <FiChevronDown className="hidden sm:inline w-4 h-4 text-slate-400" />
                </button>

                {/* Profile dropdown content */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 px-3 z-40 animate-slide-in">
                    {/* Logged in User Meta */}
                    <div className="px-3.5 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-brand-highlight text-brand-primary flex items-center justify-center font-bold text-md shadow-inner shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate leading-tight">{user.name}</div>
                        <div className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-brand-light text-brand-accent border border-brand-highlight/20">
                          {user.role}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert('Profile page coming soon!')}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left font-medium"
                    >
                      <FiUser className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>

                    <hr className="my-1.5 border-slate-100" />

                    <button
                      onClick={onLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left font-medium"
                    >
                      <FiLogOut className="w-4 h-4 text-rose-400" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* SECONDARY CATEGORIES BAR (Smooth heights and transitions) */}
        <div 
          className={`hidden lg:block border-t border-slate-100 bg-slate-50/70 transition-all duration-300 ease-in-out ${
            isCategoriesOpen 
              ? 'max-h-16 opacity-100 py-2.5 visible' 
              : 'max-h-0 opacity-0 py-0 invisible overflow-hidden'
          }`}
        >
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-center space-x-3">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-accent border-brand-accent text-white shadow-md shadow-brand-accent/20 scale-[1.03]'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
