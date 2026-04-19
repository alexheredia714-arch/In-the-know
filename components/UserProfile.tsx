import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Star, Briefcase, Heart, Plus, X, MessageSquareQuote, Clock, UserCheck, Wrench, ShieldCheck, Trophy, CheckCircle2, DollarSign, RefreshCw, Loader2, MessageSquare } from 'lucide-react';
import { JobCard } from './JobCard';
import { JobPost, UserProfile as UserProfileType, Review } from '../types';
import { ReviewForm } from './ReviewForm';

interface UserProfileProps {
    onContact?: (job: JobPost) => void;
    user: UserProfileType;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onContact, user }) => {
  const [activeTab, setActiveTab] = useState<'posted' | 'saved' | 'reviews'>('posted');
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [myJobs, setMyJobs] = useState<JobPost[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobPost[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [reviewJob, setReviewJob] = useState<JobPost | null>(null);

  const hasReview = (jobId: string) => {
    return myReviews.some(r => r.jobId === jobId);
  };

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [jobsRes, reviewsRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/reviews')
      ]);
      
      if (jobsRes.ok && reviewsRes.ok) {
        const allJobs = await jobsRes.json();
        const allReviews = await reviewsRes.json();
        
        // In this demo, we assume "my jobs" are ones where authorName is user.name
        setMyJobs(allJobs.filter((j: any) => j.authorName === 'Sarah J.' || j.authorName === user.name));
        setSavedJobs(allJobs.slice(0, 1)); // Mocking some saved jobs
        setMyReviews(allReviews);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`${size} ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="h-40 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="px-6 pb-6">
          <div className="relative flex items-end -mt-16 mb-4">
            <div className="p-2 bg-white rounded-full shadow-md">
                <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-28 h-28 rounded-full bg-slate-100 object-cover border-2 border-slate-50"
                />
            </div>
            <div className="ml-5 mb-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex items-center text-slate-500 text-sm font-medium mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                    {user.location}
                </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between">
              <div className="max-w-3xl w-full">
                  <p className="text-slate-600 leading-relaxed text-lg mb-6">{user.bio}</p>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-8 border-y border-slate-50 py-4">
                      <div className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-slate-400" />
                          <span className="font-semibold text-slate-700 mr-1">Joined:</span> {user.memberSince}
                      </div>
                      <div className="flex items-center">
                           <Trophy className="w-5 h-5 mr-2 text-emerald-500" />
                           <span className="font-semibold text-slate-700 mr-1">Rating:</span> {user.stats.rating} / 5.0
                      </div>
                      <div className="flex items-center">
                           <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                           <span className="font-semibold text-slate-700 mr-1">Completed:</span> {user.stats.jobsCompleted}
                      </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Professional Skills</h3>
                    <div className="flex flex-wrap gap-2 items-center">
                        {skills.map(skill => (
                            <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200 group hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors">
                                {skill}
                                <button 
                                  onClick={() => removeSkill(skill)} 
                                  className="ml-2 text-slate-400 hover:text-emerald-600 focus:outline-none transition-colors"
                                  title="Remove skill"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                        <form onSubmit={handleAddSkill} className="inline-flex items-center ml-2">
                            <input 
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add skill..."
                                className="w-32 text-sm border-b-2 border-slate-200 px-2 py-1 focus:outline-none focus:border-emerald-500 bg-transparent transition-all placeholder:text-slate-400"
                            />
                            <button 
                                type="submit" 
                                disabled={!newSkill.trim()}
                                className="ml-1 text-emerald-600 hover:text-emerald-700 disabled:opacity-0 transition-opacity"
                                title="Add skill"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                  </div>
              </div>
              <div className="flex gap-3 flex-shrink-0 pt-2">
                  <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all h-fit">
                      Edit Profile
                  </button>
              </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8 sticky top-16 bg-slate-50/95 backdrop-blur-sm z-30">
        <nav className="-mb-px flex space-x-12 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('posted')}
            className={`${
              activeTab === 'posted'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-all`}
          >
            <Briefcase className={`w-4 h-4 mr-2 ${activeTab === 'posted' ? 'animate-pulse' : ''}`} />
            Posted Jobs
            <span className="ml-2 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] text-slate-600 font-bold">{myJobs.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`${
              activeTab === 'saved'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-all`}
          >
            <Heart className={`w-4 h-4 mr-2 ${activeTab === 'saved' ? 'animate-pulse' : ''}`} />
            Saved & Applied
            <span className="ml-2 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] text-slate-600 font-bold">{savedJobs.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`${
              activeTab === 'reviews'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-all`}
          >
            <MessageSquareQuote className={`w-4 h-4 mr-2 ${activeTab === 'reviews' ? 'animate-pulse' : ''}`} />
            Reference Sheet
            <span className="ml-2 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] text-slate-600 font-bold">{myReviews.length}</span>
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                <p>Loading your profile history...</p>
            </div>
        ) : (
            <>
                {activeTab === 'posted' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                        {myJobs.length > 0 ? (
                            myJobs.map(job => (
                                <div key={job.id} className="relative group">
                                    <JobCard job={job} onContact={onContact} />
                                    {job.status === 'active' && (
                                        <div className="mt-2 flex justify-end gap-2 px-4 pb-4 bg-white border-x border-b border-slate-200 rounded-b-xl -mt-4 pt-4 shadow-sm">
                                            <button 
                                                onClick={async () => {
                                                    await fetch(`/api/jobs/${job.id}`, {
                                                        method: 'PATCH',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ status: 'completed' })
                                                    });
                                                    fetchData();
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                Mark Finished
                                            </button>
                                            <button 
                                                onClick={() => setReviewJob(job)}
                                                className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Complete & Review
                                            </button>
                                        </div>
                                    )}
                                    {job.status === 'completed' && (
                                        <div className="mt-2 flex justify-end px-4 pb-4 bg-white border-x border-b border-slate-200 rounded-b-xl -mt-4 pt-4 shadow-sm">
                                            {hasReview(job.id) ? (
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                    Closed & Reviewed
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setReviewJob(job)}
                                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    Leave Feedback
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                                <Briefcase className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-lg">You haven't posted any jobs yet.</p>
                                <button className="mt-4 text-emerald-600 font-bold hover:underline">Start your first project</button>
                            </div>
                        )}
                    </div>
                )}
            </>
        )}

        {activeTab === 'saved' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                {savedJobs.length > 0 ? (
                    savedJobs.map(job => <JobCard key={job.id} job={job} onContact={onContact} />)
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                        <Heart className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-lg">You haven't saved any jobs yet.</p>
                        <button className="mt-4 text-emerald-600 font-bold hover:underline">Browse the job board</button>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'reviews' && !isLoadingData && (
            <div className="space-y-8 animate-fade-in">
                 {/* Reference Header Stats */}
                 <div className="bg-emerald-900 text-white rounded-xl p-8 shadow-xl flex flex-col md:flex-row items-center gap-8 border-b-4 border-emerald-700">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Verified Professional History</h2>
                        <p className="text-emerald-100 opacity-80 max-w-md">Actual feedback from verified clients on the KnowApp platform.</p>
                    </div>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                        <div className="bg-emerald-800/50 p-4 rounded-lg text-center border border-emerald-700/50">
                            <div className="text-2xl font-black">100%</div>
                            <div className="text-[10px] uppercase font-bold text-emerald-300">Punctual</div>
                        </div>
                        <div className="bg-emerald-800/50 p-4 rounded-lg text-center border border-emerald-700/50">
                            <div className="text-2xl font-black">98%</div>
                            <div className="text-[10px] uppercase font-bold text-emerald-300">Professional</div>
                        </div>
                        <div className="bg-emerald-800/50 p-4 rounded-lg text-center border border-emerald-700/50">
                            <div className="text-2xl font-black">{user.stats.jobsCompleted + myReviews.length - 1}</div>
                            <div className="text-[10px] uppercase font-bold text-emerald-300">Jobs Done</div>
                        </div>
                        <div className="bg-emerald-800/50 p-4 rounded-lg text-center border border-emerald-700/50">
                            <div className="text-2xl font-black">{user.stats.rating}</div>
                            <div className="text-[10px] uppercase font-bold text-emerald-300">Avg Rating</div>
                        </div>
                    </div>
                 </div>

                 {/* Individual Reviews */}
                 <div className="space-y-6">
                    {myReviews && myReviews.length > 0 ? (
                        myReviews.map(review => (
                            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:border-emerald-200 hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row">
                                    {/* Left Sidebar: Reviewer Info */}
                                    <div className="bg-slate-50/50 p-6 flex md:flex-col items-center gap-3 md:w-48 border-b md:border-b-0 md:border-r border-slate-100">
                                        <div className="relative">
                                            <img 
                                                src={review.reviewerAvatar} 
                                                alt={review.reviewerName} 
                                                className="w-16 h-16 rounded-full bg-white object-cover border-2 border-white shadow-sm" 
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                                                <div className="bg-emerald-500 w-4 h-4 rounded-full flex items-center justify-center">
                                                    <CheckCheck className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:text-center">
                                            <div className="text-sm font-bold text-slate-900">{review.reviewerName}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">Verified Client</div>
                                        </div>
                                    </div>
                                    
                                    {/* Main Review Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                                                        {review.jobTitle}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(review.rating, "w-5 h-5")}
                                                        <span className="text-sm font-black text-slate-900">{review.rating.toFixed(1)}</span>
                                                    </div>
                                                    
                                                    {/* Deal Transparency Badge */}
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors">
                                                        {review.dealType === 'Barter/Trade' ? (
                                                            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                                                        ) : (
                                                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                                        )}
                                                        <span className="text-[10px] font-black uppercase tracking-tight text-slate-600 group-hover:text-amber-800">
                                                            {review.dealType === 'Barter/Trade' ? 'Trade' : 'Paid'}: {review.dealType === 'Barter/Trade' ? review.dealValue : review.dealValue}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold text-slate-400 mt-2 sm:mt-0 bg-slate-100 px-2 py-1 rounded">
                                                {new Date(review.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                        
                                        <div className="relative mb-6">
                                            <MessageSquare className="absolute -top-1 -left-1 w-8 h-8 text-slate-100 -z-0" />
                                            <p className="text-slate-600 leading-relaxed relative z-10 pl-6 italic font-medium">
                                                "{review.comment}"
                                            </p>
                                        </div>

                                        {review.metrics && (
                                            <div className="flex flex-wrap items-center gap-4 border-t border-slate-50 pt-4">
                                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <Clock className="w-4 h-4 text-emerald-500" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase">Punctuality</span>
                                                        <div className="flex gap-0.5">
                                                            {renderStars(review.metrics.punctuality, "w-2.5 h-2.5")}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <UserCheck className="w-4 h-4 text-emerald-500" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase">Professionalism</span>
                                                        <div className="flex gap-0.5">
                                                            {renderStars(review.metrics.professionalism, "w-2.5 h-2.5")}
                                                        </div>
                                                    </div>
                                                </div>

                                                {review.metrics.broughtTools && (
                                                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                        <Wrench className="w-4 h-4 text-emerald-600" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] text-emerald-600 font-black uppercase">Prepared</span>
                                                            <span className="text-[10px] font-bold text-emerald-800">Provided Own Tools</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-inner">
                            <MessageSquareQuote className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-800">No references on file</h3>
                            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Complete your first job to start building your professional reference sheet!</p>
                            <button className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all">Find a job</button>
                        </div>
                    )}
                 </div>
            </div>
        )}
      </div>

      {reviewJob && (
          <ReviewForm 
            job={reviewJob} 
            user={user} 
            onClose={() => setReviewJob(null)} 
            onSuccess={() => {
                setReviewJob(null);
                fetchData();
            }}
          />
      )}
    </div>
  );
};

// Helper internal icons
const CheckCheck = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
);
