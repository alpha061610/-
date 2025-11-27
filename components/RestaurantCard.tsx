
import React, { useState } from 'react';
import { MapPin, ExternalLink, ThumbsUp, ThumbsDown, Utensils, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { Restaurant, RestaurantAnalysis } from '../types';
import { getRestaurantAnalysis } from '../services/geminiService';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useState<RestaurantAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!expanded) {
      setExpanded(true);
      if (!analysis && !loading) {
        setLoading(true);
        const result = await getRestaurantAnalysis(restaurant.name, restaurant.address);
        setAnalysis(result);
        setLoading(false);
      }
    } else {
      setExpanded(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md mb-4">
      {/* Header Section (Always Visible) */}
      <div className="p-4 flex items-start justify-between cursor-pointer" onClick={handleExpand}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-3xl shadow-inner shrink-0">
            {restaurant.emoji}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {restaurant.travelTimeCategory}分內 ({restaurant.travelTimeMinutes}分)
              </span>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                {restaurant.priceRange === '1-200' ? '$ 平價' : restaurant.priceRange === '200-400' ? '$$ 中價位' : '$$$ 高價位'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">{restaurant.address}</p>
          </div>
        </div>
        
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${expanded ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
        >
          {expanded ? '收起' : '查看詳情'}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-6 animate-fade-in">
          
          {/* 1. Menu Link Section */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <ImageIcon size={18} className="text-blue-500"/>
              菜單參考
            </h4>
            <a 
              href={`${restaurant.googleMapsUrl}&query=${encodeURIComponent(restaurant.name + ' menu 菜單')}`} 
              target="_blank" 
              rel="noreferrer"
              className="group block relative w-full h-32 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 hover:border-blue-400 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 bg-pattern"
            >
               <div className="absolute inset-0 bg-white/50 group-hover:bg-white/30 transition-colors" />
               <div className="relative flex flex-col items-center z-10">
                 <ImageIcon size={32} className="mb-2 opacity-50 group-hover:opacity-100 transition-opacity"/>
                 <span className="font-medium text-sm">點擊查看 Google Maps 最新菜單圖片</span>
                 <span className="text-xs text-gray-400 mt-1">(需跳轉至外部網站)</span>
               </div>
            </a>
          </div>

          {/* 2. AI Analysis Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 text-indigo-400 space-y-3">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm font-medium animate-pulse">AI 正在讀取網路評論並進行摘要...</p>
            </div>
          )}

          {/* 3. AI Analysis Content */}
          {!loading && analysis && (
            <>
               {/* Reviews Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Positive Reviews */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2 text-sm">
                      <ThumbsUp size={16} /> 精選好評 (詳盡摘要)
                    </h4>
                    <ul className="space-y-3">
                      {analysis.positiveReviews.map((review, idx) => (
                        <li key={idx} className="text-xs md:text-sm text-gray-700 bg-white p-2 rounded shadow-sm leading-relaxed border border-green-50">
                          "{review}"
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Negative Reviews */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2 text-sm">
                      <ThumbsDown size={16} /> 精選負評 (詳盡摘要)
                    </h4>
                    <ul className="space-y-3">
                      {analysis.negativeReviews.map((review, idx) => (
                        <li key={idx} className="text-xs md:text-sm text-gray-700 bg-white p-2 rounded shadow-sm leading-relaxed border border-red-50">
                          "{review}"
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>

               {/* Atmosphere & Advice */}
               <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                  <div className="mb-4">
                    <h4 className="font-bold text-indigo-800 mb-1 flex items-center gap-2 text-sm">
                      <Sparkles size={16} /> 環境氛圍
                    </h4>
                    <p className="text-sm text-indigo-900 leading-relaxed bg-white/60 p-2 rounded">
                      {analysis.atmosphere}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-800 mb-1 flex items-center gap-2 text-sm">
                      <Utensils size={16} /> 內用 vs 外帶建議
                    </h4>
                    <p className="text-sm text-indigo-900 leading-relaxed bg-white/60 p-2 rounded font-medium">
                      {analysis.diningAdvice}
                    </p>
                  </div>
               </div>
            </>
          )}

           <div className="flex justify-end pt-2">
             <a 
               href={restaurant.googleMapsUrl} 
               target="_blank" 
               rel="noreferrer"
               className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1 transition-colors"
             >
               前往 Google Maps 查看更多真實評論 <ExternalLink size={10} />
             </a>
           </div>

        </div>
      )}
    </div>
  );
};
