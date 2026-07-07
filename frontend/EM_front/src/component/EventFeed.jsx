import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Send, X, Sparkles, Bot, Calendar, MapPin, Loader2 } from 'lucide-react';
import { mockActivities } from '../data/mockActivities';

const formatLongDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
    }
    return dateStr;
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

// Helper styles matching HighlightsSection
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

const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between animate-pulse">
    {/* Top Row: Avatar & Coordinator */}
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0"></div>
      <div className="space-y-2 flex-1">
        <div className="h-3.5 bg-slate-200 rounded-md w-1/3"></div>
        <div className="h-2.5 bg-slate-200 rounded-md w-1/4"></div>
      </div>
    </div>

    {/* Body */}
    <div className="space-y-2 flex-1">
      <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
      <div className="h-3 bg-slate-200 rounded-md w-full"></div>
      <div className="h-3 bg-slate-200 rounded-md w-5/6"></div>
    </div>

    {/* Footer Row */}
    <div className="mt-5 pt-3.5 border-t border-slate-50/80 flex items-center justify-between">
      <div className="flex items-center space-x-4 w-1/2">
        <div className="h-3 bg-slate-200 rounded-md w-1/3"></div>
        <div className="h-3 bg-slate-200 rounded-md w-1/3"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded-md w-16"></div>
    </div>
  </div>
);

const SUGGESTED_QUESTIONS = [
  { label: '📅 Events Today', text: 'What events are happening today?' },
  { label: '🎓 Upcoming Workshops', text: 'Upcoming workshops' },
  { label: '💼 Placement Drives', text: 'Placement drives this week' },
  { label: '🏆 Upcoming Hackathons', text: 'Upcoming hackathons' },
  { label: '📢 Latest Announcements', text: 'Latest announcements' },
  { label: '📝 My Registrations', text: 'Show my registrations' },
  { label: '🏢 IEEE Student Chapter', text: 'Events by IEEE Student Chapter' },
  { label: '⏳ Deadlines', text: 'Registration deadlines this week' }
];

const parseMarkdown = (text) => {
  if (!text) return '';
  
  // Escape HTML to prevent XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Bullet points: lines starting with '* ' or '- '
  const lines = html.split('\n');
  let inList = false;
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const content = trimmed.substring(2);
      if (!inList) {
        inList = true;
        return `<ul class="list-disc pl-5 space-y-1 my-1"><li>${content}</li>`;
      }
      return `<li>${content}</li>`;
    } else {
      if (inList) {
        inList = false;
        return `</ul>${line}<br />`;
      }
      return line + '<br />';
    }
  });
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  return processedLines.join('');
};

