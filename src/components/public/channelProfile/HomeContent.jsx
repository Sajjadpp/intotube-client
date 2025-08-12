import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../axios/AxiosInstance';
import { formatDuration, formatViews } from '../../../assets/VideoCard/VideoCard';
import { formatRelativeTime } from '../../../service/formatDate';

const HomeContent = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [featured, setFeatured] = useState({});
    const [popular, setPopular] = useState([]);
    const channelId = useParams().id;
    const navigate = useNavigate();
    
    
    const playlists = [
        { id: 1, title: 'React Fundamentals', videos: 8 },
        { id: 2, title: 'Tailwind CSS Masterclass', videos: 12 },
        { id: 3, title: 'JavaScript Deep Dive', videos: 6 },
    ];

  const fetchData = async() =>{

    try{
        let featuredData = await axiosInstance.get(`/channel/home/${channelId}`)
        console.log(featuredData.data,'data featured')
        setFeatured(featuredData.data.featuredVideo)
        setPopular(featuredData.data.popularVideos)
    }
    catch(error){
        console.log(error,'error while fetching the featued data');

    }
  }

  useEffect(()=>{
    if(!channelId) return
    fetchData()
  },[channelId]);

  return(
    <div className="text-gray-900">
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Content</h2>
            <div 
                className="relative rounded-xl p-8 text-white overflow-hidden"
                style={{
                backgroundImage: featured?.thumbnailUrl 
                    ? `linear-gradient(to right, rgba(29, 78, 216, 0.9), rgba(30, 58, 138, 0.9)), url(${featured.thumbnailUrl})`
                    : 'linear-gradient(to right, #1d4ed8, #1e3a8a)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'multiply'
                }}
            >
                <h3 className="text-3xl font-bold mb-4 relative z-10">{featured?.title}</h3>
                <p className="mb-6 max-w-2xl relative z-10">{featured?.description}</p>
                <button className="px-6 py-2 bg-white text-blue-800 font-medium rounded-full hover:bg-gray-100 transition-colors relative z-10">
                    Watch Now
                </button>
            </div>
        </div>

        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popular?.slice(0, 3).map(video => (
                <div 
                    onClick={()=> navigate(`/video/${video._id}`)}
                    key={video._id} 
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
                >
                    {/* Thumbnail with duration overlay */}
                    <div className="relative aspect-video overflow-hidden">
                    <img 
                        src={video?.thumbnailUrl} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={video?.title}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-xs font-medium">
                        {formatDuration(video?.duration)}
                    </div>
                    {/* Play button overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 p-3 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        </div>
                    </div>
                    </div>
                    
                    {/* Video info */}
                    <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {video.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span>{formatViews(video.viewCount)} views</span>
                        <span>•</span>
                        <span>{formatRelativeTime(video.createdAt)}</span>
                    </div>
                    {/* Channel info (if available) */}
                    {video?.channel && (
                        <div className="flex items-center mt-2">
                        <img 
                            src={video.channel.avatar} 
                            className="w-6 h-6 rounded-full mr-2" 
                            alt={video.channel.name}
                        />
                        <span className="text-sm text-gray-600">{video.channel.name}</span>
                        </div>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-bold mb-6">Playlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {playlists.map(playlist => (
                <div key={playlist.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
                                <i className="fas fa-play-circle text-white text-3xl"></i>
                                <span className="text-white font-bold ml-2">{playlist.videos} videos</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold">{playlist.title}</h3>
                    </div>
                </div>
            ))}
            </div>
        </div>
    </div>
  )
};

export default HomeContent;