import React from 'react';
import { Clock, MapPin, DollarSign, Gift, User } from 'lucide-react';
import { JobPost, BudgetType } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface JobCardProps {
  job: JobPost;
  onContact?: (job: JobPost) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onContact }) => {
  const getBudgetDisplay = () => {
    switch (job.budgetType) {
      case BudgetType.FIXED:
        return <span className="flex items-center text-emerald-700 font-semibold"><DollarSign className="w-4 h-4 mr-1" />${job.budgetAmount} (Fixed)</span>;
      case BudgetType.HOURLY:
        return <span className="flex items-center text-emerald-700 font-semibold"><DollarSign className="w-4 h-4 mr-1" />${job.budgetAmount}/hr</span>;
      case BudgetType.BARTER:
        return <span className="flex items-center text-amber-700 font-semibold"><Gift className="w-4 h-4 mr-1" />Trade: {job.barterDescription}</span>;
      case BudgetType.VOLUNTEER:
        return <span className="flex items-center text-purple-700 font-semibold"><HeartHandshakeIcon className="w-4 h-4 mr-1" />Volunteer</span>;
      default:
        return null;
    }
  };

  // Helper component for icon
  const HeartHandshakeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-6 mb-4">
      <div className="flex justify-between items-start mb-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[job.category]}`}>
          {job.category}
        </span>
        <span className="text-xs text-slate-500 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(job.postedAt).toLocaleDateString()}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2">{job.title}</h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{job.description}</p>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4 gap-4">
        <div className="flex items-center gap-4">
            <span className="flex items-center">
            <User className="w-4 h-4 mr-1 text-slate-400" />
            {job.authorName}
            </span>
            <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-slate-400" />
            {job.location}
            </span>
        </div>
        <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
            {getBudgetDisplay()}
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-medium py-2 rounded-md hover:bg-slate-50 transition-colors">
            Details
        </button>
        <button 
          onClick={() => onContact?.(job)}
          className="flex-1 bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700 transition-colors"
        >
            Contact Poster
        </button>
      </div>
    </div>
  );
};
