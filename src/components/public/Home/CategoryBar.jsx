import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryBar = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = direction === 'left' ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="relative flex items-center w-full">
        {/* Left Arrow (hidden on small screens) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:inline-flex p-2 bg-blue-900 hover:bg-blue-800 rounded-full mr-4 transition-colors shadow-md"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Scrollable Category List */}
        <div
          ref={scrollRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hidden scroll-smooth"
        >
          {categories.map((category, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(i)}
              className={`px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap text-sm font-medium shadow-md ${
                activeCategory === i
                  ? 'bg-blue-900 text-white shadow-lg transform scale-105'
                  : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Right Arrow (hidden on small screens) */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:inline-flex p-2 bg-blue-900 hover:bg-blue-800 rounded-full ml-4 transition-colors shadow-md"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
export default CategoryBar