import React from 'react';
import ShortsCard from '../../../assets/shortsCard/ShortsCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ShortsComponent = ({shorts}) => {
  // Mock data - replace with actual API data
  
  return (
    <div className="bg-white px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900">Shorts</h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FiChevronLeft className="w-5 h-5 text-black" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FiChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {shorts?.map((short) => (
            <ShortsCard key={short.id} short={short} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortsComponent;