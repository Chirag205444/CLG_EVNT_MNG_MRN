import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Eye, 
  ShieldAlert, 
  Clock, 
  FileText, 
  ChevronDown 
} from 'lucide-react';

const getPreviewCategoryDetails = (category) => {
  switch (category?.toLowerCase()) {
    case 'event':
      return {
        label: 'Event',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-100',
        avatarClass: 'bg-blue-100 text-blue-700'
      };
    case 'placement':
      return {
        label: 'Placement',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        avatarClass: 'bg-emerald-100 text-emerald-700'
      };
    case 'workshop':
      return {
        label: 'Workshop',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-100',
        avatarClass: 'bg-purple-100 text-purple-700'
      };
    case 'hackathon':
      return {
        label: 'Hackathon',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        avatarClass: 'bg-indigo-100 text-indigo-700'
      };
    case 'announcement':
      return {
        label: 'Announcement',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
        avatarClass: 'bg-amber-100 text-amber-700'
      };
    case 'club_activity':
      return {
        label: 'Club Activity',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-100',
        avatarClass: 'bg-rose-100 text-rose-700'
      };
    default:
      return {
        label: category ? category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ') : 'Others',
        badgeClass: 'bg-slate-50 text-slate-700 border-slate-100',
        avatarClass: 'bg-slate-100 text-slate-700'
      };
  }
};

const getInitials = (name) => {
  if (!name) return 'CO';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return 'No date specified';
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
    return dateString;
  }
};

function ActivityForm({ user, onLogout }) {
  const navigate = useNavigate();

  // Controlled form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    venue: '',
    eventDate: '',
    registrationDeadline: '',
    maxParticipants: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState('Draft'); // 'Draft' or 'Published'

  // Restrict access for students (Student Role Check)
  const isCoordinator = user?.role === 'coordinator';

  // Real-time Date Picker Validation
  useEffect(() => {
    if (formData.eventDate && formData.registrationDeadline) {
      const eDate = new Date(formData.eventDate);
      const rDeadline = new Date(formData.registrationDeadline);
      if (rDeadline > eDate) {
        setError('Registration deadline should not be later than the event date.');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  }, [formData.eventDate, formData.registrationDeadline]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check basic details for saving draft
    if (!formData.title.trim()) {
      setError('Please provide at least a title to save the draft.');
      return;
    }

    if (formData.eventDate && formData.registrationDeadline) {
      const eDate = new Date(formData.eventDate);
      const rDeadline = new Date(formData.registrationDeadline);
      if (rDeadline > eDate) {
        setError('Registration deadline should not be later than the event date.');
        return;
      }
    }

    setIsDraftLoading(true);
    setCardStatus('Draft');

    setTimeout(() => {
      setIsDraftLoading(false);
      setSuccess('Draft saved successfully! You can review and edit it in your coordinator panel.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 85000 / 100); // ~850ms simulation
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate Required Fields
    if (!formData.title.trim()) {
      setError('Activity Title is required.');
      return;
    }
    if (!formData.category) {
      setError('Please select a Category.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required.');
      return;
    }

    // Validate Dates
    if (formData.eventDate && formData.registrationDeadline) {
      const eDate = new Date(formData.eventDate);
      const rDeadline = new Date(formData.registrationDeadline);
      if (rDeadline > eDate) {
        setError('Registration deadline should not be later than the event date.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts`,
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          venue: formData.venue || undefined,
          eventDate: formData.eventDate || undefined,
          maxParticipants: formData.maxParticipants || undefined,
          registrationDeadline: formData.registrationDeadline || undefined
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          },
          withCredentials: true
        }
      );

      setIsLoading(false);
      setCardStatus('Published');
      setSuccess('Activity Published Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Redirect to Dashboard home page
      setTimeout(() => {
        navigate('/');
      }, 1800);
    } catch (err) {
      console.error('Publish Error:', err);
      setIsLoading(false);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to publish activity. Please try again.';
      setError(errorMsg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 1. Access Denied UI if current role is Student
  if (!isCoordinator) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl p-8 shadow-xl text-center space-y-5 animate-modal-in">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Access Restricted</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                You are currently signed in as a <span className="font-semibold text-slate-700">{user?.role}</span>. Only coordinators have access permissions to create new activity posts.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-brand-primary/10 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 2. Coordinators Standard Form View
  const categoryDetails = getPreviewCategoryDetails(formData.category);

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
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-brand-accent transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Create Activity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Publish events, workshops, placements, announcements, and campus opportunities for students.
          </p>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Details (approx 58%) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Errors & Success Feedback banners */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-start space-x-2.5 text-rose-700 animate-slide-in">
                  <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0 text-rose-500" />
                  <span className="text-xs font-semibold leading-normal">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start space-x-2.5 text-emerald-700 animate-slide-in">
                  <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 shrink-0 text-emerald-600" />
                  <span className="text-xs font-semibold leading-normal">{success}</span>
                </div>
              )}

              <form className="space-y-6">
                
                {/* 1. Basic Information Section */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-brand-accent rounded-full"></span>
                      Basic Information
                    </h3>
                  </div>

                  {/* Activity Title */}
                  <div className="space-y-1.5">
                    <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Activity Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Preparing for Tech Placements in 2026"
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm shadow-xs"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        required
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="block w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm cursor-pointer appearance-none shadow-xs"
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="event">Event</option>
                        <option value="placement">Placement</option>
                        <option value="workshop">Workshop</option>
                        <option value="hackathon">Hackathon</option>
                        <option value="announcement">Announcement</option>
                        <option value="club_activity">Club Activity</option>
                        <option value="others">Others</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Description Textarea */}
                  <div className="space-y-1.5">
                    <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      required
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detail the event agenda, topics to cover, guidelines, and coordinate notes for student coordinators..."
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm shadow-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* 2. Event Information Section */}
                <div className="space-y-4 pt-2">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-brand-purple rounded-full"></span>
                      Event Information
                    </h3>
                  </div>

                  {/* Venue Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="venue" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Venue <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="venue"
                      type="text"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="e.g., Main Seminar Hall / Online via DevPortal"
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm shadow-xs"
                    />
                  </div>

                  {/* Event & Registration Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Event Date */}
                    <div className="space-y-1.5">
                      <label htmlFor="eventDate" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Event Date <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => handleInputChange('eventDate', e.target.value)}
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm shadow-xs cursor-pointer"
                      />
                    </div>

                    {/* Registration Deadline */}
                    <div className="space-y-1.5">
                      <label htmlFor="registrationDeadline" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Registration Deadline <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="registrationDeadline"
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm shadow-xs cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Participation Section */}
                <div className="space-y-4 pt-2">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full"></span>
                      Participation
                    </h3>
                  </div>

                  {/* Maximum Participants */}
                  <div className="space-y-1.5">
                    <label htmlFor="maxParticipants" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Maximum Participants <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                      placeholder="e.g., 100"
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm shadow-xs"
                    />
                    <p className="text-[10px] text-slate-400 font-semibold italic">
                      Leave empty if there is no participant limit.
                    </p>
                  </div>
                </div>

                {/* Submit Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isDraftLoading || isLoading}
                    onClick={handleSaveDraft}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs sm:text-sm font-extrabold rounded-xl hover:bg-slate-50 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {isDraftLoading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-400" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4.5 h-4.5 text-slate-400" />
                        <span>Save Draft</span>
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || isDraftLoading}
                    onClick={handlePublish}
                    className="flex-[2] py-2.5 bg-brand-accent text-white text-xs sm:text-sm font-extrabold rounded-xl hover:bg-brand-accent/95 hover:shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4.5 h-4.5" />
                        <span>Publish Activity</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Right Column: Live Preview Panel (approx 42%) */}
          <div className="lg:col-span-5 lg:sticky lg:top-[90px] h-fit self-start space-y-4">
            
            {/* Header decoration */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-brand-purple rounded-full"></span>
                Live Activity Preview
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Real-time
                </span>
              </div>
            </div>

            {/* Preview Card bounding box */}
            <div className="bg-slate-100/50 rounded-3xl p-5 border border-dashed border-slate-200 relative">
              
              {/* Draft Status Badge Overlay */}
              <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-200/60 text-slate-500 border border-slate-300/30">
                <FileText className="w-3 h-3" />
                <span>{cardStatus}</span>
              </div>

              {/* Event card layout copy */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between select-none">
                
                {/* Top Row: Avatar & Coordinator */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-9 h-9 rounded-full ${categoryDetails.avatarClass} flex items-center justify-center font-bold text-xs shrink-0 shadow-inner`}>
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.name || 'Current Coordinator'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Just now
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-2 flex-1 min-h-[90px]">
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug break-words">
                    {formData.title.trim() || 'Untitled Activity Title'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap break-words">
                    {formData.description.trim() || 'Provide a detailed description of the activity. Fill in the form fields on the left to see how your text, venue, date, and restrictions sync in this real-time layout.'}
                  </p>
                </div>

                {/* Footer Row */}
                <div className="mt-5 pt-3.5 border-t border-slate-50/80 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5 text-[10px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(formData.eventDate)}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{formData.venue.trim() || 'No venue set'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {formData.maxParticipants ? `Max: ${formData.maxParticipants} students` : 'No participant limit'}
                      </span>
                    </span>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border shrink-0 ${categoryDetails.badgeClass}`}>
                    {categoryDetails.label}
                  </span>
                </div>

              </div>

              {/* Deadline reminder for preview */}
              {formData.registrationDeadline && (
                <div className="mt-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Registration Deadline:</span>
                  </div>
                  <span className="text-slate-700 font-bold">{formatDate(formData.registrationDeadline)}</span>
                </div>
              )}

            </div>
          </div>

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

export default ActivityForm;
