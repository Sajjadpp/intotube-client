import React from 'react'
import ChannelCard from './ChannelCard';
import VideoCard from './VideoCard';


const videos = [
    {
        _id: 'new mongoose.Types.ObjectId("607f1f77bcf86cd799439021")',
        user: {
        _id: 'new mongoose.Types.ObjectId("507f1f77bcf86cd799439011")',
        name: "Alex Johnson",
        username: "alexj",
        email: "alex@example.com",
        profileImage: "https://example.com/profiles/alex.jpg"
        },
        title: "Python Crash Course for Beginners",
        description: "Learn Python basics in 30 minutes",
        thumbnailUrl: "http://localhost:4000/thumbnails/thumbnail-1745042084735-32880355.jpg",
        filePath: "/videos/python-course.mp4",
        videoUrl: "https://example.com/videos/python-course.mp4",
        duration: 1800, // 30 minutes
        size: 350000000, // 350MB
        category: "education",
        visibility: "public",
        status: "active",
        viewCount: 25400,
        likeCount: 2100,
        dislikeCount: 45,
        hashtags: ["python", "programming", "tutorial"],
        comments: []
    },
    {
        _id: 'new mongoose.Types.ObjectId("607f1f77bcf86cd799439022")',
        user: {
        _id: 'new mongoose.Types.ObjectId("507f1f77bcf86cd799439012")',
        name: "Maria Garcia",
        username: "mariacooks",
        email: "maria@example.com",
        profileImage: "https://example.com/profiles/maria.jpg"
        },
        title: "Authentic Tacos al Pastor",
        description: "Traditional Mexican street tacos recipe",
        thumbnailUrl: "http://localhost:4000/thumbnails/thumbnail-1746081898812-175120721.jpg",
        filePath: "/videos/tacos-recipe.mp4",
        videoUrl: "https://example.com/videos/tacos-recipe.mp4",
        duration: 1200, // 20 minutes
        size: 280000000, // 280MB
        category: "cooking",
        visibility: "public",
        status: "active",
        viewCount: 18700,
        likeCount: 3200,
        dislikeCount: 28,
        hashtags: ["mexicanfood", "tacos", "recipe"],
        comments: []
    },
    {
        _id: 'new mongoose.Types.ObjectId("607f1f77bcf86cd799439023")',
        user: {
        _id: 'new mongoose.Types.ObjectId("507f1f77bcf86cd799439013")',
        name: "Tech Reviews",
        username: "techguru",
        email: "tech@example.com",
        profileImage: "https://example.com/profiles/techguru.jpg"
        },
        title: "iPhone 15 Pro Max Review",
        description: "Full review of Apple's latest flagship phone",
        thumbnailUrl: "http://localhost:4000/thumbnails/thumbnail-1745042084735-32880355.jpg",
        filePath: "/videos/iphone-review.mp4",
        videoUrl: "https://example.com/videos/iphone-review.mp4",
        duration: 1500, // 25 minutes
        size: 420000000, // 420MB
        category: "tech",
        visibility: "public",
        status: "active",
        viewCount: 43200,
        likeCount: 3800,
        dislikeCount: 150,
        hashtags: ["iphone", "review", "apple"],
        comments: []
    }
];

const SearchVideoGrid = ({videos}) => {

    return (
        <main className='w-full min-h-svh pb-10 grid gap-4'>
            
            {videos.map(item => (
                item.type === 'channel' ? (
                    <ChannelCard 
                    key={`channel-${item._id}`}
                    channel={item}
                    />
                ) : (
                    <VideoCard 
                    key={`video-${item._id}`}
                    video={item}
                    />
                )
                ))
            }
        </main>
    )
}

export default SearchVideoGrid
