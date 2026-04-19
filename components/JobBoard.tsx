import React, { useState, useEffect } from 'react';
import { JobPost, JobCategory } from '../types';
import { JobCard } from './JobCard';
import { Search, Filter, Loader2 } from 'lucide-react';

interface JobBoardProps {
  onContact?: (job: JobPost) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ onContact }) => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs
    .filter(job => job.status === 'active')
    .filter(job => {
      const matchesCategory = filterCategory === 'All' || job.category === filterCategory;
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            job.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
            <p>Finding local opportunities...</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Available Jobs</h2>
            <p className="text-slate-500 mt-1">Find opportunities to help your neighbors.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md border p-2"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-slate-400" aria-hidden="true" />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md border p-2 bg-white"
                >
                    <option value="All">All Categories</option>
                    {Object.values(JobCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onContact={onContact} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No jobs found matching your criteria.</p>
            <button 
                onClick={() => {setSearchTerm(''); setFilterCategory('All')}}
                className="mt-2 text-emerald-600 font-medium hover:text-emerald-700"
            >
                Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
