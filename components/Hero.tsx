import React from 'react';
import { ArrowRight, HeartHandshake, DollarSign, PenTool } from 'lucide-react';

interface HeroProps {
  onPostJob: () => void;
  onFindWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPostJob, onFindWork }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Home projects done</span>{' '}
                <span className="block text-emerald-600 xl:inline">within your budget</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Connect with skilled neighbors and community helpers. Whether you have $50, a barter trade, or just need a helping hand, KnowApp makes it happen.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={onPostJob}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg transition-all"
                  >
                    Post a Job
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={onFindWork}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 md:py-4 md:text-lg transition-all"
                  >
                    Find Work
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-100 flex items-center justify-center">
         <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-90"
            src="https://picsum.photos/1200/800?grayscale"
            alt="Person fixing a wall"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent lg:via-white/20"></div>
      </div>

      <div className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-10">
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                    <div className="relative">
                        <dt>
                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500 text-white">
                                <DollarSign className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-lg leading-6 font-medium text-slate-900">Affordable Solutions</p>
                        </dt>
                        <dd className="mt-2 ml-16 text-base text-slate-500">
                            Set your own price, offer a trade, or request volunteer help. We believe everyone deserves a safe home.
                        </dd>
                    </div>

                    <div className="relative">
                        <dt>
                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500 text-white">
                                <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-lg leading-6 font-medium text-slate-900">Community First</p>
                        </dt>
                        <dd className="mt-2 ml-16 text-base text-slate-500">
                            Build connections with your neighbors. Help each other out and strengthen your local community.
                        </dd>
                    </div>

                    <div className="relative">
                        <dt>
                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500 text-white">
                                <PenTool className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-lg leading-6 font-medium text-slate-900">AI Project Advisor</p>
                        </dt>
                        <dd className="mt-2 ml-16 text-base text-slate-500">
                           Don't know what's wrong? Our AI advisor helps you diagnose issues and draft the perfect job post.
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
      </div>
    </div>
  );
};
