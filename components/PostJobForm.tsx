import React, { useState } from 'react';
import { JobCategory, BudgetType } from '../types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const PostJobForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: JobCategory.OTHER,
    budgetType: BudgetType.FIXED,
    budgetAmount: '',
    barterDescription: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                authorName: 'Sarah J.', // Mocking current user since auth isn't fully robust here yet
                budgetAmount: formData.budgetAmount ? parseFloat(formData.budgetAmount) : undefined
            })
        });

        if (response.ok) {
            setIsSubmitting(false);
            setIsSuccess(true);
            // Reset form after 2 seconds
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({
                    title: '',
                    description: '',
                    category: JobCategory.OTHER,
                    budgetType: BudgetType.FIXED,
                    budgetAmount: '',
                    barterDescription: '',
                    location: '',
                })
            }, 2000);
        }
    } catch (error) {
        console.error('Failed to post job:', error);
        setIsSubmitting(false);
    }
  };

  if (isSuccess) {
      return (
          <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Job Posted Successfully!</h2>
              <p className="text-slate-500 mt-2">Your neighbors will see it soon.</p>
          </div>
      )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-emerald-50/50">
        <h2 className="text-xl font-bold text-slate-800">Post a New Job</h2>
        <p className="text-sm text-slate-500">Describe what you need help with. Be honest about your budget.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">Project Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Fix leaking faucet"
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2 bg-white"
          >
            {Object.values(JobCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue. What tools do you have? What needs to be done?"
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="budgetType" className="block text-sm font-medium text-slate-700">Budget Type</label>
                <select
                    id="budgetType"
                    name="budgetType"
                    value={formData.budgetType}
                    onChange={handleChange}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2 bg-white"
                >
                    {Object.values(BudgetType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {formData.budgetType === BudgetType.BARTER ? (
                <div>
                    <label htmlFor="barterDescription" className="block text-sm font-medium text-slate-700">What can you offer?</label>
                    <input
                        type="text"
                        id="barterDescription"
                        name="barterDescription"
                        required
                        value={formData.barterDescription}
                        onChange={handleChange}
                        placeholder="e.g., Home cooked meal, guitar lessons"
                        className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2"
                    />
                </div>
            ) : formData.budgetType !== BudgetType.VOLUNTEER ? (
                <div>
                    <label htmlFor="budgetAmount" className="block text-sm font-medium text-slate-700">Amount ($)</label>
                    <input
                        type="number"
                        id="budgetAmount"
                        name="budgetAmount"
                        required
                        min="0"
                        value={formData.budgetAmount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2"
                    />
                </div>
            ) : (
                <div className="flex items-end pb-2">
                    <p className="text-xs text-slate-500 italic">Requesting volunteer help means no payment is exchanged.</p>
                </div>
            )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location (City/Neighborhood)</label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., North Hills"
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border p-2"
          />
        </div>

        <div className="pt-4">
            <div className="rounded-md bg-blue-50 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Safety Tip</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>Never share personal financial information upfront. Meet neighbors in a safe manner.</p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
            >
                {isSubmitting ? 'Posting...' : 'Post Job'}
            </button>
        </div>
      </form>
    </div>
  );
};
