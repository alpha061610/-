
import React, { useState, useMemo, useEffect } from 'react';
import { RESTAURANT_LIST } from './constants';
import { FilterCriteria } from './types';
import { FilterForm } from './components/FilterForm';
import { ResultsList } from './components/ResultsList';
import { filterRestaurants } from './utils/filterUtils';

const App: React.FC = () => {
  // Mode: 'filter' (answering questions) or 'results' (showing list)
  const [mode, setMode] = useState<'filter' | 'results'>('filter');
  
  // Filter Criteria
  const [criteria, setCriteria] = useState<FilterCriteria>({
    priceLevels: [], 
    maxTravelTime: '10', 
    targetDate: new Date(),
    useCurrentTime: true,
  });

  // Derived filtered list
  const filteredRestaurants = useMemo(() => {
    return filterRestaurants(RESTAURANT_LIST, criteria);
  }, [criteria]);

  const handleShowResults = () => {
    if (filteredRestaurants.length === 0) return;
    setMode('results');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFilter = () => {
    setMode('filter');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update time for "Now" option every minute
  useEffect(() => {
    if (!criteria.useCurrentTime) return;
    const timer = setInterval(() => {
      setCriteria(c => ({ ...c, targetDate: new Date() }));
    }, 60000);
    return () => clearInterval(timer);
  }, [criteria.useCurrentTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex flex-col items-center py-8 px-4 selection:bg-orange-200 font-sans text-gray-800">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 drop-shadow-sm mb-2">
          🤔 今天吃什麼？
        </h1>
        <p className="text-gray-500 font-medium">台中西區午餐決策小幫手 (列表版)</p>
      </header>

      {/* Main Content */}
      {mode === 'filter' ? (
        <FilterForm 
          criteria={criteria}
          onChange={setCriteria}
          onSearch={handleShowResults}
          resultCount={filteredRestaurants.length}
        />
      ) : (
        <ResultsList 
          restaurants={filteredRestaurants}
          onBack={handleBackToFilter}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm">
        <p>© 2024 Taiwan Lunch Decider</p>
      </footer>
    </div>
  );
};

export default App;
