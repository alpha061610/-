
import React from 'react';
import { Restaurant } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { ArrowLeft } from 'lucide-react';

interface ResultsListProps {
  restaurants: Restaurant[];
  onBack: () => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({ restaurants, onBack }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={18} />
          重新篩選
        </button>
        <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          共找到 {restaurants.length} 間餐廳
        </span>
      </div>

      <div className="space-y-4 pb-20">
        {restaurants.map(r => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
        
        <div className="text-center py-8 text-gray-400 text-sm">
           沒有更多結果了
        </div>
      </div>
    </div>
  );
};
