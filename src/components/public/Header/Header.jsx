import React, { useContext, useState, useEffect } from 'react';
import { Search, Menu, MessageSquare, MessageSquareDot } from 'lucide-react';
import { SidebarContext } from '../../../context/sideBarContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axios/AxiosInstance';
import { GoogleAuth } from '../../../assets/signupButton/SignupButton';
import { profileImageUrl } from '../../../assets/constants/constant';
import NotificationDropDown from '../../../assets/popups/Notification';
import { useNotifications } from '../../../context/notificationContext';
import { BsCheck2Circle, BsExclamationCircle } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import useOnlineStatus from '../../../hooks/useOnlineStatus';
import { toast } from 'react-toastify';
import ConnectionError from '../../../assets/popups/InternetStatus';

export const Header = () => {
  let { user } = useAuth();
  const { updateIsOpen, isOpen } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationPopup, setIsNotificationPopup] = useState(false);
  const {newNotification, setNewNotification} = useNotifications();
  const [showPopup, setShowPopup] = useState(false);
  // Debounce search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== '' && isSearchFocused) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isSearchFocused]);

  // Add this effect to close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showPopup) {
        setShowPopup(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPopup]);

  const fetchSuggestions = async () => {
    try {
      const response = await axiosInstance.get(`/video/search/suggestions?q=${searchQuery}`);
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    navigate(`/search?q=${encodeURIComponent(suggestion.title)}&type=${suggestion.type}`);  
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };


  const handleSignin = () => {
    
    GoogleAuth();
  };
  
  const handleCloseNotificationPopup = () =>{
    setIsNotificationPopup(false)
    return setNewNotification(null);
  }
  
  
  const handleRetry = () =>{
    console.log('retry')
  }
  return (
    <header className="p-4 border-b border-blue-200 sticky top-0 z-10 bg-white shadow-sm">
      {/* <ConnectionError 
        onRetry={handleRetry}
        retryText="Try Again"
        customMessage="No internet connection detected"
        autoRetry={true}
        retryInterval={3000}
      /> */}
      <div className="flex items-center justify-between">
        {/* Left side (menu and logo) */}
        <div className="flex items-center space-x-4">
          <Menu 
            className="w-6 h-6 cursor-pointer text-blue-900 hover:text-blue-700 transition-colors" 
            onClick={() => updateIsOpen(isOpen === "HALF" ? "FULL" : "HALF")}
          />
          <h1 
            onClick={() => navigate('/')} 
            className="cursor-pointer text-xl font-bold text-blue-900 hover:text-blue-700 transition-colors"
          >
            Info<span className="text-blue-600 text-sm">Tube</span>
          </h1>
        </div>
        
        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-4 relative">
          <div className="relative">
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsSearchFocused(true);
                if (searchQuery.trim() !== '') setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => {
                setIsSearchFocused(false);
                setShowSuggestions(false);
              }, 200)}
              onKeyDown={handleKeyDown}
              placeholder="Search for videos, channels..."
              className="w-full bg-gray-50 border border-blue-200 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 placeholder-blue-400"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-blue-400" />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-blue-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-blue-900 flex items-center transition-colors"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.type === 'channel' && (
                      <span className="mr-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        CHANNEL
                      </span>
                    )}
                    {suggestion.type === 'video' && (
                      <span className="mr-2 text-xs bg-blue-900 text-white px-2 py-1 rounded">
                        VIDEO
                      </span>
                    )}
                    {suggestion.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {isNotificationPopup && <NotificationDropDown onClose={handleCloseNotificationPopup}/>}
        
        
        {/* Right side (create button and user) */}
        <div className='flex gap-7 items-center'>

          <div className='relative'>
            {newNotification && <div className='bg-red-600 h-3 w-3 rounded-full z-10 absolute'></div>}
            
            <MessageSquare 
              onClick={()=> setIsNotificationPopup(prev => !prev)}
              className={`cursor-pointer none md: flex`}
            />
          </div>
          {/* create button */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(!showPopup);
            }}
            className="hidden px-4 py-2 md:flex items-center gap-1 bg-blue-900 text-white rounded-lg hover:bg-blue-800 cursor-pointer transition-colors shadow-md relative"
          >
            Create <span className='relative bottom-0.5 font-bold text-lg'>+</span>
            
            {showPopup && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/upload-video/${user?._id}`);
                    setShowPopup(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 rounded-t-md"
                >
                  Upload Video
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/live1');
                    setShowPopup(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 rounded-b-md"
                >
                  Instant Live
                </button>
              </div>
            )}
          </div>
          
          {user ? (
            <div 
              className='rounded-full w-[35px] h-[35px] bg-blue-500 cursor-pointer overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-colors shadow-md'
              onClick={() => navigate(`/channel/${user._id}`)}
            >
              <img 
                src={profileImageUrl(user.profileImage)} 
                className='rounded-full w-full h-full object-cover' 
                alt="Profile" 
              />
            </div>
          ) : (
            <button 
              onClick={handleSignin}
              className="px-4 py-2 bg-blue-900 rounded-lg hover:bg-blue-800 text-white transition-colors shadow-md"
            >
              Sign In
            </button>
          )}
        </div>
      { newNotification && <NewNotificationPopup popupNotification={newNotification} onClose={setNewNotification}/>}
      </div>
    </header>
  );
};

function NewNotificationPopup({popupNotification, onClose}){

  const handleClick = () =>{

  }

  return (
    <div 
      className="fixed bottom-4 right-4 w-80 p-4 rounded-lg bg-white shadow-lg border border-gray-200 z-50 cursor-pointer transform transition-all duration-300 animate-fadeInUp"
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="mt-1">
            {popupNotification.type === "upload" ? (
                <BsCheck2Circle className="text-green-500" size={18} />
            ) : (
                <BsExclamationCircle className="text-yellow-500" size={18} />
            )}
        </div>
        <div className="flex-1">
            <h3 className="font-medium text-gray-800">{popupNotification.title}</h3>
            <p className="text-sm text-gray-600">{popupNotification.message}</p>
            <p className="text-xs text-gray-400 mt-1">Just now</p>
        </div>
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onClose(null)
            }}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
            <IoClose size={16} />
        </button>
      </div>
    </div>
  )
}
export default Header;

