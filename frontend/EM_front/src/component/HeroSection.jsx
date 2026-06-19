import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, GraduationCap, Users, User } from 'lucide-react';

function HeroSection({ user }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 'cultural',
      badge: 'CULTURAL ACTIVITIES',
      title: 'Cultural Activities & Festivals',
      description: 'Celebrate creative arts, music, dance, and cultural diversity on campus.',
      image: '/cultural.jpg',
      badgeBg: 'bg-brand-accent',
    },
    {
      id: 'events',
      badge: 'EVENTS',
      title: 'Campus Events & Seminars',
      description: 'Stay updated with guest lectures, tech talks, and annual symposiums.',
      image: '/events.jpg',
      badgeBg: 'bg-brand-accent',
    },
    {
      id: 'workshops',
      badge: 'WORKSHOPS',
      title: 'Hands-on Technical Workshops',
      description: 'Build real-world skills with expert-led coding and design bootcamps.',
      image: '/workshops.jpg',
      badgeBg: 'bg-brand-purple',
    },
    {
      id: 'placements',
      badge: 'PLACEMENTS',
      title: 'Career & Placement Drives',
      description: 'Connect with top recruiters and secure internships and full-time jobs.',
      image: '/placements.jpg',
      badgeBg: 'bg-brand-purple',
    },
    {
      id: 'hackathons',
      badge: 'HACKATHONS',
      title: 'Hackathons & Coding Arenas',
      description: 'Compete with peers, solve complex problems, and win exciting prizes.',
      image: '/hackathons.jpg',
      badgeBg: 'bg-brand-purple',
    },
    {
      id: 'clubs',
      badge: 'CLUBS',
      title: 'Student Clubs & Communities',
      description: 'Join hobby groups, technical societies, and enrich your campus life.',
      image: '/clubs.jpg',
      badgeBg: 'bg-brand-accent',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const renderWelcomeName = () => {
    if (!user || !user.name) return '';
    const parts = user.name.split(' ');
    if (parts.length > 1) {
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');
      return (
        <>
          {firstName} <span className="text-brand-accent">{lastName}</span>
        </>
      );
    }
    return <span className="text-brand-accent">{user.name}</span>;
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">

      {/* Left Column - approximately 40% width */}
      <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">

        {/* Card 1 — Welcome Card */}
        <div className="bg-purple-300 bg-gradient-to-br from-brand-light/70 via-white to-brand-light/30 border border-brand-highlight/25 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-md hover:shadow-sm transition-shadow flex-1 flex flex-col justify-center">
          <div className="absolute top-4 right-10 w-24 h-24 rounded-full bg-brand-accent/5 blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-brand-primary/5 blur-xl"></div>

          <div className="relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-brand-light border border-brand-highlight/40 text-brand-accent text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
              <span>Campus Life Portal</span>
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-2.5 leading-tight">
              Welcome Back,<br />
              {renderWelcomeName()}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Discover and engage in college events, placement opportunities, workshops, announcements and club activities all in one place.
            </p>
          </div>
        </div>

        {/* Card 2 — Campus Snapshot Card */}
        <div className="bg-brand-light/45 border border-slate-100 rounded-2xl p-5 shadow-md flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Campus Snapshot
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 mb-5">
              {/* Stat 1: Events */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-brand-accent shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 leading-tight">150+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Events</div>
                </div>
              </div>

              {/* Stat 2: Workshops */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-brand-purple shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 leading-tight">25+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workshops</div>
                </div>
              </div>

              {/* Stat 3: Clubs */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-brand-accent shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 leading-tight">12+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clubs</div>
                </div>
              </div>

              {/* Stat 4: Students */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-brand-purple shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 leading-tight">500+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students</div>
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={user?.role === 'student'}
            title={user?.role === 'student' ? 'Only co-ordinators can host events' : undefined}
            onClick={() => {
              if (user?.role !== 'student') {
                navigate('/create-activity');
              }
            }}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${user?.role === 'student'
              ? 'bg-white border border-slate-400 text-slate-400/80 cursor-not-allowed opacity-60'
              : 'bg-brand-accent hover:bg-brand-accent/90 text-white shadow-md shadow-brand-accent/15'
              }`}
          >
            <span>🚀</span>
            <span>Coordinate Event</span>
          </button>
        </div>

      </div>

      {/* Right Column - approximately 60% width (Image Carousel) */}
      <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center w-full">
        <div className="relative w-full lg:max-w-[520px] h-72 sm:h-96 lg:h-auto lg:min-h-full rounded-3xl overflow-hidden shadow-lg flex group">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none"></div>

              {/* Overlay text bottom left */}
              <div className="absolute bottom-5 left-5 right-5 z-20">
                <span className={`${slide.badgeBg} text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md inline-block`}>
                  {slide.badge}
                </span>
                <h2 className="text-white text-lg sm:text-xl font-bold mt-2">
                  {slide.title}
                </h2>
                <p className="text-white/85 text-[11px] sm:text-xs mt-1.5 max-w-md leading-relaxed font-light">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}

          {/* Indicator Capsule top right */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center space-x-1.5 z-20">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              const activeColor = slides[activeIndex].badgeBg === 'bg-brand-purple' ? 'bg-brand-purple' : 'bg-brand-accent';
              return (
                <span
                  key={index}
                  className={`transition-all duration-300 rounded-full h-1 ${isActive ? `w-4 ${activeColor}` : 'w-1 bg-white/50'
                    }`}
                />
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}

export default HeroSection;
