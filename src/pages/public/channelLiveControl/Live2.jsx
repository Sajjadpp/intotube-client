


import React, { useEffect, useRef, useState } from 'react';
import { connectSocket, getSocket } from '../../../socket/socket';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUser, FiMessageSquare, FiHeart, FiShare2 } from 'react-icons/fi';
import { formatDuration } from '../../../assets/VideoCard/VideoCard';

const LiveViewerPage = () => {
  const [liveStatus, setLiveStatus] = useState(false);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [streamerInfo, setStreamerInfo] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamEnded, setStreamEnded] = useState(true);
  const [streamData, setStreamData] = useState(0);
  
  const peer = useRef(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const chatContainerRef = useRef();
  const processingOffer = useRef(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { streamerId } = useParams();
  const socket = getSocket();

  // Authentication check
  useEffect(() => {
    if (user === 0) return;
    if (!user) {
      toast.error('Please login to view this stream');
      navigate('/');
    }
  }, [user, navigate]);

  // Socket connection check
  useEffect(() => {
    if (!socket) return;
    setIsSocketReady(true);
  }, [socket]);

  // Join stream when socket is ready
  useEffect(() => {
    if (!isSocketReady || !user || !streamerId) return;
    
    setStreamEnded(false);
    socket.emit('viewer-join', {
      from: user._id,
      to: streamerId
    });
  }, [isSocketReady, user, streamerId]);

  // Main WebRTC and socket logic
  useEffect(() => {
    if (!isSocketReady || !user || !streamerId) return;

    const handleSignal = async ({ from, type, sdp, candidate }) => {
      if (type === 'offer') {
        if (processingOffer.current) {
          console.log('Already processing an offer, ignoring duplicate');
          return;
        }
        
        processingOffer.current = true;
        console.log('Received offer from streamer');
        
        try {
          // Clean up previous connection if exists
          if (peer.current) {
            peer.current.close();
          }
          
          // Create new peer connection
          peer.current = new RTCPeerConnection({
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' }
            ]
          });

          // Handle remote stream
          peer.current.ontrack = (event) => {
            console.log('Received remote stream tracks');
            if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
              remoteVideoRef.current.srcObject = event.streams[0];
              setLiveStatus(true);
            }
          };

          // Set remote description
          await peer.current.setRemoteDescription(new RTCSessionDescription(sdp));
          
          // Create and send answer
          const answer = await peer.current.createAnswer();
          await peer.current.setLocalDescription(answer);

          socket.emit('signal', {
            to: from,
            from: user._id,
            type: 'answer',
            sdp: answer
          });
        } catch (err) {
          console.error('Error handling offer:', err);
        } finally {
          processingOffer.current = false;
        }
      }

      if (type === 'candidate' && candidate && peer.current) {
        try {
          await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    const handleViewerCount = (count) => {
      setViewerCount(count);
    };

    const handleNewComment = (comment) => {
      setComments(prev => [...prev, comment]);
    };

    const handleStreamEnded = () => {
      toast.info('The stream has ended');
      setLiveStatus(false);
      setStreamEnded(true);
      if (peer.current) {
        peer.current.close();
        peer.current = null;
      }
    };

    socket.on('signal', handleSignal);
    socket.on('viewer-count', handleViewerCount);
    socket.on('new-comment', handleNewComment);
    socket.on('stream-ended', handleStreamEnded);

    // Cleanup
    return () => {
      socket.off('signal', handleSignal);
      socket.off('viewer-count', handleViewerCount);
      socket.off('new-comment', handleNewComment);
      socket.off('stream-ended', handleStreamEnded);
      
      if (peer.current) {
        peer.current.close();
      }
    };
  }, [isSocketReady, user, streamerId]);

  // Handle sending comments
  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      streamerId: streamerId,
      senderId: user._id,
      comment: newComment,
      timestamp: new Date().toLocaleTimeString()
    };
    
    socket.emit('send-comment', comment);
    setNewComment('');
  };

  // Toggle mute
  const toggleMute = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      remoteVideoRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Live Stream</h1>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main Video Player */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-xl aspect-video">
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />

            {/* Stream Info Overlay - shows in all states */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
                <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                    {streamerInfo?.avatar ? (
                        <img 
                        src={streamerInfo.avatar} 
                        alt={streamerInfo.username} 
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="bg-gray-400 w-full h-full flex items-center justify-center">
                        <FiUser className="text-white text-xl" />
                        </div>
                    )}
                    </div>
                    <div>
                    <h2 className="text-white font-semibold">
                        {streamerInfo?.username || 'Streamer'}
                    </h2>
                    <p className="text-white/80 text-sm">
                        {streamEnded ? (
                        <>
                            Stream ended • {formatDuration(streamData?.streamDuration)} • {streamData?.peakViewers} peak viewers
                        </>
                        ) : liveStatus ? (
                        <>
                            LIVE • {streamData?.viewerCount} viewers
                        </>
                        ) : (
                        <>
                            {isSocketReady ? 'Connecting...' : 'Offline'}
                        </>
                        )}
                    </p>
                    </div>
                </div>
                {liveStatus && (
                    <div className="flex space-x-2">
                    <button 
                        onClick={toggleMute}
                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                    <button 
                        onClick={toggleFullscreen}
                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
                    >
                        {isFullscreen ? '⤢' : '⤡'}
                    </button>
                    </div>
                )}
                </div>
            </div>

            {/* Main Content State */}
            {streamEnded ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-center p-6 max-w-md">
                    <div className="bg-red-600 text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                    STREAM ENDED
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                    Thanks for watching!
                    </h3>
                    <p className="text-white/80 mb-6">
                    {streamerInfo?.endMessage || "The stream has ended. See you next time!"}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                        Watch Replay
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                        Follow Channel
                    </button>
                    </div>
                    
                    
                  
                </div>
                </div>
            ) : !liveStatus && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center p-6">
                    <div className="animate-pulse">
                    {streamerInfo ? (
                        <>
                        <h3 className="text-xl font-bold text-white mb-2">
                            {streamerInfo.username}'s Stream
                        </h3>
                        <p className="text-white/80 mb-4">
                            {streamerInfo.title}
                        </p>
                        </>
                    ) : (
                        <h3 className="text-xl font-bold text-white mb-4">
                        Stream Information
                        </h3>
                    )}
                    <div className="text-white">
                        {isSocketReady ? 'Connecting to stream...' : 'Connecting to server...'}
                    </div>
                    </div>
                </div>
                </div>
            )}
            </div>

          {/* Stream Info */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">
              {streamerInfo?.title || 'Live Stream'}
            </h2>
            <p className="text-gray-700">
              {streamerInfo?.description || 'Join us for this live session!'}
            </p>
          </div>
        </div>

        {/* Chat Column */}
        <div className="space-y-4">
          {/* Live Chat */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-200px)] flex flex-col">
            <div className="bg-blue-600 text-white p-3 font-medium flex justify-between items-center">
              <span>Live Chat</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded">
                {comments.length} messages
              </span>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-3"
            >
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="flex space-x-2">
                    <div className="font-semibold text-blue-600 min-w-[60px]">
                      {comment.senderId}:
                    </div>
                    <div>
                      <p>{comment.comment}</p>
                      <p className="text-xs text-gray-500">{comment.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No messages yet
                </div>
              )}
            </div>
            
            {/* Comment Form */}
            <form 
              onSubmit={handleSendComment}
              className="border-t border-gray-200 p-3"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!liveStatus}
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg disabled:opacity-50"
                  disabled={!liveStatus}
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Interaction Buttons */}
          <div className="bg-white p-4 rounded-lg shadow space-y-3">
            <button className="flex items-center justify-center space-x-2 w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
              <FiHeart className="text-lg" />
              <span>Like</span>
            </button>
            <button className="flex items-center justify-center space-x-2 w-full py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
              <FiShare2 className="text-lg" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveViewerPage;