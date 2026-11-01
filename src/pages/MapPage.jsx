import React from 'react';
import PetMapHeroView from '../components/map/PetMapHeroView';

export const MapPage = () => {
  return (
    <div className="w-full bg-slate-50 dark:bg-[#090d16] transition-colors duration-200">
      <PetMapHeroView />
    </div>
  );
};
export default MapPage;
