import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup, useMap as useLeafletMap } from 'react-leaflet';
import PetMarker from './Marker';
import { userLocationIcon } from '../../utils/maps';

// Subcomponent to trigger flyTo on center changes
const MapRecenter = ({ center, zoom }) => {
  const map = useLeafletMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

export const Map = ({
  center = [21.0285, 105.8542],
  zoom = 13,
  spas = [],
  selectedSpa,
  onSelectSpa,
  userLocation,
  className = 'h-full w-full',
}) => {
  const activeCenter = selectedSpa
    ? [selectedSpa.lat, selectedSpa.lng]
    : center;

  return (
    <div className={`relative ${className} overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner`}>
      <MapContainer
        center={activeCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapRecenter center={activeCenter} zoom={selectedSpa ? 15 : zoom} />

        {/* Clean OpenStreetMap CartoDB Positron / OSM tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User GPS location pin */}
        {userLocation && (
          <LeafletMarker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <span className="font-bold text-xs text-sky-600">Vị trí hiện tại của bạn</span>
            </Popup>
          </LeafletMarker>
        )}

        {/* Spa Pins */}
        {spas.map((spa) => (
          <PetMarker
            key={spa.id}
            spa={spa}
            isSelected={selectedSpa?.id === spa.id}
            onClick={onSelectSpa}
          />
        ))}
      </MapContainer>
    </div>
  );
};
export default Map;

