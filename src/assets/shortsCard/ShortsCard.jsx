import React from 'react';
import { FiMoreVertical, FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { convertUrl, profileImageUrl } from '../constants/constant';

const ShortsCard = ({ short={} }) => {
  const navigate = useNavigate();
    
  return (
    <div className="relative h-[400px] w-[220px] flex-shrink-0 rounded-lg overflow-hidden bg-black cursor-pointer">
      {/* Video Thumbnail/Player */}
      <div 
        className="absolute inset-0 bg-gray-800 flex items-center justify-center"
        onClick={() => navigate(`/shorts/${short?._id}`)}
      >
        <img 
          src={convertUrl(short?.thumbnailUrl)} 
          alt={short?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      {/* Video Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <h3 className="font-semibold line-clamp-2">{short?.title}</h3>
        <p className="text-xs text-gray-300">{short?.viewCount} views</p>
      </div>

      {/* Channel Info */}
      <div className="absolute top-3 left-3 flex items-center">
        <img 
          src={profileImageUrl(short?.user?.profileImage)} 
          alt={short?.user?.username}
          className="w-8 h-8 rounded-full border border-white"
        />
      </div>      
    </div>
  );
};

export default ShortsCard;