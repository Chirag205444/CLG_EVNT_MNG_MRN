import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users } from 'lucide-react';

const activitiesData = [
  {
    id: 1,
    title: 'AI & Machine Learning Workshop',
    description: 'Learn foundations of Neural Networks, Deep Learning, and build real-world models using PyTorch.',
    category: 'Workshop',
    venue: 'Seminar Hall B',
    eventDate: 'June 25',
    maxSeats: 100,
    registeredSeats: 55,
    createdBy: 'Computer Science Club',
    coordinatorOrg: 'IEEE Student Chapter',
    featured: true,
  },
  {
    id: 2,
    title: 'Google Offcampus Drive 2026',
    description: 'Exclusive placement drive for pre-final and final year students. Register to secure interview slots.',
    category: 'Placement',
    venue: 'Placement Cell Wing A',
    eventDate: 'June 28',
    maxSeats: 120,
    registeredSeats: 110,
    createdBy: 'Placement Cell',
    coordinatorOrg: 'Placement Division',
  },
  {
    id: 3,
    title: 'Campus CodeQuest Hackathon',
    description: '36-hour hackathon to solve real-world college problems. Exciting cash prizes and internship tracks.',
    category: 'Hackathon',
    venue: 'Main Auditorium',
    eventDate: 'July 02',
    maxSeats: 200,
    registeredSeats: 145,
    createdBy: 'Dev Club',
    coordinatorOrg: 'Computer Science Dept',
  },
  {
    id: 4,
    title: 'Fullstack React Architecture Masterclass',
    description: 'Dive deep into state management, performance optimization, React 19 features, and component design.',
    category: 'Workshop',
    venue: 'Lab 402',
    eventDate: 'June 30',
    maxSeats: 50,
    registeredSeats: 48,
    createdBy: 'WebDev Society',
    coordinatorOrg: 'ACM Student Chapter',
  },
  {
    id: 5,
    title: 'TEDx Campus Speaking Auditions',
    description: 'A platform to share your ideas. Auditions open for all branches. Prepare a 3-minute pitch.',
    category: 'Event',
    venue: 'OAT (Open Air Theatre)',
    eventDate: 'July 05',
    maxSeats: 150,
    registeredSeats: 45,
    createdBy: 'Cultural Committee',
    coordinatorOrg: 'Literary Society',
  },
  {
    id: 6,
    title: 'Summer Internship Orientation 2026',
    description: 'Essential guidelines for pre-final year students to secure paid summer internships and credits.',
    category: 'Announcement',
    venue: 'Srinivasa Ramanujan Hall',
    eventDate: 'June 26',
    maxSeats: 300,
    registeredSeats: 290,
    createdBy: 'Placement Cell Coordinator',
    coordinatorOrg: 'Placement Division',
  },
];

