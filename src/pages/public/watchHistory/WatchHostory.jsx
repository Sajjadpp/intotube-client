


import React, { useState, useEffect } from 'react';
import { Search, Clock, MoreVertical, X, Trash2, Eye, SortDesc } from 'lucide-react';
import { BiMenuAltLeft } from 'react-icons/bi';
import axiosInstance from '../../../axios/AxiosInstance';
import { useAuth } from '../../../context/AuthContext';
import { formatDuration, formatViews } from '../../../assets/VideoCard/VideoCard';

const WatchHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortPopupDown, setSortPopupDown] = useState(false);
  const { user } = useAuth();
  const [watchHistory, setWatchHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  const filters = ['All', 'Today', 'Yesterday', 'This week', 'This month', 'This year'];

  const fetchData = async () => {
    if (!user) return;
    console.log(user,"user watchho")
    try {
      const response = await axiosInstance.get(`/channel/history/${user._id}`);
      console.log(response.data)
      setWatchHistory(response.data);
      setFilteredHistory(response.data); // Initialize filtered history with all data
    } catch (error) {
      console.error('Error fetching watch history:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Function to filter videos by date
  const filterByDate = (video, filter) => {
    if (filter === 'All') return true;
    
    const now = new Date();
    const videoDate = new Date(video.watchedAt);
    
    switch(filter) {
      case 'Today':
        return videoDate.toDateString() === now.toDateString();
      case 'Yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return videoDate.toDateString() === yesterday.toDateString();
      case 'This week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return videoDate >= startOfWeek;
      case 'This month':
        return videoDate.getMonth() === now.getMonth() && 
               videoDate.getFullYear() === now.getFullYear();
      case 'This year':
        return videoDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  // Apply search and filters whenever they change
  useEffect(() => {
    const filtered = watchHistory.filter(video => {
      // Search filter
      const matchesSearch = 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channel.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date filter
      const matchesDate = filterByDate(video, selectedFilter);
      
      return matchesSearch && matchesDate;
    });
    
    setFilteredHistory(filtered);
  }, [searchQuery, selectedFilter, watchHistory]);

  const removeFromHistory = async (id) => {
    try {
      await axiosInstance.delete(`/channel/history/${id}`);
      setWatchHistory(prev => prev.filter(video => video.id !== id));
    } catch (error) {
      console.error('Error removing from history:', error);
    }
  };

  const clearAllHistory = async () => {
    try {
      await axiosInstance.delete(`/channel/history/${user._id}?isFull=true`);
      setWatchHistory([]);
      setFilteredHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const clearSearchQuery = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-blue-200 bg-white top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-black">Watch history</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0 sticky top-25 h-full">
            <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-black mb-4">Search watch history</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearchQuery}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Options */}
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <div className='flex justify-between'>
                <h3 className="font-semibold text-black mb-3">Filter by date</h3>
                {sortPopupDown ? (
                  <BiMenuAltLeft onClick={() => setSortPopupDown(false)} />
                ) : (
                  <SortDesc onClick={() => setSortPopupDown(true)} />
                )}
              </div>
              {sortPopupDown && (
                <div className="space-y-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setSortPopupDown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedFilter === filter
                          ? 'bg-blue-100 text-blue-600 border border-blue-300'
                          : 'text-black hover:bg-blue-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear History */}
            <div className="mt-6">
              <button 
                onClick={clearAllHistory}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                disabled={watchHistory.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear all watch history</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {searchQuery && (
              <div className="mb-4">
                <p className="text-black">
                  Search results for "<span className="font-semibold">{searchQuery}</span>"
                </p>
              </div>
            )}

            {selectedFilter !== 'All' && (
              <div className="mb-4">
                <p className="text-black">
                  Filtered by: <span className="font-semibold">{selectedFilter}</span>
                </p>
              </div>
            )}

            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="mx-auto w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No videos found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((video) => (
                  video.videoType === "shorts" ? (
                    // Shorts Card
                    <div
                      key={video.id}
                      className="bg-white border border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow group flex flex-row"
                    >
                        <div className="flex flex-row gap-4 w-full">
                        {/* Thumbnail - Tall aspect ratio for shorts */}
                        <div className="relative flex-shrink-0 w-24 h-40">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover rounded-md border border-pink-200"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                            SHORTS
                          </div>
                          <div className={`w-[${Math.round(Number(video.watchedDuration))}%] bg-pink-400 h-1 absolute bottom-0 rounded-b-lg`}></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-black mb-1 line-clamp-2 hover:text-pink-600 cursor-pointer">
                              {video.title}
                            </h3>
                            <p className="text-pink-600 hover:text-pink-800 cursor-pointer mb-1">
                              {video.channel}
                            </p>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="text-sm text-gray-600">
                              <span>{formatViews(video.views)} views</span>
                              <span className="mx-1">•</span>
                              <span>{video.watchedAt}</span>
                            </div>
                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => removeFromHistory(video.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove from watch history"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ... rest of the shorts card JSX ... */}
                    </div>
                  ) : (
                    // Normal Video Card
                    <div
                      key={video.id}
                      className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                        {/* Thumbnail - Standard aspect ratio */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full sm:w-48 h-32 object-cover rounded-md border border-blue-200"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                            {formatDuration(video.duration)}
                          </div>
                          <div className={`w-[${Math.round(Number(video.watchedDuration))}%] bg-blue-400 h-1 absolute bottom-0 rounded-b-lg`}></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-black mb-1 line-clamp-2 hover:text-blue-600 cursor-pointer">
                                {video.title}
                              </h3>
                              <p className="text-blue-600 hover:text-blue-800 cursor-pointer mb-1">
                                {video.channel}
                              </p>
                              <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-2 mb-2">
                                <span>{formatViews(video.views)} views</span>
                                <span>•</span>
                                <span>{video.watchedAt}</span>
                              </div>
                              <p className="text-gray-700 text-sm line-clamp-2 hidden sm:block">
                                {video.description}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => removeFromHistory(video.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove from watch history"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ... rest of the video card JSX ... */}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchHistory;