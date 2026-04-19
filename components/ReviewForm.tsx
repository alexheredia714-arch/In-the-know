import React, { useState } from 'react';
import { Star, Clock, UserCheck, Wrench, X, CheckCircle2, DollarSign, RefreshCw } from 'lucide-react';
import { JobPost, UserProfile, BudgetType } from '../types';

interface ReviewFormProps {
  job: JobPost;
  user: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ job, user, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [metrics, setMetrics] = useState({
    punctuality: 5,
    professionalism: 5,
    broughtTools: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dealValue = job.budgetType === BudgetType.BARTER ? job.barterDescription : `$${job.budgetAmount}`;

    const reviewData = {
      jobId: job.id,
      jobTitle: job.title,
      dealType: job.budgetType,
      dealValue: dealValue,
      reviewerName: job.authorName, // In a real app, this would be the current logged in user (who is the author)
      reviewerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${job.authorName}`,
      rating,
      comment,
      metrics
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to post review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, setStars: (n: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setStars(star)}
            className="focus:outline-none transition-transform active:scale-90"
          >
            <Star
              className={`w-8 h-8 ${
                star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-emerald-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest">
                {job.status === 'active' ? 'Complete & Review' : 'Add Post-Job Review'}
            </h2>
            <p className="text-emerald-200 text-sm opacity-80">
                {job.status === 'active' ? 'Close out your project with feedback' : 'Your feedback helps the community grow'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Job Recap */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-4">
             <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
             </div>
             <div>
                <h3 className="font-bold text-slate-900">{job.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-xs font-bold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500 uppercase">
                        {job.budgetType === BudgetType.BARTER ? (
                            <RefreshCw className="w-3 h-3 mr-1" />
                        ) : (
                            <DollarSign className="w-3 h-3 mr-1" />
                        )}
                        {job.budgetType}
                    </div>
                    <span className="text-sm text-slate-500">
                        {job.budgetType === BudgetType.BARTER ? job.barterDescription : `$${job.budgetAmount}`}
                    </span>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Rating</label>
            {renderStars(rating, setRating)}
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Neighbor Feedback</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the experience? Did they do a good job?"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Punctuality</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => setMetrics({...metrics, punctuality: n})}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                                metrics.punctuality >= n ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Professionalism</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => setMetrics({...metrics, professionalism: n})}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                                metrics.professionalism >= n ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
             <input 
                type="checkbox"
                id="tools"
                checked={metrics.broughtTools}
                onChange={(e) => setMetrics({...metrics, broughtTools: e.target.checked})}
                className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
             />
             <label htmlFor="tools" className="flex items-center gap-2 text-sm font-bold text-emerald-800 cursor-pointer">
                <Wrench className="w-4 h-4" />
                This neighbor brought their own tools
             </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Posting Review...' : 'Post Review & Close Job'}
          </button>
        </form>
      </div>
    </div>
  );
};
