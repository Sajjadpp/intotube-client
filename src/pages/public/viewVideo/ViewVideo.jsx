import React, { useContext, useEffect, useState } from 'react';
import Comments from '../../../components/public/viewPage/comments/Comments';
import Recommended from '../../../components/public/viewPage/recomended/Recomented';
import Video from '../../../components/public/viewPage/video/Video';
import { SidebarContext } from '../../../context/sideBarContext';
import { Navigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../axios/AxiosInstance';
import { useAuth } from '../../../context/AuthContext';

const ViewVideo = () => {
  const { id } = useParams();
  const { updateIsOpen, isOpen } = useContext(SidebarContext);
  const [videoFocus, setVideoFocus] = useState(true);
  const {user} = useAuth()
  // Combined data state
  const [data, setData] = useState({
    video: null,
    comments: [],
    recommended: [],
    loading: true,
    error: null
  });

  // Fetch all data in one effect
  useEffect(() => {
    console.log(user === 0,'user sss')
    if(user === 0) return 
    const fetchData = async () => {
      try {
        updateIsOpen("CLOSE");
        console.log(id,"is")
        const [videoRes, commentsRes, recommendedRes] = await Promise.all([
          axiosInstance.get(`/video/${id}`,{
            params:{userId: user?._id ?? null}
          }),
          axiosInstance.get(`/video/comments/${id}`),
          axiosInstance.get(`/video/recommended/${id}`)
        ]);

        setData({
          video: videoRes.data.data,
          comments: commentsRes.data,
          recommended: recommendedRes.data,
          loading: false,
          error: null
        });
        let videoType = videoRes.data.data.videoType
        if(videoType === 'shorts'){
          Navigate(`/shorts/${data.video._id}`);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load video data'
        }));
      }
    };

    fetchData();

    
  }, [id, updateIsOpen, user]);

  if (data.loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (data.error || !data.video) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-black">
        <p>{data.error || 'Video not found'}</p>
      </div>
    );
  }


  return (
    <main className="flex flex-col md:flex-row w-full min-h-screen p-4 md:p-8 gap-6 bg-white text-black">
      {/* Primary Content Section */}
      <section className="w-full md:w-2/3 space-y-6">
        <Video 
          videoData={data.video} 
          setVideoFocus={setVideoFocus} 
          videoFocus={videoFocus}
        />
        <Comments
          comments={data.comments}
          setComments={(newComments) => setData(prev => ({
            ...prev,
            comments: newComments
          }))}
          videoId={id}
          setVideoFocus={setVideoFocus}
          videoFocus={videoFocus}q
        />
      </section>

      {/* Recommended Videos Sidebar */}
      <aside className="w-full md:w-1/3">
        <Recommended videos={data.recommended} currentVideoId={id} />
      </aside>
    </main>
  );
};

export default ViewVideo;