
import React from 'react';
import { FilterCriteria, PriceLevel, TravelTime } from '../types';
import { PRICE_OPTIONS, TIME_OPTIONS } from '../constants';
import { Clock, MapPin, Wallet } from 'lucide-react';

interface FilterFormProps {
  criteria: FilterCriteria;
  onChange: (newCriteria: FilterCriteria) => void;
  onSearch: () => void;
  resultCount: number;
}

export const FilterForm: React.FC<FilterFormProps> = ({ criteria, onChange, onSearch, resultCount }) => {
  
  const handlePriceToggle = (value: PriceLevel) => {
    const current = criteria.priceLevels;
    let next: PriceLevel[];
    if (current.includes(value)) {
      next = current.filter(p => p !== value);
    } else {
      next = [...current, value];
    }
    onChange({ ...criteria, priceLevels: next });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value; // "HH:mm"
    const now = new Date();
    const [h, m] = timeStr.split(':').map(Number);
    const newDate = new Date(now);
    newDate.setHours(h);
    newDate.setMinutes(m);
    onChange({ ...criteria, targetDate: newDate, useCurrentTime: false });
  };

  const setNow = () => {
    onChange({ ...criteria, targetDate: new Date(), useCurrentTime: true });
  };

  return (
    <div className="w-full max-w-lg bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 border border-white/50 mb-8 animate-fade-in-up">
      <div className="space-y-6">
        
        {/* Price Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-orange-800 font-bold">
            <Wallet size={20} />
            <h2>預算範圍 (可多選)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PRICE_OPTIONS.map(opt => {
              const isActive = criteria.priceLevels.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => handlePriceToggle(opt.value)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 text-left
                    ${isActive 
                      ? 'bg-orange-100 border-orange-400 text-orange-800' 
                      : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200'
                    }
                  `}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Distance Section */}
        <div>
           <div className="flex items-center gap-2 mb-3 text-indigo-800 font-bold">
            <MapPin size={20} />
            <h2>騎車距離 (以中山路469號為中心)</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...criteria, maxTravelTime: opt.value })}
                className={`
                  flex-1 min-w-[80px] px-3 py-2 rounded-xl text-sm font-medium transition-all border-2
                  ${criteria.maxTravelTime === opt.value
                    ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-emerald-800 font-bold">
            <Clock size={20} />
            <h2>用餐時間</h2>
          </div>
          <div className="flex items-center gap-4 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={criteria.useCurrentTime} 
                onChange={setNow}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-emerald-900 font-medium">現在出發</span>
            </label>
            
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                checked={!criteria.useCurrentTime} 
                onChange={() => onChange({ ...criteria, useCurrentTime: false })}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-emerald-900 font-medium">指定時間:</span>
              <input
                type="time"
                value={criteria.targetDate.toTimeString().slice(0, 5)}
                onChange={handleTimeChange}
                disabled={criteria.useCurrentTime}
                className={`
                  px-2 py-1 rounded border border-emerald-200 text-emerald-800 bg-white
                  ${criteria.useCurrentTime ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
            </div>
          </div>
        </div>

        {/* Search Action */}
        <button
          onClick={onSearch}
          className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"
        >
          🔍 篩選出 {resultCount} 間餐廳
        </button>
        {resultCount === 0 && (
            <p className="text-center text-red-500 text-sm font-bold">
                找不到符合條件的餐廳，請嘗試放寬篩選條件。
            </p>
        )}
      </div>
    </div>
  );
};
