import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../axios/AxiosInstance';
import { profileImageUrl, userProfileImg } from '../../../../assets/constants/constant';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Comments = ({ comments, setComments, videoId, setVideoFocus }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const commentRefs = useRef({});

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const commentId = params.get("commentId");

    if (commentId && commentRefs.current[commentId]) {
      // Expand parent if it's a reply
      const parent = comments.find(c =>
        c.replies?.some(r => r._id?.toString() === commentId)
      );
      if (parent) {
        setExpandedComments(prev => ({ ...prev, [parent._id]: true }));
      }

      // Scroll and highlight after DOM render
      setTimeout(() => {
        const el = commentRefs.current[commentId];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring", "ring-blue-500");
          setTimeout(() => {
            el.classList.remove("ring", "ring-blue-500");
          }, 2000);
        }
      }, 500);
    }
  }, [comments, location]);

  const handleAddComment = async (e) => {

    e.preventDefault();
    if (!newComment.trim()) return;
    if(!user){
      toast.error('please login and comment')
    }
    
    try {
      const response = await axiosInstance.post('/video/comment', {
        content: newComment,
        video: videoId,
        user: user._id
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);

    }
  };

  const handleAddReply = async (parentId, e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    try {
      const response = await axiosInstance.post('/video/comment', {
        content: replyContent,
        video: videoId,
        parentComment: parentId,
        user: user._id
      });

      setComments(comments.map(comment => {
        if (comment._id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data]
          };
        }
        return comment;
      }));

      setExpandedComments(prev => ({ ...prev, [parentId]: true }));
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const renderComment = (comment, depth = 0) => {
    const isReplying = replyingTo === comment._id;
    const hasReplies = comment.replies?.length > 0;
    const isExpanded = expandedComments[comment._id];

    return (
      <div 
        key={comment._id}
        ref={el => commentRefs.current[comment._id] = el}
        className={`mb-4 ${depth > 0 ? 'md:pl-6 border-l-2 border-gray-300' : ''}`}
      >
        <div className="flex items-start gap-3">
          <img
            src={profileImageUrl(comment.user?.profileImage) || '/default-avatar.png'}
            alt={comment.user?.username}
            className="w-8 h-8 rounded-full"
          />
          
          <div className="flex-1 min-w-0">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium text-black">
                  {comment.user?.username || 'Anonymous'}
                </span>
                <span className="text-xs text-gray-600">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="mt-1 text-gray-800">{comment.content}</p>
              
              <div className="mt-2 flex items-center gap-4 text-sm">
                <button className="text-gray-600 hover:text-black">
                  Like ({comment.likeCount || 0})
                </button>
                
                {!comment.parentComment && (
                  <button 
                    className="text-gray-600 hover:text-black"
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  >
                    Reply
                  </button>
                )}

                {hasReplies && !depth && (
                  <button
                    className="text-gray-600 hover:text-black"
                    onClick={() => toggleReplies(comment._id)}
                  >
                    {isExpanded ? 'Hide replies' : `Show replies (${comment.replies.length})`}
                  </button>
                )}
              </div>
            </div>

            {isReplying && (
              <form onSubmit={(e) => handleAddReply(comment._id, e)} className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-2 text-sm bg-white text-black border border-gray-300 rounded-lg"
                  rows="2"
                  required
                  onClick={() => setVideoFocus(false)}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                  >
                    Post Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {hasReplies && (depth === 0) && isExpanded && (
          <div className="mt-3 space-y-3">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mt-8 md:mr-28 bg-white p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-black mb-4">
        Comments ({comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0)})
      </h2>
      
      <form onSubmit={handleAddComment} className="mb-6">
        {console.log(user)}
        <div className="flex items-start gap-3">
          <img
            src={user ? profileImageUrl(user?.profileImage) : userProfileImg()}
            alt={user?.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onClick={() => setVideoFocus(false)}
              placeholder="Add a comment..."
              className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg"
              rows="3"
              required
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.filter(c => !c.parentComment).map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-6 text-gray-600">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </section>
  );
};

export default Comments;