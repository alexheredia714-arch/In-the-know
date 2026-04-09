import React from 'react';
import { Home, Hammer, PlusCircle, MessageCircle, Menu, X, User, MessageSquare } from 'lucide-react';
import { MOCK_USER } from '../constants';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Find Work', icon: Hammer },
    { id: 'post', label: 'Post a Job', icon: PlusCircle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'advisor', label: 'AI Advisor', icon: MessageCircle },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-emerald-500 p-2 rounded-lg">
                 <Hammer className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">KnowApp</span>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${
                  activeTab === item.id
                    ? 'border-emerald-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
            
            {/* User Profile Button - Desktop */}
            <div className="pl-4 border-l border-slate-200 ml-4 flex items-center">
                 <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors ${activeTab === 'profile' ? 'bg-slate-50 ring-2 ring-emerald-500 ring-offset-2' : ''}`}
                 >
                    <img 
                        src={MOCK_USER.avatarUrl} 
                        alt="User" 
                        className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" 
                    />
                    <span className="text-sm font-medium text-slate-700 hidden lg:block">Profile</span>
                 </button>
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === item.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left flex items-center`}
              >
                 <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
            
             <button
                onClick={() => {
                  setActiveTab('profile');
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'profile'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left flex items-center border-t border-slate-100 mt-2 pt-4`}
              >
                 <div className="w-5 h-5 mr-3 flex items-center justify-center">
                    <img src={MOCK_USER.avatarUrl} className="w-5 h-5 rounded-full" />
                 </div>
                My Profile
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};
