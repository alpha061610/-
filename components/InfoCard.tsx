
import React from 'react';
import { Sparkles, Loader2, Map, ExternalLink } from 'lucide-react';
import { Restaurant } from '../types';

interface InfoCardProps {
  restaurant: Restaurant;
  comment: string;
  aiFact: string | null;
  isLoadingAi: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ restaurant, comment, aiFact, isLoadingAi }) => {
  return (
    <div className="space-y-4 w-full max-w-sm mx-auto animate-fade-in-up">
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
        <p className="text-xl font-bold text-orange-800">
          {comment}
        </p>
      </div>

      <a 
        href={restaurant.googleMapsUrl} 
        target="_blank" 
        rel="noreferrer"
        className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-2 group"
      >
        <Map size={20} className="group-hover:scale-110 transition-transform"/>
        <span className="font-bold">在 Google Maps 上查看</span>
        <ExternalLink size={14} className="opacity-50"/>
      </a>

      {(aiFact || isLoadingAi) && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
                <Sparkles size={48} />
            </div>
          {isLoadingAi ? (
            <div className="flex items-center justify-center space-x-2 text-indigo-400">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm font-medium">AI 正在思考美食情報...</span>
            </div>
          ) : (
            <p className="text-indigo-800 text-sm md:text-base font-medium leading-relaxed">
              <span className="font-bold block text-xs uppercase tracking-wider text-indigo-400 mb-1">AI 點評</span>
              {aiFact}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
