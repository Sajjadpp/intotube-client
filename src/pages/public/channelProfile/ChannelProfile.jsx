// ChannelProfile.js
import { Bell, Calendar, Eye, MoreVertical, Share2, Users, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ChannelNavTabs from '../../../components/public/channelProfile/ChannelNav';
import { useAuth } from '../../../context/AuthContext';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../axios/AxiosInstance';
import { toast } from 'react-toastify';
import { profileImageUrl } from '../../../assets/constants/constant';
import UserNotFoundCard from '../../../assets/popups/UserNotFound';

const ChannelProfile = () => {

    let channelId = useParams().id;
    let {user} = useAuth()
    const [channel, setChannel] = useState(null);
    const [subscribtionStatus, setSubscribtionStatus] = useState(false);
    const [subscribtionCount, setSubscribtionCount] = useState(0);
    const [userNotPopup, setUserNotPopup] = useState(false)

     const formatViews = (views) => {
        if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
        } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
        }
        return views?.toString();
    };

    const handleShare = async(e) =>{

      try {
        await navigator.share({
          title: 'Awesome Content',
          text: 'Check this out!',
          url: window.location.href
        });
      } catch (err) {
        // Fallback to method 2 if Web Share API not supported
        const text = encodeURIComponent("Check out this awesome content!");
        const url = encodeURIComponent(window.location.href);
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
      }
    }

    const fetchChannel = async() =>{

        try{
            console.log('user',user,'users')
            let response = await axiosInstance.get(`/channel/${channelId}/${user?._id}`);
            // console.log(response.data, 'channel data');
            setChannel(response.data)
            console.log(response.data)
            setSubscribtionStatus(response?.data?.subscriptionStatus)
            setSubscribtionCount(response?.data?.subscribersCount)
        }
        catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        console.log(channelId,"channelId")
        if(!channelId || user === 0) return
        fetchChannel()
    },[channelId, user]);

    const handleSubscription = async (e) => {
      e.stopPropagation();

      if(!user){
        return setUserNotPopup(true)
      }
      try {
        await axiosInstance.put('/channel/subscribe', {
          userId: user._id,
          channelId: channelId,
          subscribtionStatus: subscribtionStatus
        });

        setSubscribtionCount(prev => subscribtionStatus ? prev - 1 : prev + 1);
        setSubscribtionStatus(prev => !prev);
        toast.success(subscribtionStatus ? 'Unsubscribed successfully' : 'Subscribed successfully');
      } catch (error) {

        console.error("Subscription action failed:", error);
        toast.error('Error updating subscription');
      }
    };

    return (
        <section className='px-4 sm:px-10 w-full min-h-svh pt-4 bg-white text-black'>
        {/* Channel Banner */}
        {userNotPopup ? <UserNotFoundCard setNoUserPopup={setUserNotPopup}/> : null}
        <div className='bg-gradient-to-r from-blue-800 to-blue-900 w-full h-[150px] sm:h-[200px] rounded-2xl overflow-hidden'>
            <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl font-bold text-white/80">Channel Banner</span>
            </div>
        </div>
        
        {/* Channel Info 1 - Transformed */}
        <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-1 bg-white rounded-2xl">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 rounded-2xl">
              <div className="flex-shrink-0">
                <img
                  src={profileImageUrl(channel?.profileImage)}
                  alt={channel?.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 truncate">
                    {channel?.username}
                  </h1>
                  {/* Add verified badge if needed */}
                {channel?.isVerified && (
                    <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ✓ Verified
                    </div>
                )}
                </div>
                
                <p className="text-gray-600 mb-1">@{channel?.username}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {subscribtionCount} subscribers
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {channel?.videoCount} videos
                  </span>
                  {/* Add total views if available */}
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatViews(channel?.totalViews)} total views
                  </span>
                  {/* Add join date if available */}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(channel?.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
                
                {/* Add bio if available */}
                <p className="text-gray-800 leading-relaxed mb-4">
                  {channel?.bio}
                </p>
              </div>
              
              <div  className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubscription}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 flex cursor-pointer items-center gap-2  ${subscribtionStatus ? 'bg-gray-100 text-gray-800' :'bg-blue-900 hover:bg-blue-800'}`}
                >
                  <Bell className="w-4 h-4" />
                  {subscribtionStatus ?  'Subscribed' : 'Subscribe'}
                </button>
                
                <div className="flex gap-2">
                  <button onClick={handleShare} className="p-2 border border-gray-400 rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 border border-gray-400 rounded-full hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ChannelNavTabs/>
        </section>
    );
}

export default ChannelProfile;