
import React from 'react';
import { Restaurant } from '../types';
import { MapPin } from 'lucide-react';

interface SlotMachineDisplayProps {
  currentFood: Restaurant;
  isSpinning: boolean;
  hasResult: boolean;
}

export const SlotMachineDisplay: React.FC<SlotMachineDisplayProps> = ({ 
  currentFood, 
  isSpinning, 
  hasResult 
}) => {
  return (
    <div className="relative w-full max-w-sm aspect-square md:aspect-[4/3] mx-auto mb-6 bg-white rounded-3xl border-4 border-orange-200 shadow-inner flex flex-col items-center justify-center overflow-hidden transition-all duration-300 transform">
      {/* Decorative top sheen */}
      <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-gray-50 to-transparent opacity-50 pointer-events-none" />
      
      <div className={`transition-all duration-100 flex flex-col items-center p-4 text-center ${isSpinning ? 'scale-110 blur-[1px]' : 'scale-100 blur-0'}`}>
        <span className={`text-7xl md:text-8xl mb-4 filter drop-shadow-lg transition-transform ${hasResult ? 'animate-bounce-short' : ''}`}>
          {currentFood.emoji}
        </span>
        <h1 
          className={`
            text-3xl md:text-4xl font-black text-center text-gray-800 tracking-tight leading-tight
            ${hasResult ? 'text-orange-600 scale-105' : ''}
            transition-colors duration-300
          `}
        >
          {currentFood.name}
        </h1>
        
        {/* Address subtext - only show when not spinning for cleaner look, or always show if stable */}
        {!isSpinning && currentFood.id !== '0' && (
          <div className="mt-3 flex items-center justify-center gap-1 text-gray-400 text-sm font-medium animate-fade-in">
             <MapPin size={14} />
             <span className="truncate max-w-[200px]">{currentFood.address}</span>
          </div>
        )}
      </div>

      {/* Spinner Lines Overlay for motion effect */}
      {isSpinning && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30 z-10" />
      )}
    </div>
  );
};
