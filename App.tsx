import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { JobBoard } from './components/JobBoard';
import { AIAdvisor } from './components/AIAdvisor';
import { PostJobForm } from './components/PostJobForm';
import { UserProfile } from './components/UserProfile';
import { DirectMessaging } from './components/DirectMessaging';
import { ProfileSetup } from './components/ProfileSetup';
import { JobPost, UserProfile as UserProfileType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [pendingChat, setPendingChat] = useState<{ recipientName: string, jobTitle: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const handleContact = (job: JobPost) => {
    setPendingChat({
      recipientName: job.authorName,
      jobTitle: job.title
    });
    setActiveTab('messages');
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/user/signout', { method: 'POST' });
      if (response.ok) {
        setUser(null);
        setActiveTab('home');
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const renderContent = () => {
    if (isLoadingUser) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    // Engagement protection
    const needsProfile = ['post', 'messages', 'profile'].includes(activeTab);
    if (needsProfile && !user) {
      return (
        <div className="py-12">
           <ProfileSetup onComplete={(newProfile) => setUser(newProfile)} />
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <>
            <Hero 
              onPostJob={() => setActiveTab('post')} 
              onFindWork={() => setActiveTab('jobs')} 
            />
            <div className="bg-slate-50 border-t border-slate-200">
                <JobBoard onContact={handleContact} />
            </div>
          </>
        );
      case 'jobs':
        return <JobBoard onContact={handleContact} />;
      case 'post':
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PostJobForm />
            </div>
        );
      case 'messages':
        return <DirectMessaging initialChat={pendingChat} user={user} />;
      case 'advisor':
        return <AIAdvisor />;
      case 'profile':
        return <UserProfile onContact={handleContact} user={user} />;
      default:
        return <Hero onPostJob={() => setActiveTab('post')} onFindWork={() => setActiveTab('jobs')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} user={user} onSignOut={handleSignOut} />
      <main>
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} KnowApp. Connecting communities, one project at a time.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
