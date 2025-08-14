import React, { useRef, useState, useEffect } from 'react';
import { getSocket } from '../../../socket/socket';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const LiveStreamerPage = () => {
  const [liveStatus, setLiveStatus] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [comment, setComment] = useState([]);

  const streamRef = useRef(null);
  const videoRef = useRef();
  const previewRef = useRef();
  const peerConnections = useRef({}); // Store all peer connections
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = getSocket();

  console.log(peerConnections,'peer connections');

  // Authentication check
  useEffect(() => {
    if (user === 0) return;
    if (!user) {
      toast.error('Please login to start streaming');
      navigate('/');
    }
  }, [user, navigate]);

  // Socket connection
  useEffect(() => {
    if (!socket) return;
    setIsSocketReady(true);

    return () => {
      // Cleanup all peer connections
      Object.values(peerConnections.current).forEach(peer => peer.close());
    };
  }, [socket]);

  // Start streaming
  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      streamRef.current = stream;
      setLiveStatus(true);
      
      if (videoRef.current) videoRef.current.srcObject = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        previewRef.current.muted = true;
      }

      // Notify server streaming started
      socket.emit('stream-started', {
        streamerId: user._id,
        title: `${user.username}'s Live Stream`
      });

    } catch (err) {
      console.error('Stream error:', err);
      toast.error('Could not access camera/microphone');
    }
  };

  // Handle viewer connections
  useEffect(() => {
    if (!isSocketReady || !streamRef.current)  return console.log(isSocketReady ?'socket not ready ' : 'streamRef.current not ready', streamRef);

    console.log('all ready and working well')

    // New viewer wants to join
    socket.on('viewer-join', async (viewerId) => {
      console.log(`New viewer joining: ${viewerId}`);

      // Create new peer connection
      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          {
            urls: 'relay1.expressturn.com:3480',
            username: '000000002070527019',
            credential: 'CZ1M3MvZgZaGiPoVqYpNHeFnHWc='
          }
        ]
      });
      
      // Store the connection
      peerConnections.current[viewerId] = peer;
      setViewerCount(prev=> prev+1);

      // Add all tracks to the connection
      streamRef.current.getTracks().forEach(track => {
        peer.addTrack(track, streamRef.current);
      });

      // ICE Candidate handling
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('signal', {
            to: viewerId,
            from: user._id,
            type: 'candidate',
            candidate: event.candidate
          });
        }
      };

      // Create offer
      try {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socket.emit('signal', {
          to: viewerId,
          from: user._id,
          type: 'offer',
          sdp: offer
        });
      } catch (err) {
        console.error('Error creating offer:', err);
      }
    });

    // Viewer left
    socket.on('viewer-left', (viewerId) => {
      if (peerConnections.current[viewerId]) {
        peerConnections.current[viewerId].close();
        delete peerConnections.current[viewerId];
        setViewerCount(prev => prev - 1);
      }
    });

    // Update viewer count
    socket.on('viewer-count', (count) => {
      setViewerCount(count);
    });

    // handle comment adding
    socket.on("add-comment", (comment)=>{
        console.log('comment is adding...')
        setComment(comment)
        socket.emit('add-comment', {...comment, viewers: Object.keys(peerConnections.current)})
    })


    // Handle answers from viewers
    socket.on('signal', async ({ from, type, sdp }) => {
      if (type === 'answer') {
          const peer = peerConnections.current[from];
          console.log(sdp,' sdp ', peer," peer")
        if (peer) {
          try {
            await peer.setRemoteDescription(new RTCSessionDescription(sdp));
          } catch (err) {
            console.error('Error setting remote description:', err);
          }
        }
      }
    });

    return () => {
      socket.off('viewer-join');
      socket.off('viewer-left');
      socket.off('viewer-count');
      socket.off('signal');
    };
  }, [isSocketReady, user, streamRef.current]);

  // Stop streaming
  const stopLive = () => {
    setLiveStatus(false);
    setViewerCount(0);
    let viewers = Object.keys(peerConnections.current);
    // Close all peer connections
    Object.values(peerConnections.current).forEach(peer => peer.close());
    peerConnections.current = {};

    // Stop media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) videoRef.current.srcObject = null;
    if (previewRef.current) previewRef.current.srcObject = null;

    // Notify server
    socket.emit('stream-ended', { streamerId: user._id , viewers});
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Live Stream Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              <span>{viewerCount} viewers</span>
            </div>
            <button
              onClick={liveStatus ? stopLive : startLive}
              className={`px-4 py-2 rounded-lg font-medium ${
                liveStatus
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {liveStatus ? 'End Stream' : 'Go Live'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stream */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-black rounded-xl overflow-hidden shadow-xl aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {liveStatus ? (
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg">
                  LIVE
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                  <div className="text-center p-6">
                    <h3 className="text-xl font-bold mb-2">Your Live Stream</h3>
                    <p>Click "Go Live" to start broadcasting</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stream Info */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">
                {user?.username || 'Streamer'}'s Broadcast
              </h2>
              <p className="text-gray-700">
                {liveStatus 
                  ? `Streaming to ${viewerCount} viewers` 
                  : 'Offline - Not currently streaming'}
              </p>
            </div>
          </div>

          {/* Preview and Connections */}
          <div className="space-y-4">
            {/* Preview */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Your Camera</h3>
              <video
                ref={previewRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg aspect-video bg-gray-200"
              />
            </div>

            {/* Active Connections */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-3">Viewers ({viewerCount})</h3>
              {viewerCount > 0 ? (
                <div className="space-y-2">
                  {Object.keys(peerConnections.current).map(viewerId => (
                    <div key={viewerId} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Viewer {viewerId.slice(0, 6)}...</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No active viewers</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveStreamerPage;