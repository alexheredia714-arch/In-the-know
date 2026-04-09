import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { JobBoard } from './components/JobBoard';
import { AIAdvisor } from './components/AIAdvisor';
import { PostJobForm } from './components/PostJobForm';
import { UserProfile } from './components/UserProfile';
import { DirectMessaging } from './components/DirectMessaging';
import { JobPost } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [pendingChat, setPendingChat] = useState<{ recipientName: string, jobTitle: string } | null>(null);

  const handleContact = (job: JobPost) => {
    setPendingChat({
      recipientName: job.authorName,
      jobTitle: job.title
    });
    setActiveTab('messages');
  };

  const renderContent = () => {
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
        return <DirectMessaging initialChat={pendingChat} />;
      case 'advisor':
        return <AIAdvisor />;
      case 'profile':
        return <UserProfile onContact={handleContact} />;
      default:
        return <Hero onPostJob={() => setActiveTab('post')} onFindWork={() => setActiveTab('jobs')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
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
