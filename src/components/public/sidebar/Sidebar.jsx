import { Home, Grid, Clock, Heart, ThumbsUp, Upload , Youtube} from 'lucide-react';
import {BiSolidVideos} from 'react-icons/bi'
import { useContext } from 'react';
import { SidebarContext } from '../../../context/sideBarContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import UserNotFoundCard from '../../../assets/popups/UserNotFound';
import { useEffect } from 'react';

const Sidebars = () => {
  const { isOpen, updateIsOpen } = useContext(SidebarContext);
  const [noUserPopup, setNoUserPopup] = useState(false)
  const navigate = useNavigate('')
  const {user} = useAuth()
  const [icons, setIcons] = useState([
    { icon: Home, name: "Home", open: true , link:"/" },
    { icon: BiSolidVideos, name: "Shorts", open: false , link:"/shorts/507f1f77bcf86cd799439011"},
    { icon: Clock, name: "Recent", open: false , link:"feed/history"},
    { icon: Heart, name: "Favorites", open: false , link:"/"},
    { icon: ThumbsUp, name: "Liked", open: false , link:"/"},
    { icon: Upload, name: "Upload", open: false , link:`upload-video/${user?._id}`}
  ]);

  useEffect(() => {
  let newIndex = 1;
  
  switch(location.pathname) {
    case '/':
      newIndex = 0;
      break;
    case "/shorts":
      newIndex = 1;
      break;
    case "/feed": 
      newIndex = 2;
      break;
    default:
      newIndex = 1;
  }
  
  setIcons(prevIcons => 
    prevIcons.map((icon, i) => ({
      ...icon,
      open: i === newIndex
    }))
  );
}, [location.pathname]);

  useEffect(()=>{

    if(!user) return 
    console.log('user entered', user._id)
    setIcons(prev=> 
      prev.map(icon => icon.name === 'upload' ? {...icon, link:`upload-video/${user._id}`} : icon)
    )
  },[user])
  
  const handleClick = (clickedIndex) => {
    if(clickedIndex === 5 && !user){

      return setNoUserPopup(true)
    }
    setIcons(prevIcons => 
      prevIcons.map((icon, index) => ({
        ...icon,
        open: index === clickedIndex
      }))
    );
    updateIsOpen('CLOSE')
    navigate(icons[clickedIndex].link);
  };
  return (
    <aside className={`
      fixed lg:sticky 
      top-0 left-0 
      bg-white border-r border-blue-200 
      h-screen transition-all duration-300 ease-in-out
      shadow-sm z-2
      ${isOpen === "FULL" ? 'translate-x-0 w-[230px]' : '-translate-x-full w-[230px] lg:w-0'}
      ${isOpen === "FULL" ? 'opacity-100' : 'opacity-0 lg:opacity-100'}
    `}>
      <div className="flex flex-col items-center py-6 space-y-2 w-full h-full overflow-hidden mt-20 ">
        {icons.map((obj, index) => {
          const Icon = obj.icon;
          return (
            <div
              key={index}
              className={`
                flex items-center 
                w-[90%] py-3 px-3 
                transition-all duration-300 
                hover:bg-blue-50 rounded-lg 
                cursor-pointer group 
                ${obj.open ? 'bg-blue-900 text-white hover:bg-blue-800' : 'text-blue-900'}
                ${isOpen !== "FULL" ? 'lg:opacity-0 lg:invisible' : ''}
              `}
              onClick={()=> handleClick(index)}
            >
              <div className={`flex justify-center items-center ${isOpen === "FULL" ? 'w-6' : 'w-full'}`}>
                <Icon className={`w-6 h-6 transition-colors ${obj.open ? 'text-white' : 'text-blue-600 group-hover:text-blue-800'}`} />
              </div>
              {isOpen === "FULL" && (
                <span className={`text-sm font-medium ml-4 transition-colors ${obj.open ? 'text-white' : 'text-blue-900 group-hover:text-blue-800'}`}>
                  {obj.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
      { noUserPopup && <UserNotFoundCard setNoUserPopup={setNoUserPopup}/>}
    </aside>
  );
};

export default Sidebars;