

import { ChevronLeft, ChevronRight, Play, Eye, Clock, Star, TrendingUp, Flame } from 'lucide-react';
import { VideoCard } from '../../../assets/VideoCard/VideoCard';
import { useNavigate } from 'react-router-dom';
import { convertUrl } from '../../../assets/constants/constant';

const FeaturedSectionPage = ({ videos=[] }) => {
  const featuredVideo = videos[0] || {};

  const navigate = useNavigate()
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="flex items-center mb-6">
        <Flame className="w-6 h-6 text-red-500 mr-2" />
        <h2 className="text-2xl font-bold text-blue-900">Featured Content</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Full width on mobile and tablet, span 2 on lg */}
        <div className="lg:col-span-2">
          <VideoCard video={featuredVideo} featured={true} />
        </div>

        {/* Stack below on mobile */}
        <div className="space-y-4">
          {videos.slice(1, 4).map((video, i) => (
            <div
              key={i}
              className="flex bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-3"
              onClick={()=> navigate(`/video/${video._id}`)}
            >
              <img
                src={convertUrl(video.thumbnailUrl) || "https://via.placeholder.com/120x68"}
                alt="thumbnail"
                className="w-20 h-12 sm:w-28 sm:h-16 rounded object-cover mr-3"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                  {video?.title || "Related Video Title"}
                </h4>
                <p className="text-xs text-gray-600">{video?.user.username || "Channel"}</p>
                <p className="text-xs text-gray-500">{video?.viewCount || "500K"} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default FeaturedSectionPage