const EventFeed = React.forwardRef(({ selectedCategory }, ref) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your CampusHub AI Assistant. 🤖 How can I help you today? Ask me anything about events, workshops, placements, or club deadlines.'
    }
  ]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const messagesEndRef = useRef(null);

  // Pagination & Infinite Scroll States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const loaderRef = useRef(null);

  const fetchFeed = async (pageNumber, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    setIsError(false);

    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user?.token;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts?page=${pageNumber}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data && response.data.success) {
        const rawData = response.data.data;
        const posts = Array.isArray(rawData) ? rawData : (rawData?.posts || []);
        const backendHasMore = Array.isArray(rawData) ? false : (rawData?.hasMore ?? false);

        setActivities((prev) => {
          if (isInitial) {
            return posts;
          } else {
            const existingIds = new Set(prev.map((p) => p._id || p.id));
            const newPosts = posts.filter((p) => !existingIds.has(p._id || p.id));
            return [...prev, ...newPosts];
          }
        });

        setPage(pageNumber);
        setHasMore(backendHasMore);
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error('Fetch Feed Error:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchFeed(1, true);
  }, []);

  useEffect(() => {
    if (!hasMore || isFetchingMore || isLoading || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchFeed(page + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isFetchingMore, isLoading, isError, page]);

  const handleRetry = () => {
    if (activities.length === 0) {
      fetchFeed(1, true);
    } else {
      fetchFeed(page + 1, false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIModalOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isAiTyping, isAIModalOpen]);

  useEffect(() => {
    // Open for 3 seconds, then close for 4 seconds (total 7 seconds cycle)
    const runCycle = () => {
      setIsTooltipVisible(true);
      const closeTimer = setTimeout(() => {
        setIsTooltipVisible(false);
      }, 3000);
      return closeTimer;
    };

    let closeTimer;
    const initialTimer = setTimeout(() => {
      closeTimer = runCycle();
    }, 2500);

    const interval = setInterval(() => {
      closeTimer = runCycle();
    }, 7000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(closeTimer);
      clearInterval(interval);
    };
  }, []);

  const submitQuery = async (questionText) => {
    if (!questionText.trim() || isAiTyping) return;

    const userMessage = questionText.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setIsAiTyping(true);

    try {
      const userObj = JSON.parse(localStorage.getItem('user') || 'null');
      const token = userObj?.token;
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/chat`,
        { question: userMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data && response.data.success) {
        setChatMessages((prev) => [...prev, { sender: 'bot', text: response.data.data }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: "Unable to generate an AI response right now. Please try again later." }
        ]);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      let errorMsg = "Unable to generate an AI response right now. Please try again later.";
      if (err.response?.data?.message?.includes("I couldn't find any matching events in CampusHub") || 
          err.response?.data?.error?.includes("I couldn't find any matching events in CampusHub") ||
          err.response?.data?.message?.includes("matching records") ||
          err.response?.data?.error?.includes("matching records")) {
        errorMsg = "I couldn't find any matching events in CampusHub.";
      }
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: errorMsg }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;
    submitQuery(chatInput);
  };

  const handleSuggestionClick = (questionText) => {
    if (isAiTyping) return;
    submitQuery(questionText);
  };

  // Filter activities based on search query and category selected from navbar
  const filteredActivities = activities.filter((activity) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      activity.title?.toLowerCase().includes(query) ||
      activity.description?.toLowerCase().includes(query) ||
      activity.category?.toLowerCase().includes(query) ||
      activity.venue?.toLowerCase().includes(query) ||
      (typeof activity.createdBy === 'object'
        ? activity.createdBy?.name?.toLowerCase().includes(query)
        : activity.createdBy?.toLowerCase().includes(query))
    );

    if (!selectedCategory) return matchesSearch;

    const normalizedSelected = selectedCategory.toLowerCase();
    const normalizedActivity = activity.category?.toLowerCase() || '';

    // Match categories like 'Events' to 'Event', 'Placements' to 'Placement', etc.
    const matchesCategory =
      normalizedActivity === normalizedSelected ||
      normalizedSelected.startsWith(normalizedActivity) ||
      normalizedActivity.startsWith(normalizedSelected) ||
      (normalizedSelected === 'club activities' && normalizedActivity === 'club_activity') ||
      (normalizedSelected === 'club activities' && normalizedActivity === 'event');

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* EVENT FEED & AI ASSISTANT SECTION */}
      <div ref={ref} className="space-y-6 scroll-mt-20">
        {/* Event Feed Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200/80 gap-3">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Event Feed
          </h2>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-[350px] lg:w-[400px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, workshops, placements..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Main Layout Columns: Feed & AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Feed Column (70%) */}
          <div className="lg:col-span-7 space-y-4">
            {isLoading ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center text-slate-500 shadow-xs flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
                <p className="text-sm font-semibold text-slate-600">Loading activities...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center text-slate-500 shadow-xs">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-bold text-sm text-slate-800">No activities found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[300px] mx-auto">
                  Try searching for other terms or select a different category filter.
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => {
                const creatorName = activity.createdBy?.name || activity.createdBy || 'Coordinator';
                const relativeTime = formatTimeAgo(activity.createdAt);
                const cleanEventDate = activity.eventDate ? activity.eventDate.split('T')[0] : '';
                const formattedEventDate = formatLongDate(cleanEventDate) || 'To Be Decided';
                const venue = activity.venue || 'Online';

                return (
                  <div 
                    key={activity._id || activity.id} 
                    onClick={() => navigate(`/activity/${activity._id || activity.id}`)}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Top Row: Avatar & Coordinator */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-9 h-9 rounded-full ${getAvatarBgClass(activity.category)} flex items-center justify-center font-bold text-xs shrink-0 shadow-inner`}>
                        {getInitials(creatorName)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                          {creatorName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {relativeTime}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-extrabold text-slate-800 text-sm sm:text-base hover:text-brand-accent transition-colors leading-snug">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="mt-4 pt-3.5 border-t border-slate-50/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3.5 text-[10px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formattedEventDate}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{venue}</span>
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getCategoryStyles(activity.category)}`}>
                        {activity.category}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Skeleton cards for loading more */}
            {isFetchingMore && (
              <div className="space-y-4 mt-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}

            {/* Error Retry Message */}
            {isError && (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs mt-4">
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-2">Unable to load more events.</p>
                <button
                  onClick={handleRetry}
                  type="button"
                  className="px-4 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-accent transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* End of Feed Message */}
            {!hasMore && activities.length > 0 && (
              <div className="text-center py-6 text-slate-500 text-xs sm:text-sm font-semibold border-t border-slate-100 mt-4">
                You've reached the end.<br />
                No more activities to display.
              </div>
            )}

            {/* Invisible observer element */}
            {hasMore && !isFetchingMore && !isLoading && !isError && (
              <div ref={loaderRef} className="h-2 w-full" />
            )}
          </div>

          {/* AI Column (30%) - Sticky Scroll */}
          <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-[90px] h-fit self-start">
            <div className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              {/* Background accent decorations */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-purple-light rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 opacity-60 pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-brand-light rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 opacity-60 pointer-events-none" />
              
              <div className="relative space-y-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    🤖
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
                    CampusHub AI Assistant
                  </h3>
                </div>
                
                {/* Animated Realistic 3D-feel Claymorphic Bot SVG */}
                <div className="flex justify-center -mt-2 pb-1.5">
                  <svg 
                    viewBox="0 0 120 120" 
                    className="w-24 h-24 select-none pointer-events-none animate-bot-float"
                  >
                    <defs>
                      <radialGradient id="clay-body" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="40%" stopColor="#f1f5f9" />
                        <stop offset="100%" stopColor="#cbd5e1" />
                      </radialGradient>
                      <radialGradient id="clay-accent" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#ffedd5" />
                        <stop offset="35%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </radialGradient>
                      <radialGradient id="clay-joint" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#475569" />
                      </radialGradient>
                      <linearGradient id="visor-glass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#1e293b" />
                      </linearGradient>
                      <linearGradient id="visor-glare" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                        <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                      <radialGradient id="eye-glow" cx="45%" cy="45%" r="55%">
                        <stop offset="0%" stopColor="#67e8f9" />
                        <stop offset="60%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" />
                      </radialGradient>
                      <radialGradient id="floor-shadow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#3d3735" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#3d3735" stopOpacity="0" />
                      </radialGradient>
                      <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.12" />
                      </filter>
                    </defs>
                    <ellipse cx="60" cy="115" rx="18" ry="3" fill="url(#floor-shadow)" />
                    <g className="animate-bot-left-arm" style={{ transformOrigin: '84px 74px' }}>
                      <circle cx="84" cy="74" r="4.5" fill="url(#clay-joint)" />
                      <rect x="81" y="76" width="10" height="22" rx="5" fill="url(#clay-accent)" filter="url(#soft-shadow)" />
                      <circle cx="86" cy="100" r="5.5" fill="url(#clay-body)" filter="url(#soft-shadow)" />
                    </g>
                    <rect x="55" y="66" width="10" height="8" rx="2" fill="url(#clay-joint)" filter="url(#soft-shadow)" />
                    <rect x="40" y="70" width="40" height="36" rx="12" fill="url(#clay-body)" filter="url(#soft-shadow)" />
                    <circle cx="60" cy="88" r="8" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
                    <circle cx="60" cy="88" r="6" fill="#f97316" className="animate-ping" style={{ animationDuration: '3.5s' }} />
                    <circle cx="60" cy="88" r="4.5" fill="url(#clay-accent)" />
                    <g className="animate-bot-wave" style={{ transformOrigin: '36px 74px' }}>
                      <circle cx="36" cy="74" r="4.5" fill="url(#clay-joint)" />
                      <rect x="27" y="40" width="10" height="28" rx="5" fill="url(#clay-accent)" filter="url(#soft-shadow)" />
                      <circle cx="32" cy="37" r="6" fill="url(#clay-body)" filter="url(#soft-shadow)" />
                      <path d="M26,33 A7,7 0 0,1 38,33" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    <g className="animate-bot-head" style={{ transformOrigin: '60px 68px' }}>
                      <rect x="58" y="28" width="4" height="10" fill="url(#clay-joint)" />
                      <circle cx="60" cy="24" r="4" fill="#f97316" className="animate-pulse" />
                      <rect x="31" y="46" width="3" height="10" rx="1.5" fill="url(#clay-joint)" />
                      <rect x="86" y="46" width="3" height="10" rx="1.5" fill="url(#clay-joint)" />
                      <rect x="33" y="36" width="54" height="34" rx="15" fill="url(#clay-body)" filter="url(#soft-shadow)" />
                      <rect x="40" y="41" width="40" height="23" rx="8" fill="url(#visor-glass)" />
                      <ellipse cx="49" cy="52.5" rx="3" ry="4.5" fill="url(#eye-glow)" className="animate-bot-blink" style={{ transformOrigin: '49px 52.5px' }} />
                      <ellipse cx="71" cy="52.5" rx="3" ry="4.5" fill="url(#eye-glow)" className="animate-bot-blink" style={{ transformOrigin: '71px 52.5px' }} />
                      <rect x="40" y="41" width="40" height="23" rx="8" fill="url(#visor-glare)" style={{ pointerEvents: 'none' }} />
                    </g>
                  </svg>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ask questions about events, workshops, placements, clubs, deadlines and campus opportunities.
                </p>
                
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="w-full py-2.5 bg-brand-primary text-white text-xs font-extrabold rounded-xl hover:bg-brand-accent hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Ask Your Agent</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) for Mobile AI Assistant */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden flex items-center space-x-2">
        {/* Tooltip Card */}
        <div
          className={`bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-1.5 transition-all duration-500 ease-out transform origin-right ${
            isTooltipVisible
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 translate-x-4 scale-90 pointer-events-none'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">AI Assist</span>
        </div>

        {/* FAB Button */}
        <button
          onClick={() => {
            setIsAIModalOpen(true);
            setIsTooltipVisible(false);
          }}
          className="relative w-14 h-14 bg-gradient-to-tr from-brand-primary to-brand-accent text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer border border-brand-highlight/25 shrink-0 overflow-hidden"
          aria-label="Open AI Assistant"
          title="Open AI Assistant"
        >
          {/* Smooth purple overlay on tooltip open */}
          <div
            className={`absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-purple transition-opacity duration-700 ease-in-out ${
              isTooltipVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <Bot className="relative w-6 h-6 text-white z-10" />
        </button>
      </div>

      {/* AI Modal (UI Only) */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-backdrop-in cursor-pointer"
            onClick={() => setIsAIModalOpen(false)}
          />
          
          {/* Modal Box */}
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative z-10 max-h-[80vh] animate-modal-in">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent text-white flex items-center justify-center font-bold text-sm">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">🤖 CampusHub AI Assistant</h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-snug">
                    Ask anything about campus events, placements, workshops, registrations and opportunities.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsAIModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Suggested Questions Chips */}
            <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-2 max-h-[120px] overflow-y-auto shrink-0">
              {SUGGESTED_QUESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(chip.text)}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-brand-accent hover:bg-slate-50 text-[10px] sm:text-xs font-semibold text-slate-600 rounded-lg transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  {chip.label}
                </button>
              ))}
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px] bg-slate-50/30">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-primary text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 shadow-xs rounded-tl-none'
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.sender === 'user' ? msg.text : parseMarkdown(msg.text) }}
                  />
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-500 border border-slate-100 shadow-xs rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">CampusHub AI is thinking...</span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask something about CampusHub..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-accent focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isAiTyping}
                className="px-4 py-2 bg-brand-accent text-white rounded-xl hover:bg-brand-accent/95 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0 shadow-sm text-xs sm:text-sm font-semibold gap-1.5"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsAIModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all cursor-pointer active:scale-95 shrink-0 text-xs sm:text-sm font-semibold"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

EventFeed.displayName = 'EventFeed';

export default EventFeed;
