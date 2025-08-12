import { Clock, Eye, Flame, MessageSquare, Play, Star, ThumbsUp } from "lucide-react";
import { convertUrl, profileImageUrl } from "../constants/constant";
import { useNavigate } from "react-router-dom";


// Mock VideoCard component for demonstration
export const VideoCard = ({ video, featured = false, size = 'normal' }) => {
  const cardStyles = {
    normal: "bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 w-full cursor-pointer",
    large: "bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 w-full cursor-pointer",
    featured: "bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl shadow-xl cursor-pointer hover:shadow-2xl transition duration-300 w-full"
  };

  const navigate = useNavigate();

  
  return (
    <div className={cardStyles[featured ? 'featured' : size]} onClick={()=> navigate(`/video/${video._id}`)}>
      
      {/* Thumbnail */}
      <div className="relative w-full aspect-video group">
        <img
          src={convertUrl(video?.thumbnailUrl) || "https://via.placeholder.com/400x225"}
          alt={video?.title || "Video thumbnail"}
          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
        />
        
        <div className="absolute inset-0 gb-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
          <Play className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {featured && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Flame className="w-3 h-3 mr-1" />
            FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className={`font-semibold mb-1 line-clamp-2 text-base sm:text-lg ${featured ? 'text-white' : 'text-gray-900'}`}>
          {video?.title || "Sample Video Title"}
        </h3>
        <p className={`text-sm mb-2 ${featured ? 'text-blue-100' : 'text-gray-600'}`}>
          {video?.user?.username || "Channel Name"}
        </p>

        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-1 ${featured ? 'text-blue-200' : 'text-gray-500'}`}>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {video?.viewCount || "1.2M"} views
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(video?.duration) || "2 days ago"}
            </span>
          </div>
          {video?.rating && (
            <div className="flex items-center">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {video.rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Format view count
export const formatViews = (count) => {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
};