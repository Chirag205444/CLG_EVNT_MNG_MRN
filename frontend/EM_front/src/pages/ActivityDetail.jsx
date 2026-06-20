import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    X,
    ChevronRight,
    Share2,
    Sparkles,
    Info,
    Building,
    User,
    ShieldCheck,
    PhoneCall
} from 'lucide-react';
import Navbar from '../component/Navbar';
import { mockActivities } from '../data/mockActivities';

// Formatting helpers
const formatDate = (dateStr) => {
    if (!dateStr) return 'To Be Decided';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
        return dateStr;
    }
};

const getDeadlineStatus = (deadlineStr) => {
    if (!deadlineStr) return { closed: false, label: 'Registration Open' };
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadline = new Date(deadlineStr);
        deadline.setHours(0, 0, 0, 0);

        if (deadline < today) {
            return { closed: true, label: 'Registration Closed' };
        }

        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return { closed: false, label: 'Ends Today' };
        }
        if (diffDays === 1) {
            return { closed: false, label: 'Ends Tomorrow' };
        }
        return { closed: false, label: `Ends in ${diffDays} days` };
    } catch {
        return { closed: false, label: 'Registration Open' };
    }
};

// Category configurations for styling accents (vibrant two-color combos)
const categoryConfigs = {
    workshop: {
        label: 'WORKSHOP',
        themeColor: 'purple',
        gradient: 'from-violet-600 to-fuchsia-600',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-100',
        accentText: 'text-purple-700',
        accentBg: 'bg-purple-50',
        pillBorder: 'border-purple-100',
        accentRing: 'focus:ring-purple-500/20',
        glowColor: 'bg-purple-400/20',
        avatarBg: 'bg-purple-100 text-purple-750',
    },
    placement: {
        label: 'PLACEMENT',
        themeColor: 'emerald',
        gradient: 'from-teal-500 to-emerald-600',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        accentText: 'text-emerald-700',
        accentBg: 'bg-emerald-50',
        pillBorder: 'border-emerald-100',
        accentRing: 'focus:ring-emerald-500/20',
        glowColor: 'bg-emerald-400/20',
        avatarBg: 'bg-emerald-100 text-emerald-750',
    },
    hackathon: {
        label: 'HACKATHON',
        themeColor: 'orange',
        gradient: 'from-orange-500 to-rose-550',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-100',
        accentText: 'text-orange-700',
        accentBg: 'bg-orange-50',
        pillBorder: 'border-orange-100',
        accentRing: 'focus:ring-orange-500/20',
        glowColor: 'bg-orange-400/20',
        avatarBg: 'bg-orange-100 text-orange-755',
    },
    announcement: {
        label: 'ANNOUNCEMENT',
        themeColor: 'blue',
        gradient: 'from-blue-600 to-indigo-650',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-100',
        accentText: 'text-blue-700',
        accentBg: 'bg-blue-50',
        pillBorder: 'border-blue-100',
        accentRing: 'focus:ring-blue-500/20',
        glowColor: 'bg-blue-400/20',
        avatarBg: 'bg-blue-100 text-blue-755',
    },
    club_activity: {
        label: 'CLUB ACTIVITY',
        themeColor: 'pink',
        gradient: 'from-pink-550 to-violet-650',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-100',
        accentText: 'text-rose-700',
        accentBg: 'bg-rose-50',
        pillBorder: 'border-rose-100',
        accentRing: 'focus:ring-pink-500/20',
        glowColor: 'bg-pink-400/20',
        avatarBg: 'bg-rose-100 text-rose-750',
    },
    event: {
        label: 'EVENT',
        themeColor: 'amber',
        gradient: 'from-amber-500 to-rose-500',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
        accentText: 'text-amber-705',
        accentBg: 'bg-amber-50',
        pillBorder: 'border-amber-100',
        accentRing: 'focus:ring-amber-500/20',
        glowColor: 'bg-amber-400/20',
        avatarBg: 'bg-amber-100 text-amber-755',
    },
    default: {
        label: 'OTHER',
        themeColor: 'brand',
        gradient: 'from-slate-700 to-slate-900',
        badgeClass: 'bg-slate-50 text-slate-700 border-slate-100',
        accentText: 'text-brand-accent',
        accentBg: 'bg-brand-light',
        pillBorder: 'border-brand-highlight/20',
        accentRing: 'focus:ring-brand-accent/20',
        glowColor: 'bg-brand-highlight/20',
        avatarBg: 'bg-brand-purple-light text-brand-purple',
    }
};