function HighlightsSection() {
  const [cardsToShow, setCardsToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(3); // Start at original index 0 (which is offset by 3 clones)
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Auto-slide states
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const containerRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  // Adjust display cards count responsively
  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else {
        setCardsToShow(3);
      }
    };
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  // Clone slides to support infinite loop.
  // We clone last 3 at start and first 3 at end.
  const clonedActivities = [
    ...activitiesData.slice(-3),
    ...activitiesData,
    ...activitiesData.slice(0, 3)
  ];

  // Auto-slide trigger
  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideIntervalRef.current = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds slide
  };

  const stopAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  };

  const resetInactivityTimer = () => {
    setIsAutoPlaying(false);
    stopAutoSlide();
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000); // 10 seconds inactivity timeout to resume auto-slide
  };

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoSlide();
    }
    return () => {
      stopAutoSlide();
    };
  }, [isAutoPlaying, currentIndex]);

  // Handle slide transitions
  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    // When reaching index 9 (clone of 0th element), jump instantly back to index 3 (original 0)
    if (currentIndex >= activitiesData.length + 3) {
      setTransitionEnabled(false);
      setCurrentIndex(3);
    }
    // When sliding left below 3, jump instantly back to index L+2
    else if (currentIndex < 3) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex + activitiesData.length);
    }
  };

  // Re-enable transition after state updates are applied
  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);

  // Drag handlers
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    resetInactivityTimer();
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const offset = clientX - startX;
    // Allow dragging but resist at the extreme points (cloning takes care of seamlessness)
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = containerWidth * 0.15; // 15% threshold to switch cards
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Event handlers bindings
  const onMouseDown = (e) => {
    if (e.button !== 0) return; // Only drag with left click
    if (e.target.closest('button') || e.target.closest('a')) return;
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    handleDragEnd();
  };

  const onTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Arrow click handlers
  const handlePrevClick = (e) => {
    e.stopPropagation();
    handlePrev();
    resetInactivityTimer();
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    handleNext();
    resetInactivityTimer();
  };

  // Card interaction handler
  const handleCardInteraction = () => {
    resetInactivityTimer();
  };

  // Helper to get category-specific colors
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Workshop':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Placement':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Hackathon':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Event':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Announcement':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  // Helper to alternate card background styles beautifully
  const getCardBgClass = (id, isFeatured) => {
    const mod = id % 3;
    let bg = '';
    let border = '';

    if (mod === 1) {
      bg = 'bg-brand-light/25';
      border = isFeatured ? 'border-amber-400/85' : 'border-brand-highlight/20';
    } else if (mod === 2) {
      bg = 'bg-brand-purple-light';
      border = isFeatured ? 'border-amber-400/85' : 'border-brand-purple-highlight/30';
    } else {
      bg = 'bg-emerald-50/30';
      border = isFeatured ? 'border-amber-400/85' : 'border-emerald-100/50';
    }

    return `${bg} ${border}`;
  };

  // Calculate track translation styling
  const getTranslateX = () => {
    const baseTranslate = -currentIndex * (100 / cardsToShow);
    const dragTranslate = containerWidth ? (dragOffset / containerWidth) * 100 : 0;
    return `translate3d(calc(${baseTranslate}% + ${dragTranslate}%), 0, 0)`;
  };

  const trackTransition = isDragging || !transitionEnabled
    ? 'none'
    : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)';

  return (
    <section
      className="space-y-6 select-none"
      onMouseEnter={() => {
        setIsAutoPlaying(false);
        stopAutoSlide();
        if (resumeTimeoutRef.current) {
          clearTimeout(resumeTimeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        resetInactivityTimer();
      }}
    >
      {/* Header Container */}
      <div className="flex items-end justify-between">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>🔥</span>
            <span>Campus Highlights This Week</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Explore recent activities, events, workshops, placements and opportunities happening across campus.
          </p>
        </div>

        {/* Navigation Arrows (Desktop overlay logic is integrated, but header placement is clean as fallback/alternative) */}
        <div className="hidden md:flex items-center gap-2 pb-0.5">
          <button
            onClick={handlePrevClick}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 shadow-xs text-slate-600 hover:text-brand-accent hover:border-brand-accent hover:shadow-sm transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Previous Highlights"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextClick}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 shadow-xs text-slate-600 hover:text-brand-accent hover:border-brand-accent hover:shadow-sm transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Next Highlights"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Track Viewport Container */}
      <div className="relative">
        <div
          ref={containerRef}
          className={`overflow-hidden rounded-2xl w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex"
            style={{
              transform: getTranslateX(),
              transition: trackTransition,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {clonedActivities.map((activity, index) => {
              // Highlight conditions: We highlight the activity if it's the primary "featured" item.
              const isFeatured = activity.featured;

              return (
                <div
                  key={`${activity.id}-${index}`}
                  className="w-full md:w-1/3 shrink-0 p-2.5 flex"
                  onClick={handleCardInteraction}
                >
                  <div
                    className={`border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between flex-1 relative ${getCardBgClass(activity.id, isFeatured)} ${isFeatured
                      ? 'ring-2 ring-amber-400/10 bg-gradient-to-b from-amber-500/[0.015] to-transparent'
                      : ''
                      }`}
                  >
                    {/* Featured Top Border Accent Line */}
                    {isFeatured && (
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-2xl" />
                    )}

                    <div>
                      {/* Top Row: Category Badge & Organization */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getCategoryStyles(activity.category)}`}>
                            {activity.category}
                          </span>
                          {isFeatured && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase flex items-center gap-0.5">
                              ✨ Featured
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 max-w-[120px] truncate" title={activity.coordinatorOrg}>
                          {activity.coordinatorOrg}
                        </span>
                      </div>

                      {/* Main Title & Description */}
                      <h3 className="font-bold text-slate-800 text-sm md:text-[15px] group-hover:text-brand-accent transition-colors leading-snug line-clamp-1 mb-1.5">
                        {activity.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed mb-5">
                        {activity.description}
                      </p>
                    </div>

                    {/* Bottom stats and footer info */}
                    <div className="space-y-4 pt-3.5 border-t border-slate-50">
                      {/* Information Row */}
                      <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{activity.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate" title={activity.venue}>{activity.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {activity.registeredSeats} / {activity.maxSeats} Seats
                          </span>
                        </div>
                      </div>

                      {/* Footer Row */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Posted by:</span>
                        <span className="font-semibold text-slate-600 truncate max-w-[160px]">
                          {activity.createdBy}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Small Touch Slide Indicator for Mobile Viewports */}
        <div className="flex md:hidden justify-center items-center gap-1.5 mt-3">
          {activitiesData.map((_, idx) => {
            // Find active dot index.
            // On mobile cardsToShow is 1, so indices are 3 to 3+L-1.
            // Map currentIndex to local index.
            const isActive = (currentIndex - 3 + activitiesData.length) % activitiesData.length === idx;
            return (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? 'w-4 bg-brand-accent' : 'w-1.5 bg-slate-200'
                  }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HighlightsSection;
