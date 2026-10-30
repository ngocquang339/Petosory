import React from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';

export const SearchBox = ({ value, onChange, onLocateMe, isLocating }) => {
  const { cities, selectedCity, selectCity } = useLocation();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-3 space-y-3">
      {/* City tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {cities.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => selectCity(city.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCity.id === city.id
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Search Input & GPS Locate button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tìm theo tên spa, đường, dịch vụ tắm tỉa..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          type="button"
          onClick={onLocateMe}
          disabled={isLocating}
          title="Định vị vị trí của tôi"
          className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
export default SearchBox;

