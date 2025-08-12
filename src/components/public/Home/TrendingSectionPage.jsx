import { TrendingUp } from "lucide-react";
import { VideoCard } from "../../../assets/VideoCard/VideoCard";

const TrendingSection = ({ videos=[] }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
        <h2 className="text-2xl font-bold text-blue-900">Trending Now</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video, i) => (
          <VideoCard key={i} video={video} size="normal" />
        ))}
      </div>
    </section>
  );
};

export default TrendingSection