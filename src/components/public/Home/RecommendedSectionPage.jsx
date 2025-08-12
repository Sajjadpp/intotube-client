import { Star } from "lucide-react";
import { VideoCard } from "../../../assets/VideoCard/VideoCard";

const RecommendedSection = ({ videos=[] }) => {
    console.log(videos,'recommended')
  return (
    
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="flex items-center mb-6">
        <Star className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-blue-900">Recommended for You</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {videos.map((video, i) => (
          <VideoCard key={i} video={video} size="large" />
        ))}
      </div>
    </section>
  );
};
export default RecommendedSection;