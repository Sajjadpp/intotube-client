import { useState } from 'react';
import VideosContent from './Video';
import HomeContent from './HomeContent';

export default function ChannelNavTabs() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent />;
      case 'videos':
        return <VideosContent />;
      case 'shorts':
        return <ShortsContent />;
      case 'live':
        return <LiveContent />;
      case 'posts':
        return <PostsContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="w-full mt-6">
      {/* Navigation Tabs */}
      <div className="flex gap-1 border-b border-gray-300 pb-0 pl-10 overflow-x-auto scrollbar-hide">
        {['home', 'videos', 'shorts', 'live', 'posts'].map((tab) => (
          <button
            key={tab}
            className={`cursor-pointer px-4 py-3 font-medium text-sm sm:text-base capitalize transition-colors duration-200 whitespace-nowrap relative ${
              activeTab === tab
                ? 'text-blue-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'shorts' ? 'Shorts' : tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 bg-white rounded-b-xl border border-gray-200">
        {renderContent()}
      </div>
    </div>
  );
}

function ShortsContent() {
  return (
    <div className="font-sans text-gray-900">
      <h3 className="font-medium text-lg mb-4">Shorts</h3>
      <div className="text-gray-600">
        Short-form videos will appear here
      </div>
    </div>
  );
}

function LiveContent() {
  return (
    <div className="font-sans text-gray-900">
      <h3 className="font-medium text-lg mb-4">Live Streams</h3>
      <div className="text-gray-600">
        Upcoming and past live streams will appear here
      </div>
    </div>
  );
}

function PostsContent() {
  return (
    <div className="font-sans text-gray-900">
      <h3 className="font-medium text-lg mb-4">Community Posts</h3>
      <div className="text-gray-600">
        Channel posts and updates will appear here
      </div>
    </div>
  );
}