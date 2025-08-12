import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDuration } from '../../../../assets/VideoCard/VideoCard';
import { formatRelativeTime } from '../../../../service/formatDate';
import { convertUrl } from '../../../../assets/constants/constant';

const Recommended = ({ videos, currentVideoId }) => {
  const navigate = useNavigate();

  if (!videos || videos.length === 0) {
    return (
      <aside className="space-y-4 bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-black mb-4">Recommended Videos</h2>
        <p className="text-gray-600">No recommendations available</p>
      </aside>
    );
  }

  return (
    <aside className="space-y-4 bg-white p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-black mb-4">Recommended Videos</h2>
      
      <div className="space-y-4">
        {videos
          .filter(video => video._id !== currentVideoId)
          .map(video => (
            <div 
              key={video._id} 
              className="flex gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => navigate(`/video/${video._id}`)}
            >
              <div className="relative flex-shrink-0 w-40 h-24">
                <img 
                  src={convertUrl(video.thumbnailUrl)} 
                  
                  alt={video.title}
                  className="w-full h-full rounded-lg object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-black line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{video.user?.username}</p>
                <p className="text-xs text-gray-500">
                  {video.viewCount?.toLocaleString()} views • {formatRelativeTime(video.createdAt)}
                </p>
              </div>
            </div>
          ))
        }
      </div>
    </aside>
  );
};

export default Recommended;