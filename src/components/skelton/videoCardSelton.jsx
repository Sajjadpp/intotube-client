import React from 'react'
const VideoCardSelton = () => {
  return (
    <div className="text-center py-10 text-gray-300">
      <div className="cursor-pointer group">
        {/* Thumbnail Skeleton */}
        <div className="relative overflow-hidden rounded-xl aspect-video">
          <div className="w-full h-full bg-gray-300 animate-pulse rounded-xl"></div>
        </div>

        {/* Info Section Skeleton */}
        <div className="flex mt-3 gap-3">
          {/* Avatar Skeleton */}
          <div className="w-9 h-9 rounded-full bg-gray-400 animate-pulse"></div>

          <div className="flex-1 space-y-2">
            {/* Title Skeleton */}
            <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
            {/* Username Skeleton */}
            <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
            {/* Metadata Skeleton */}
            <div className="h-3 bg-gray-300 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCardSelton
