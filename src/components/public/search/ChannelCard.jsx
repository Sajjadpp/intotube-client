import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, UserPlus } from 'lucide-react';
import axiosInstance from '../../../axios/AxiosInstance';
import { useAuth } from '../../../context/AuthContext';
import { profileImageUrl } from '../../../assets/constants/constant';

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(channel.isSubscribed || false);
  const [subscribersCount, setSubscribersCount] = useState(channel.subscribersCount || 0);

  const handleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isSubscribed) {
        await axiosInstance.delete(`/subscription/${channel._id}`);
        setSubscribersCount(prev => prev - 1);
      } else {
        await axiosInstance.post(`/subscription/${channel._id}`);
        setSubscribersCount(prev => prev + 1);
      }
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div 
      className="flex items-center p-4 hover:bg-gray-100 rounded-lg cursor-pointer max-h-30 transition-colors bg-white"
      onClick={() => navigate(`/channel/${channel._id}`)}
    >
      {/* Channel Avatar */}
      <div className="relative mr-4">
        <img
          src={profileImageUrl(channel.profileImage) || '/default-avatar.jpg'}
          alt={channel.username}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
        />
        {channel.isVerified && (
          <div className="absolute bottom-0 right-0 bg-blue-900 rounded-full p-1">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Channel Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-black truncate">
          {channel.username}
          {channel.isVerified && (
            <span className="ml-1 text-blue-900">✓</span>
          )}
        </h3>
        <p className="text-sm text-gray-600">
          {subscribersCount.toLocaleString()} subscribers
        </p>
        {channel.bio && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {channel.bio}
          </p>
        )}
      </div>

      {/* Subscribe Button */}
      <button
        onClick={handleSubscribe}
        className={`ml-4 px-4 py-2 rounded-full font-medium flex items-center ${
          isSubscribed
            ? 'bg-gray-200 text-black hover:bg-gray-300'
            : 'bg-blue-900 text-white hover:bg-blue-800'
        }`}
      >
        {isSubscribed ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Subscribed
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-1" />
            Subscribe
          </>
        )}
      </button>
    </div>
  );
};

export default ChannelCard;