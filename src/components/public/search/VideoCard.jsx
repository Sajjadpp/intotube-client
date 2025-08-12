import { formatRelativeTime } from '../../../service/formatDate';
import userImage from '../../../assets/images/user-3296.png';
import { useNavigate } from 'react-router-dom';
import { profileImageUrl } from '../../../assets/constants/constant';

const VideoCard = ({ video }) => {
    const navigate = useNavigate();

    const handleChannelNavigation = (e) =>{
        e.stopPropagation();
        navigate(`/channel/${video.channel._id}`)
    }
    
    return (
        <div 
            className="w-full flex h-[280px] cursor-pointer bg-white hover:bg-gray-50 rounded-lg"
            onClick={() => navigate(`/video/${video._id}`)}
        >
            {/* Thumbnail container - fixed aspect ratio */}
            <div className="w-3/7 flex-shrink-0 hover:rounded-sm">
                <div className="h-full w-full overflow-hidden">
                    <img
                        src={video.thumbnailUrl}
                        className="w-full h-full object-cover hover:rounded-none rounded-lg"
                        alt="Video thumbnail"
                    />
                </div>
            </div>

            {/* Content container */}
            <div className="w-3/7 p-3 flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold line-clamp-2 text-gray-900 text-xl">{video.title}</h3>
                    <p className="text-sm text-gray-600 font-semibold">
                        {video.viewCount} views &nbsp; • {formatRelativeTime(video.createdAt)}
                    </p>
                    <div className='pt-5 flex gap-3 items-center' onClick={handleChannelNavigation}>
                        <img 
                            src={profileImageUrl(video?.channel?.profileImage)} 
                            width={30} 
                            height={30} 
                            alt="Channel avatar" 
                            className="rounded-full"
                        />
                        <h5 className='text-sm font-semibold text-gray-700'>{video.channel.username}</h5>
                    </div>
                    <p className='text-gray-600 text-sm font-semibold mt-5 ml-2 line-clamp-2'>
                        {video.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;