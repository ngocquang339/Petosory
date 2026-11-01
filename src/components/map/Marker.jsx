import React from 'react';
import { Marker as LeafletMarker, Popup } from 'react-leaflet';
import { createPetPinIcon } from '../../utils/maps';

export const PetMarker = ({ spa, isSelected, onClick, onBook }) => {
  return (
    <LeafletMarker
      position={[spa.lat, spa.lng]}
      icon={createPetPinIcon(isSelected)}
      eventHandlers={{
        click: () => onClick && onClick(spa),
      }}
    >
      <Popup className="petosory-dark-popup">
        <div className="p-1 min-w-[190px] text-white">
          <div className="flex items-center gap-1.5 font-bold text-xs text-white">
            <span className="truncate">{spa.name}</span>
            <span className="text-emerald-400 font-bold">•</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-1">
            <span>{spa.distanceText || 'Cách 1.2km'}</span>
            <span className="text-amber-400 font-bold flex items-center gap-0.5">
              ★ {spa.rating}
            </span>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBook && onBook(spa);
              }}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 cursor-pointer flex items-center gap-1"
            >
              [ Đặt lịch ]
            </button>
            <span className="text-[10px] text-emerald-400">Đang mở</span>
          </div>
        </div>
      </Popup>
    </LeafletMarker>
  );
};
export default PetMarker;
