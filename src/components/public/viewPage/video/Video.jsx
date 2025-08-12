import React, { useRef, useState, useEffect } from 'react';
import { 
  FiThumbsUp, FiThumbsDown, FiShare2, FiSave, FiSkipForward, 
  FiSkipBack, FiPlay, FiPause, FiMaximize, FiMinimize, 
  FiVolume2, FiVolumeX, FiSettings, FiMoreHorizontal 
} from 'react-icons/fi';
import { formatRelativeTime } from '../../../../service/formatDate';
import axiosInstance from '../../../../axios/AxiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import { convertUrl, profileImageUrl } from '../../../../assets/constants/constant';
import UserNotFoundCard from '../../../../assets/popups/UserNotFound';
import { useNavigate } from 'react-router-dom';

const Video = ({ videoData, videoFocus, setVideoFocus }) => {
  // Refs
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const currentTimeRef = useRef(videoData.lastSeenDuration || 0);
  const controlsTimerRef = useRef(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [likeStatus, setLikeStatus] = useState(videoData.userLikeStatus || null);
  const [isSubscribed, setIsSubscribed] = useState(videoData.subscriptionStatus || false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [videoLikeCount, setVideoLikeCount] = useState(videoData.videoLikes || 0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [noUserPopup, setNoUserPopup] = useState(false);
  const [subscribtionCount, setSubscribtionCount] = useState(videoData?.user?.subscribersCount || 0);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Initialize video with last seen duration
  console.log(videoData)
  useEffect(() => {
    const initializeVideo = async () => {
      if (videoRef.current && videoData.lastSeenDuration) {
        try {
          videoRef.current.currentTime = videoData.lastSeenDuration;
          setProgress((videoData.lastSeenDuration / videoRef.current.duration) * 100);
        } catch (error) {
          console.error("Error setting initial video time:", error);
        }
      }
    };

    const videoElement = videoRef.current;
    videoElement?.addEventListener('loadedmetadata', initializeVideo);

    return () => {
      videoElement?.removeEventListener('loadedmetadata', initializeVideo);
    };
  }, [videoData.lastSeenDuration]);

  // Handle time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const currentProgress = (currentTime / duration) * 100;
      
      setProgress(currentProgress);
      currentTimeRef.current = currentTime;

      // Update buffered progress
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / duration) * 100;
        setBufferedProgress(bufferedPercent);
      }
    }
  };

  // Save watch progress when component unmounts
  useEffect(() => {
    return () => {
      const sendViewData = async () => {
        if (!user || currentTimeRef.current <= 0) return;
        
        try {
          await axiosInstance.put(`/video/view/${videoData._id}/${user._id}`, { 
            duration: currentTimeRef.current 
          });
        } catch (error) {
          console.error('Error saving watch progress:', error);
        }
      };
      
      sendViewData();
      clearTimeout(controlsTimerRef.current);
    };
  }, [user, videoData._id]);

  // Control visibility timer
  const resetControlsTimer = () => {
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying && !isHovering && !showSettings && !showVolumeSlider) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleUserActivity = () => {
    setShowControls(true);
    resetControlsTimer();
  };

  // Player controls
  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
    handleUserActivity();
  };

  const handleSkip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
    handleUserActivity();
  };

  // Volume controls
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.volume = newMutedState ? 0 : (volume || 0.5);
      setIsMuted(newMutedState);
    }
  };

  // Fullscreen controls
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(console.error);
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(console.error);
    }
  };

  // Progress bar interactions
  const handleProgressBarClick = (e) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleProgressBarHover = (e) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      setHoverTime(pos * videoRef.current.duration);
      setHoverPosition(e.clientX - rect.left);
    }
  };

  // Helper functions
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return hours > 0 
      ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Like/dislike functionality
  const handleLikeStatus = async (status) => {
    if (!user) return setNoUserPopup(true);
    
    const newLikeStatus = status === "like" 
      ? (likeStatus === 'like' ? null : 'like')
      : (likeStatus === 'dislike' ? null : 'dislike');
    
    try {
      const response = await axiosInstance.put(`/video/like/${videoData._id}`, {
        videoId: videoData._id,
        userId: user._id,
        likeStatus: newLikeStatus
      });
      
      toast.success(response.data);
      setLikeStatus(newLikeStatus);
      
      // Update like count
      if (newLikeStatus === "like") {
        setVideoLikeCount(prev => prev + 1);
      } else if (likeStatus === "like") {
        setVideoLikeCount(prev => prev - 1);
      }
    } catch (error) {
      console.error("Like action failed:", error);
      toast.error('Failed to update like status');
    }
  };

  // Subscription functionality
  const handleSubscription = async (e) => {
    e.stopPropagation();
    try {
      await axiosInstance.put('/channel/subscribe', {
        userId: user._id,
        channelId: videoData.user._id,
        subscribtionStatus: isSubscribed
      });

      setSubscribtionCount(prev => isSubscribed ? prev - 1 : prev + 1);
      setIsSubscribed(prev => !prev);
      toast.success(isSubscribed ? 'Unsubscribed successfully' : 'Subscribed successfully');
    } catch (error) {
      console.error("Subscription action failed:", error);
      toast.error('Error updating subscription');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!videoFocus) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          handleSkip(-5);
          break;
        case 'ArrowRight':
          handleSkip(5);
          break;
        case 'ArrowUp':
          if (videoRef.current) {
            const newVolume = Math.min(1, videoRef.current.volume + 0.1);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(false);
          }
          break;
        case 'ArrowDown':
          if (videoRef.current) {
            const newVolume = Math.max(0, videoRef.current.volume - 0.1);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
          }
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            toggleFullscreen();
          }
          break;
        default:
          return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [videoFocus, isPlaying, volume]);

  // Mouse/touch event listeners for controls
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const events = ['mousemove', 'mousedown', 'touchstart', 'touchmove', 'click'];
    events.forEach(event => container.addEventListener(event, handleUserActivity));

    return () => {
      events.forEach(event => container.removeEventListener(event, handleUserActivity));
    };
  }, [isPlaying, isHovering, showSettings, showVolumeSlider]);

  return (
    <div className="relative max-w-4xl mx-auto" onClick={() => setVideoFocus(true)}>
      {noUserPopup && <UserNotFoundCard setNoUserPopup={setNoUserPopup} />}
      
      {/* Video Container */}
      <div 
        ref={videoContainerRef} 
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video
          ref={videoRef}
          src={convertUrl(videoData?.videoUrl)}
          className="w-full h-full cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.volume = volume;
            }
          }}
        />
        
        {/* Play/Pause Overlay */}
        {!showControls && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            <div className="bg-black/60 rounded-full p-4 transition-transform hover:scale-110">
              <FiPlay size={32} className="text-white" />
            </div>
          </div>
        )}

        {/* Video Controls */}
        {showControls && (
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/40 via-transparent to-black/80">
            {/* Top Bar - Quality Indicator */}
            {isPlaying && (
              <div className="flex justify-between p-4">
                <div className="text-white text-sm font-medium bg-black/40 px-2 py-1 rounded">
                  {videoData?.quality || '1080p'}
                </div>
              </div>
            )}
            
            {/* Middle Area - Play Button */}
            <div className="flex-1 flex items-center justify-center" onClick={togglePlay}>
              {!isPlaying && (
                <div className="bg-black/60 rounded-full p-4 hover:scale-110 transition-transform">
                  <FiPlay size={32} className="text-white" />
                </div>
              )}
            </div>
            
            {/* Bottom Control Bar */}
            <div className="p-2 pt-0">
              {/* Progress Bar */}
              <div 
                className="relative h-3 group flex items-center cursor-pointer" 
                ref={progressBarRef}
                onClick={handleProgressBarClick}
                onMouseMove={handleProgressBarHover}
              >
                {/* Time Preview Tooltip */}
                {isHovering && (
                  <div 
                    className="absolute bottom-6 bg-black/90 text-white text-xs px-2 py-1 rounded transform -translate-x-1/2 pointer-events-none"
                    style={{ left: `${hoverPosition}px` }}
                  >
                    {formatTime(hoverTime)}
                  </div>
                )}
                
                <div className="absolute w-full h-1 bg-gray-600 group-hover:h-3 transition-all">
                  <div className="absolute h-full bg-gray-400" style={{ width: `${bufferedProgress}%` }} />
                  <div className="absolute h-full bg-blue-900" style={{ width: `${progress}%` }} />
                  {isHovering && (
                    <div 
                      className="absolute h-3 w-3 bg-blue-900 rounded-full transform -translate-x-1/2 top-1/2 -translate-y-1/2"
                      style={{ left: `${progress}%` }}
                    />
                  )}
                </div>
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-white hover:text-gray-300">
                    {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
                  </button>
                  
                  <button onClick={() => handleSkip(-10)} className="text-white hover:text-gray-300">
                    <div className="flex items-center">
                      <FiSkipBack size={18} />
                      <span className="text-xs ml-1">10</span>
                    </div>
                  </button>
                  
                  <button onClick={() => handleSkip(10)} className="text-white hover:text-gray-300">
                    <div className="flex items-center">
                      <FiSkipForward size={18} />
                      <span className="text-xs ml-1">10</span>
                    </div>
                  </button>
                  
                  <div className="relative flex items-center group">
                    <button 
                      onClick={toggleMute}
                      className="text-white hover:text-gray-300"
                    >
                      {isMuted || volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                    </button>
                    
                    {showVolumeSlider && (
                      <div className="absolute bottom-8 left-0 bg-black/80 p-2 rounded-md w-32">
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-full accent-blue-900"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-white text-sm">
                    {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(videoRef.current?.duration || 0)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white hover:text-gray-300"
                    >
                      <FiSettings size={20} className={`transition-transform ${showSettings ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {showSettings && (
                      <div className="absolute right-0 bottom-8 bg-black/90 rounded-md shadow-lg p-2 min-w-40 z-10">
                        <div className="text-white text-sm font-medium mb-2 px-2">Playback speed</div>
                        {playbackSpeeds.map(speed => (
                          <button 
                            key={speed} 
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`w-full text-left px-3 py-1.5 text-sm ${
                              playbackSpeed === speed ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800'
                            } rounded`}
                          >
                            {speed === 1 ? 'Normal' : `${speed}x`}
                            {playbackSpeed === speed && <span className="ml-2">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                    {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info Section */}
      <div className="mt-4">
        <h1 className="text-xl font-bold text-black">{videoData?.title}</h1>
        
        <div className="flex items-center text-gray-600 text-sm mt-2">
          <span>{videoData?.viewCount?.toLocaleString()} views</span>
          <span className="mx-1">•</span>
          <span>{formatRelativeTime(videoData?.createdAt)}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-4 pb-4 border-b border-gray-300">
          <button
            onClick={() => handleLikeStatus('like')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              likeStatus === 'like' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <FiThumbsUp className={likeStatus === 'like' ? 'text-blue-900' : 'text-gray-600'} />
            <span>{videoLikeCount}</span>
          </button>

          <button
            onClick={() => handleLikeStatus('dislike')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              likeStatus === 'dislike' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <FiThumbsDown className={likeStatus === 'dislike' ? 'text-blue-900' : 'text-gray-600'} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full">
            <FiShare2 />
            <span>Share</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full">
            <FiSave />
            <span>Save</span>
          </button>
          
          <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full">
            <FiMoreHorizontal />
          </button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex justify-between items-center mt-4 cursor-pointer" onClick={() => navigate(`/channel/${videoData.user._id}`)}>
        <div className="flex items-center gap-3">
          <img 
            src={profileImageUrl(videoData?.user?.avatar)} 
            alt={videoData?.user?.username} 
            className="w-10 h-10 rounded-full" 
          />
          <div>
            <div className="font-medium flex items-center gap-1 text-black">
              {videoData?.user?.username}
              {videoData?.user?.isVerified && <span className="text-blue-500 text-sm">✓</span>}
            </div>
            <div className="text-gray-600 text-sm">
              {subscribtionCount} subscribers
            </div>
          </div>
        </div>

        <button
          onClick={handleSubscription}
          className={`px-4 py-2 rounded-full font-medium ${
            isSubscribed ? 'bg-gray-200 hover:bg-gray-300 text-black' : 'bg-blue-900 hover:bg-blue-800 text-white'
          }`}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* Description */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <div className="text-sm text-gray-800 whitespace-pre-line">
          {expandedDescription 
            ? videoData?.description 
            : `${videoData?.description?.substring(0, 150)}${videoData?.description?.length > 150 ? '...' : ''}`
          }
          
          {videoData?.description?.length > 150 && (
            <button
              onClick={() => setExpandedDescription(!expandedDescription)}
              className="text-blue-900 ml-2 font-medium"
            >
              {expandedDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      
        {expandedDescription && videoData?.hashtags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {videoData.hashtags.map((tag, index) => (
              <span key={index} className="text-blue-900 text-sm hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;