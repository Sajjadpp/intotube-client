import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../../axios/AxiosInstance';
import { useParams } from 'react-router-dom';
import { formatDuration } from '../../../assets/VideoCard/VideoCard';
import { formatRelativeTime } from '../../../service/formatDate';
import VideoCardSelton from '../../skelton/videoCardSelton';
import { profileImageUrl } from '../../../assets/constants/constant';

function VideosContent() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("Popular");
  const channelId = useParams().id;

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/channel/video/${channelId}`, {
        params: {
          page: page,
          category: category
        }
      });
      setVideos(data);
      setTotalPages(data.length);
    } catch (err) {
      console.error('Failed to fetch videos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, category]);


  return (
    <div className="p-4 text-gray-100">
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {["Latest", 'Popular', 'Oldest'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      { loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {[1,2,3,4].map(val => <VideoCardSelton/>)}
        </div>
            
      ): videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="cursor-pointer group">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-auto rounded-xl aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </span>
                </div>
                <div className="flex mt-1 gap-3">
                  <div>
                    <h3 className=" text-sm font-medium line-clamp-2 text-gray-100 group-hover:text-red-500 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{video.user?.username}</p>
                    <p className="text-gray-400 text-sm">
                      {video.viewCount} views • {formatRelativeTime(video.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 transition-colors"
              >
                &lt;
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = page <= 3 
                  ? i + 1 
                  : page >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-full transition-colors ${
                      page === pageNum
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 transition-colors"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      ) :(
        <div className="text-center py-16 text-gray-400">
          <p>No videos found in this category</p>
        </div>
      )}
    </div>
  );
}

export default VideosContent;