import React, { useContext, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../axios/AxiosInstance';
import FeaturedSectionPage from '../../../components/public/Home/FeaturedSectionPage';
import TrendingSection from '../../../components/public/Home/TrendingSectionPage';
import RecommendedSectionPage from '../../../components/public/Home/RecommendedSectionPage';
import CategoryBar from '../../../components/public/Home/CategoryBar';
import FeaturedSectionSkeleton from '../../../components/skelton/FeaturedsectionSkelton';
import ShortsComponent from '../../../components/public/Home/ShortsPage';


const HomePage = () => {
  const [videos, setVideos] = useState({
    trending:[],
    recommended:[],
    featured:[],
    shorts:[]
  });
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'All', 'Network', 'Sports', 'Educational', 'Music', 'Gaming', 'News', 'Entertainment', 'Technology', 'Lifestyle'
  ];

  // Mock data for demonstration
  useEffect(() => {
    
    fetchVideo()
  },[]);

  const fetchVideo = async() =>{

    try{
      let responses = await axiosInstance.get('/video/homepage');
      
      console.log(responses.data, 'old data gau')
      setVideos(responses.data)
    }
    catch(error){
      console.log(error);
      
    }
  }

  return (
    <div className="flex-1 relative bg-white px-4 sm:px-6 py-8 w-full max-w-screen-2xl mx-auto overflow-x-hidden">
  <CategoryBar categories={categories} />
  
  
    <>
      {console.log(videos.recommended,"recommented")}
      {videos.featured ? <FeaturedSectionPage videos={videos.featured} /> : <FeaturedSectionSkeleton/>}
      <ShortsComponent shorts={videos.shorts}/>
      {videos.trending ? <TrendingSection videos={videos.trending} /> : <FeaturedSectionSkeleton/>}
      {videos.recommended ? <RecommendedSectionPage videos={[...videos.recommended]} /> : <FeaturedSectionSkeleton/>}
    </>
 
  
  {showPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Welcome!</h3>
        <p className="text-gray-600 mb-6">Complete your profile to get personalized recommendations.</p>
        <button 
          onClick={() => setShowPopup(false)}
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )}
</div>
  );
};

export default HomePage;