const getCategoryConfig = (category) => {
    if (!category) return categoryConfigs.default;
    const normalized = category.toLowerCase().replace(' ', '_');
    if (normalized === 'club_activity' || normalized === 'club_activities') {
        return categoryConfigs.club_activity;
    }
    return categoryConfigs[normalized] || categoryConfigs.default;
};

const getInitials = (name) => {
    if (!name) return 'CH';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

function ActivityDetail({ user, onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find current activity
    const activity = mockActivities.find((act) => act.id === parseInt(id, 10));

    // State management for registration simulation
    const [isRegistered, setIsRegistered] = useState(false);
    const [seatsCount, setSeatsCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalAction, setModalAction] = useState('register'); // 'register' or 'unregister'

    // Scroll to top on mount or when ID changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Sync registration state with localStorage
    useEffect(() => {
        if (!activity) return;
        try {
            const registeredIds = JSON.parse(localStorage.getItem('registered_activities') || '[]');
            const hasRegistered = registeredIds.includes(activity.id);
            setIsRegistered(hasRegistered);
            setSeatsCount(activity.registeredSeats + (hasRegistered ? 1 : 0));
        } catch {
            setSeatsCount(activity.registeredSeats);
        }
    }, [activity, id]);

    // Back action helper
    const handleBackToDashboard = () => {
        navigate('/');
    };

    if (!activity) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
                <Navbar user={user} onLogout={onLogout} />
                <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                    <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-modal-in">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Activity Not Found</h2>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                The activity you are looking for does not exist, has been removed, or you do not have permission to view it.
                            </p>
                        </div>
                        <button
                            onClick={handleBackToDashboard}
                            className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-98"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Dashboard</span>
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // Get active configurations
    const catConfig = getCategoryConfig(activity.category);
    const deadlineInfo = getDeadlineStatus(activity.registrationDeadline);
    const isDeadlinePassed = deadlineInfo.closed;
    const isFull = seatsCount >= (activity.maxParticipants || Infinity);

    // Determine button state
    let buttonState = 'register'; // 'register', 'registered', 'full', 'closed'
    if (isRegistered) {
        buttonState = 'registered';
    } else if (isDeadlinePassed) {
        buttonState = 'closed';
    } else if (isFull) {
        buttonState = 'full';
    }

    // Handle register clicked
    const handleRegisterClick = () => {
        setModalAction('register');
        setModalSuccess(false);
        setIsModalOpen(true);
    };

    // Handle unregister clicked
    const handleUnregisterClick = () => {
        setModalAction('unregister');
        setModalSuccess(false);
        setIsModalOpen(true);
    };

    // Handle confirm registration in modal
    const handleConfirmRegistration = () => {
        try {
            const registeredIds = JSON.parse(localStorage.getItem('registered_activities') || '[]');
            if (!registeredIds.includes(activity.id)) {
                registeredIds.push(activity.id);
                localStorage.setItem('registered_activities', JSON.stringify(registeredIds));
            }
            setIsRegistered(true);
            setSeatsCount(activity.registeredSeats + 1);
            setModalSuccess(true);
        } catch (e) {
            console.error(e);
            setIsRegistered(true);
            setModalSuccess(true);
        }
    };

    // Handle confirm unregistration in modal
    const handleConfirmUnregistration = () => {
        try {
            const registeredIds = JSON.parse(localStorage.getItem('registered_activities') || '[]');
            const filtered = registeredIds.filter(id => id !== activity.id);
            localStorage.setItem('registered_activities', JSON.stringify(filtered));
            setIsRegistered(false);
            setSeatsCount(activity.registeredSeats);
            setModalSuccess(true);
        } catch (e) {
            console.error(e);
            setIsRegistered(false);
            setModalSuccess(true);
        }
    };

    // Related activities selection (displays 3 items prioritizing same category, excluding current)
    const relatedActivities = mockActivities
        .filter((act) => act.id !== activity.id)
        .sort((a, b) => {
            if (a.category === activity.category && b.category !== activity.category) return -1;
            if (a.category !== activity.category && b.category === activity.category) return 1;
            return 0;
        })
        .slice(0, 3);

    // Helper styles for related cards
    const getCardBgClass = (cardId) => {
        const mod = cardId % 3;
        if (mod === 1) return 'bg-brand-light/25 border-brand-highlight/20';
        if (mod === 2) return 'bg-brand-purple-light border-brand-purple-highlight/30';
        return 'bg-emerald-50/30 border-emerald-100/50';
    };

    const getRelatedCategoryStyles = (categoryName) => {
        switch (categoryName?.toLowerCase()?.replace(' ', '_')) {
            case 'workshop':
                return 'bg-purple-50 text-purple-750 border-purple-100';
            case 'placement':
                return 'bg-emerald-50 text-emerald-750 border-emerald-100';
            case 'hackathon':
                return 'bg-indigo-50 text-indigo-755 border-indigo-100';
            case 'event':
                return 'bg-blue-50 text-blue-755 border-blue-100';
            case 'announcement':
                return 'bg-amber-50 text-amber-755 border-amber-100';
            default:
                return 'bg-rose-50 text-rose-755 border-rose-100';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
            {/* Top Navbar */}
            <Navbar
                user={user}
                onLogout={onLogout}
                selectedCategory={null}
                setSelectedCategory={(cat) => navigate('/', { state: { selectedCategory: cat } })}
                onCategoriesClick={() => navigate('/')}
                onBotIconClick={() => navigate('/')}
            />

            {/* Main Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-6 sm:py-8 space-y-6">

                {/* Navigation Breadcrumb */}
                <div>
                    <button
                        onClick={handleBackToDashboard}
                        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-brand-accent transition-colors cursor-pointer group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>

                {/* 1. Signature CampusHub Hero Card */}
                <section className={`relative rounded-3xl bg-gradient-to-br ${catConfig.gradient} text-white p-6 sm:p-8 md:p-9 shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_12px_30px_-10px_rgba(0,0,0,0.3)] border-2 border-white/20 sm:border-3 sm:border-white/15 overflow-hidden flex flex-col justify-end min-h-[160px] sm:min-h-[190px] group`}>
                    {/* Decorative mesh, diagonal stripe textures, and blurred glow circles */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.02)_75%,transparent_75%,transparent)] bg-[size:16px_16px] pointer-events-none" />
                    <div className="absolute -top-36 -left-36 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative z-10 space-y-3">
                        {/* Category Badge */}
                        <div>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest bg-white/15 text-white border border-white/10 backdrop-blur-md">
                                {catConfig.label}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight leading-tight max-w-4xl drop-shadow-sm">
                            {activity.title}
                        </h1>

                        {/* Organizer information brief */}
                        <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-white/90 font-medium">
                            <Building className="w-3.5 h-3.5 text-white/70" />
                            <span>Hosted by <span className="text-white font-bold">{activity.coordinatorOrg}</span></span>
                        </div>
                    </div>
                </section>

                {/* 2. Quick Information Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Date pill */}
                    <div className="bg-white border border-slate-100/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                        <div className={`w-10 h-10 rounded-xl ${catConfig.avatarBg} flex items-center justify-center shrink-0`}>
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Event Date</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight block truncate">{formatDate(activity.eventDate)}</span>
                        </div>
                    </div>

                    {/* Venue pill */}
                    <div className="bg-white border border-slate-100/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                        <div className={`w-10 h-10 rounded-xl ${catConfig.avatarBg} flex items-center justify-center shrink-0`}>
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Venue</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight block truncate" title={activity.venue}>{activity.venue || 'Online'}</span>
                        </div>
                    </div>

                    {/* Seats pill */}
                    <div className="bg-white border border-slate-100/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                        <div className={`w-10 h-10 rounded-xl ${catConfig.avatarBg} flex items-center justify-center shrink-0`}>
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Seats Information</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight block truncate">
                                {activity.maxParticipants ? `${seatsCount} / ${activity.maxParticipants} Filled` : `${seatsCount} Registered`}
                            </span>
                        </div>
                    </div>

                    {/* Deadline pill */}
                    <div className="bg-white border border-slate-100/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                        <div className={`w-10 h-10 rounded-xl ${catConfig.avatarBg} flex items-center justify-center shrink-0`}>
                            <Clock className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Registration Deadline</span>
                            <span className={`text-xs sm:text-sm font-bold leading-tight block truncate ${isDeadlinePassed ? 'text-rose-600' : 'text-slate-800'}`}>
                                {isDeadlinePassed ? 'Registration Closed' : deadlineInfo.label}
                            </span>
                        </div>
                    </div>

                </section>

                {/* 3. Main Content & Sidebar Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

                    {/* Main Content Area (70% - 7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* About Section */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3.5">
                                <span className={`w-1.5 h-4 ${catConfig.accentText} bg-current rounded-full`}></span>
                                About This Activity
                            </h2>
                            <div className="text-slate-655 text-xs sm:text-sm leading-relaxed max-w-3xl whitespace-pre-wrap">
                                {activity.description}
                            </div>
                        </div>

                        {/* Detailed specifications card */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3.5">
                                <span className={`w-1.5 h-4 ${catConfig.accentText} bg-current rounded-full`}></span>
                                Activity Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm">

                                <div className="flex flex-col py-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</span>
                                    <span className="font-semibold text-slate-700">{activity.category}</span>
                                </div>

                                <div className="flex flex-col py-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Venue</span>
                                    <span className="font-semibold text-slate-700">{activity.venue || 'Online / Remote'}</span>
                                </div>

                                <div className="flex flex-col py-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Event Date</span>
                                    <span className="font-semibold text-slate-700">{formatDate(activity.eventDate)}</span>
                                </div>

                                <div className="flex flex-col py-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registration Deadline</span>
                                    <span className="font-semibold text-slate-700">
                                        {activity.registrationDeadline ? formatDate(activity.registrationDeadline) : 'No Deadline'}
                                    </span>
                                </div>

                                <div className="flex flex-col py-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Maximum Participants</span>
                                    <span className="font-semibold text-slate-700">
                                        {activity.maxParticipants ? `${activity.maxParticipants} students` : 'Unlimited'}
                                    </span>
                                </div>

                                <div className="flex flex-col py-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Created Date</span>
                                    <span className="font-semibold text-slate-700">
                                        {activity.createdAt ? formatDate(activity.createdAt) : 'June 15, 2026'}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Organizer Card */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3.5">
                                <span className={`w-1.5 h-4 ${catConfig.accentText} bg-current rounded-full`}></span>
                                Organizer
                            </h2>

                            <div className="flex items-start space-x-4">
                                {/* Avatar */}
                                <div className={`w-12 h-12 rounded-2xl ${catConfig.avatarBg} flex items-center justify-center font-bold text-lg shadow-sm shrink-0`}>
                                    {getInitials(activity.coordinatorOrg)}
                                </div>

                                {/* Text details */}
                                <div className="space-y-1.5 min-w-0 flex-1">
                                    <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight truncate">
                                        {activity.coordinatorOrg}
                                    </h3>
                                    <div className="text-[10px] sm:text-xs text-slate-400 font-semibold space-y-1">
                                        <p className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                                            <span>Posted by: <span className="text-slate-650 font-bold">{activity.createdBy}</span></span>
                                        </p>
                                        <p className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                                            <span>Published: <span className="text-slate-650 font-bold">{activity.createdAt ? formatDate(activity.createdAt) : 'June 15, 2026'}</span></span>
                                        </p>
                                    </div>

                                    {/* Future Contact Placeholder */}
                                    <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center gap-2 text-[10px] text-slate-400 font-semibold italic">
                                        <PhoneCall className="w-3.5 h-3.5 text-slate-350" />
                                        <span>Contact information will be shared upon successful registration.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar (30% - 3 Cols) - Sticky Registration Card */}
                    <div className="lg:col-span-3 lg:sticky lg:top-[90px] h-fit self-start space-y-4">

                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-5">
                            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight border-b border-slate-50 pb-3 flex items-center justify-between">
                                <span>Registration</span>
                                <span className="flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isDeadlinePassed ? 'bg-rose-500' : 'bg-emerald-550'} animate-pulse`}></span>
                                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                                        {isDeadlinePassed ? 'Closed' : 'Active'}
                                    </span>
                                </span>
                            </h3>

                            {/* Status information */}
                            <div className="space-y-3.5 text-xs">

                                {/* Seats remaining */}
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="font-semibold text-slate-450">Seats Remaining:</span>
                                    <span className="font-bold text-slate-800 text-sm">
                                        {activity.maxParticipants ? (
                                            <span className={activity.maxParticipants - seatsCount <= 10 ? 'text-rose-650' : 'text-slate-800'}>
                                                {activity.maxParticipants - seatsCount} Seats
                                            </span>
                                        ) : (
                                            'Unlimited'
                                        )}
                                    </span>
                                </div>

                                {/* Deadline */}
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="font-semibold text-slate-450">Deadline Date:</span>
                                    <span className="font-bold text-slate-800">
                                        {activity.registrationDeadline ? formatDate(activity.registrationDeadline) : 'None'}
                                    </span>
                                </div>

                                {/* Registration status message */}
                                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-start gap-2.5">
                                    <Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status</span>
                                        <span className="text-[11px] text-slate-500 leading-normal block">
                                            {buttonState === 'registered' && 'You are officially registered!'}
                                            {buttonState === 'closed' && 'Registration window has expired.'}
                                            {buttonState === 'full' && 'All available registration slots are filled.'}
                                            {buttonState === 'register' && `RSVP open. ${deadlineInfo.label}`}
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Dynamic Registration Button */}
                            <div>
                                {buttonState === 'register' && (
                                    <button
                                        onClick={handleRegisterClick}
                                        className="w-full py-3 bg-brand-accent hover:bg-brand-accent/95 hover:shadow-md hover:-translate-y-0.5 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98 active:translate-y-0"
                                    >
                                        <Sparkles className="w-4 h-4 text-white" />
                                        <span>Register Now</span>
                                    </button>
                                )}

                                {buttonState === 'registered' && (
                                    <button
                                        onClick={handleUnregisterClick}
                                        className="w-full py-3 bg-emerald-600 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm group/btn border border-emerald-500/20 hover:border-rose-500/20 active:scale-98"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-white group-hover/btn:hidden shrink-0" />
                                        <span className="group-hover/btn:hidden">✓ Registered</span>
                                        <X className="w-4 h-4 text-white hidden group-hover/btn:block shrink-0" />
                                        <span className="hidden group-hover/btn:block">Unregister</span>
                                    </button>
                                )}

                                {buttonState === 'full' && (
                                    <button
                                        disabled
                                        className="w-full py-3 bg-slate-100 border border-slate-200 text-slate-400 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                                    >
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span>Event Full</span>
                                    </button>
                                )}

                                {buttonState === 'closed' && (
                                    <button
                                        disabled
                                        className="w-full py-3 bg-slate-100 border border-slate-200 text-slate-400 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                                    >
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>Registration Closed</span>
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* Quick reminder text */}
                        <p className="text-[10px] text-slate-400 font-semibold text-center italic">
                            * Successfully registering secures your credentials for the activity date.
                        </p>

                    </div>

                </section>

                {/* 4. Related Activities Section */}
                <section className="space-y-5 pt-8 border-t border-slate-100">
                    <div className="space-y-1">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                            You May Also Like
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium">
                            Explore similar announcements, workshops, placements, and club events.
                        </p>
                    </div>

                    {/* Horizontally scrollable row on mobile, standard grid on desktop */}
                    <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory scrollbar-none">

                        {relatedActivities.map((rel) => {
                            const relConfig = getCategoryConfig(rel.category);
                            return (
                                <div
                                    key={rel.id}
                                    onClick={() => {
                                        navigate(`/activity/${rel.id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`border rounded-2xl p-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between flex-1 relative snap-start min-w-[285px] md:min-w-0 flex-shrink-0 cursor-pointer ${getCardBgClass(rel.id)}`}
                                >
                                    <div>
                                        {/* Top Row: Badge & Creator Org */}
                                        <div className="flex items-center justify-between gap-2 mb-3.5">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getRelatedCategoryStyles(rel.category)}`}>
                                                {rel.category}
                                            </span>
                                            <span className="text-[9px] font-semibold text-slate-400 truncate max-w-[120px]" title={rel.coordinatorOrg}>
                                                {rel.coordinatorOrg}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-bold text-slate-800 text-sm group-hover:text-brand-accent transition-colors leading-snug line-clamp-1 mb-1.5">
                                            {rel.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-5">
                                            {rel.description}
                                        </p>
                                    </div>

                                    {/* Bottom details */}
                                    <div className="space-y-4 pt-3 border-t border-slate-100/30">
                                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{formatDate(rel.eventDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate" title={rel.venue}>{rel.venue || 'Online'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 mt-16 py-6">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
                    <p>© {new Date().getFullYear()} CampusHub Activity Board. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <a href="#about" className="hover:text-brand-accent transition-colors font-medium">About</a>
                        <a href="#help" className="hover:text-brand-accent transition-colors font-medium">Help Center</a>
                        <a href="#privacy" className="hover:text-brand-accent transition-colors font-medium">Privacy Policy</a>
                    </div>
                </div>
            </footer>

            {/* 5. Center-aligned Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    {/* Backdrop Blur overlay */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-backdrop-in cursor-pointer"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Container */}
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-modal-in p-6 sm:p-7 space-y-6">

                        {/* Header info / Success title */}
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
                                {modalSuccess
                                    ? (modalAction === 'register' ? 'Registration Confirmed' : 'Registration Cancelled')
                                    : (modalAction === 'register' ? 'Register For Activity' : 'Cancel Registration')
                                }
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <X className="w-4.5 h-4.5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-4">

                            {modalSuccess ? (
                                // Success State View
                                modalAction === 'register' ? (
                                    <div className="text-center py-6 space-y-4">
                                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100 animate-pulse">
                                            <CheckCircle2 className="w-9 h-9" />
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-base font-extrabold text-slate-850">✓ Successfully Registered</h4>
                                            <p className="text-xs text-slate-450 max-w-[280px] mx-auto leading-normal font-semibold">
                                                Your RSVP for this activity has been successfully recorded. See you there!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 space-y-4">
                                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-rose-100 animate-pulse">
                                            <X className="w-9 h-9" />
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-base font-extrabold text-slate-850">✓ Registration Cancelled</h4>
                                            <p className="text-xs text-slate-450 max-w-[280px] mx-auto leading-normal font-semibold">
                                                Your RSVP for this activity has been cancelled. Your seat is now free for others.
                                            </p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                // Confirmation State View
                                modalAction === 'register' ? (
                                    <div className="space-y-4">

                                        {/* Activity preview summary */}
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">

                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Activity Title</span>
                                                <span className="font-extrabold text-slate-850 leading-snug">{activity.title}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-slate-200/40">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Date</span>
                                                    <span className="font-bold text-slate-700 flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{formatDate(activity.eventDate)}</span>
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Venue</span>
                                                    <span className="font-bold text-slate-700 flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="truncate max-w-[110px]">{activity.venue || 'Online'}</span>
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Confirmation text info */}
                                        <div className="p-3 bg-brand-light/75 border border-brand-highlight/20 rounded-2xl flex items-start gap-2.5">
                                            <ShieldCheck className="w-4.5 h-4.5 mt-0.5 shrink-0 text-brand-accent" />
                                            <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                                                By confirming, you agree to attend this activity. Please note the venue and date. A reminder notification will be dispatched prior to the start.
                                            </p>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="space-y-4">

                                        {/* Activity preview summary */}
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">

                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Activity Title</span>
                                                <span className="font-extrabold text-slate-855 leading-snug">{activity.title}</span>
                                            </div>

                                            <p className="text-slate-500 font-semibold leading-normal pt-1.5 border-t border-slate-200/40">
                                                This action will release your seat. If you wish to re-register later, you can do so as long as seats remain.
                                            </p>

                                        </div>

                                        {/* Confirmation text info */}
                                        <div className="p-3 bg-rose-50 border border-rose-100/50 rounded-2xl flex items-start gap-2.5">
                                            <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0 text-rose-500" />
                                            <p className="text-[11px] text-rose-750 font-semibold leading-normal">
                                                Are you sure you want to cancel your registration for this activity?
                                            </p>
                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                        {/* Modal Actions */}
                        <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                            {modalSuccess ? (
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm active:scale-98"
                                >
                                    <span>Close</span>
                                </button>
                            ) : (
                                modalAction === 'register' ? (
                                    <>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-98"
                                        >
                                            <span>Cancel</span>
                                        </button>
                                        <button
                                            onClick={handleConfirmRegistration}
                                            className="flex-1 py-2.5 bg-brand-accent hover:bg-brand-accent/95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm active:scale-98"
                                        >
                                            <span>Confirm Registration</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-2.5 border border-slate-200 text-slate-550 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-98"
                                        >
                                            <span>Keep RSVP</span>
                                        </button>
                                        <button
                                            onClick={handleConfirmUnregistration}
                                            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm active:scale-98"
                                        >
                                            <span>Cancel Registration</span>
                                        </button>
                                    </>
                                )
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default ActivityDetail;
