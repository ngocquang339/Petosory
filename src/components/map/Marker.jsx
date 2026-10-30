import React from 'react';
import { Marker as LeafletMarker, Popup } from 'react-leaflet';
import { createPetPinIcon } from '../../utils/maps';

export const PetMarker = ({ spa, isSelected, onClick }) => {
  return (
    <LeafletMarker
      position={[spa.lat, spa.lng]}
      icon={createPetPinIcon(isSelected)}
      eventHandlers={{
        click: () => onClick && onClick(spa),
      }}
    >
      <Popup className="custom-popup">
        <div className="p-1 font-sans">
          <p className="font-bold text-xs text-slate-900">{spa.name}</p>
          <p className="text-[11px] text-slate-500">{spa.address}</p>
          <p className="text-[11px] text-orange-600 font-semibold mt-1">
            ⭐ {spa.rating} ({spa.reviewCount} đánh giá)
          </p>
        </div>
      </Popup>
    </LeafletMarker>
  );
};
export default PetMarker;

