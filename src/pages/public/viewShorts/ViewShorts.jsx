import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiMessageSquare, 
  FiShare2, 
  FiMoreVertical, 
  FiX, 
  FiChevronDown,
  FiSend
} from 'react-icons/fi';
import { BsEmojiSmile, BsMusicNote } from 'react-icons/bs';
import { IoMdMusicalNote } from 'react-icons/io';
import axiosInstance from '../../../axios/AxiosInstance';
import { profileImageUrl } from '../../../assets/constants/constant';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const CommentItem = React.memo(({ comment, onLike, formatTime, formatCount }) => (
  <div className="flex space-x-3 py-3 px-4 hover:bg-gray-900/50 transition-colors">
    <img 
      src={profileImageUrl(comment.user?.profileImage)} 
      alt={comment.user?.username}
      className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline space-x-2 mb-1">
        <p className="text-white text-sm font-semibold">{comment.user?.username}</p>
        <p className="text-gray-400 text-xs">{formatTime(comment.createdAt)}</p>
      </div>
      <p className="text-gray-200 text-sm mb-2">{comment.content}</p>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onLike(comment._id, comment.isLiked)}
          className={`flex items-center space-x-1 text-xs transition-colors ${
            comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FiHeart className="w-3.5 h-3.5" fill={comment.isLiked ? 'currentColor' : 'none'} />
          <span>{formatCount(comment.likeCount || 0)}</span>
        </button>
        <button className="text-gray-400 hover:text-white text-xs">
          Reply
        </button>
      </div>
    </div>
    <button className="text-gray-400 hover:text-white self-start">
      <BsEmojiSmile className="w-4 h-4" />
    </button>
  </div>
));

const ShortsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [short, setShort] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [commentCount, setCommentCount]  = useState(0)
  const { user } = useAuth();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchData = async (id) => {
    try {
      const response = await axiosInstance.get(`/video/${id}?userId=${user?._id}`);
      const videoData = response.data.data;
      setShort(videoData);
      setLikeCount(videoData.videoLikes || 0);
      setIsLiked(videoData.userLikeStatus === 'like');
      setCommentCount(videoData.commentCount);
    } catch (error) {
      console.error('Error fetching short:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/video/comments/${id}`);
      setComments(response.data || []);
      
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleShare = async() =>{

    if(navigator.share){
      navigator.share({
        title: short.title,
        text: short.description,
        url: `/shorts/${short._id}`
      }).catch((error) => toast.error('try again later'))
    }
  }

  useEffect(() => {
    if (!id || !user) return;
    fetchData(id);
  }, [id, user]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = async () => {
    try {
      const newLikeStatus = isLiked ? null : 'like';
      await axiosInstance.put(`/video/like/${id}`, {
        likeStatus: newLikeStatus,
        userId: user._id,
        videoId: short._id
      });
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleCommentLike = async (commentId, currentLikeStatus) => {
    try {
      await axiosInstance.put(`/video/comment/like/${commentId}`, {
        likeStatus: !currentLikeStatus
      });
      setComments(prev => prev.map(comment => 
        comment._id === commentId ? { 
          ...comment, 
          isLiked: !currentLikeStatus,
          likeCount: currentLikeStatus ? comment.likeCount - 1 : comment.likeCount + 1
        } : comment
      ));
    } catch (error) {
      console.error('Comment like error:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await axiosInstance.post(`/video/comment`, {
        content: newComment.trim(),
        video: id
      });
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Comment submission error:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatCount = useMemo(() => (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  }, []);

  const formatTime = useMemo(() => (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }, []);

  if (!short) return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black z-50 flex overflow-hidden">
      {/* Video Container */}
      <div className="flex-1 relative h-full flex justify-center">
        <video
          ref={videoRef}
          src={short.videoUrl}
          className="w-full md:w-[30%] h-full object-cover"
          loop
          muted={isMuted}
          autoPlay
          playsInline
          onClick={togglePlay}
        />

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 md:bottom-20 left-0 right-0 px-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <img 
                src={profileImageUrl(short.user?.avatar)} 
                alt={short.user?.username}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <p className="text-white font-semibold text-sm">@{short.user?.username}</p>
            </div>
            <p className="text-white text-sm mb-2">{short.description}</p>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <IoMdMusicalNote className="text-white w-4 h-4" />
                <p className="text-white text-xs">Original Sound</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="absolute right-2 bottom-28 flex flex-col items-center space-y-5">
          <div className="flex flex-col items-center">
            <button 
              onClick={handleLike}
              className="p-2 rounded-full cursor-pointer"
            >
              <FiHeart className={`w-7 h-7 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </button>
            <span className="text-white text-xs mt-1">{formatCount(likeCount)}</span>
          </div>

          <div className="flex flex-col items-center">
            <button 
              onClick={() => setShowComments(true)}
              className="p-2 text-white cursor-pointer"
            >
              <FiMessageSquare className="w-7 h-7" />
            </button>
            <span className="text-white text-xs mt-1">{formatCount(commentCount)}</span>
          </div>

          <button className="p-2 text-white">
            <FiShare2 className="w-7 h-7 cursor-pointer"  onClick={handleShare}/>
          </button>

          <button className="p-2 text-white">
            <FiMoreVertical className="w-7 h-7 cursor-pointer" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <button 
            onClick={toggleMute}
            className="p-2 bg-black/50 rounded-full text-white"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className={`absolute ${isMobile ? 'inset-0' : 'right-0 top-0 bottom-0 w-96'} bg-gradient-to-l from-black/80 to-black/30 backdrop-blur-sm z-20 flex flex-col`}>
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg">Comments</h3>
            <button 
              onClick={() => setShowComments(false)}
              className="text-white p-1 rounded-full hover:bg-gray-800/50"
            >
              {isMobile ? <FiChevronDown className="w-6 h-6" /> : <FiX className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem 
                  key={comment._id}
                  comment={comment}
                  onLike={handleCommentLike}
                  formatTime={formatTime}
                  formatCount={formatCount}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <FiMessageSquare className="w-12 h-12 text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm">No comments yet</p>
                <p className="text-gray-500 text-xs">Be the first to comment</p>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-black/90 p-4 border-t border-gray-800">
            <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800/50 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  newComment.trim() ? 'text-blue-500' : 'text-blue-400/50'
                }`}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortsView;