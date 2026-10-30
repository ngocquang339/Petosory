import React from 'react';
import SpaCard from './SpaCard';

export const SpaList = ({ spas = [], selectedSpa, onSelectSpa, onBookSpa }) => {
  if (spas.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-700">
        <span className="text-4xl">🐕🔍</span>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-2">
          Không tìm thấy Spa nào phù hợp
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Hãy thử đổi từ khóa tìm kiếm hoặc chọn thành phố khác xem sao nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {spas.map((spa) => (
        <SpaCard
          key={spa.id}
          spa={spa}
          isSelected={selectedSpa?.id === spa.id}
          onSelect={onSelectSpa}
          onBook={onBookSpa}
        />
      ))}
    </div>
  );
};
export default SpaList;

