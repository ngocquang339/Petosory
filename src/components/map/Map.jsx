import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker as LeafletMarker,
  Circle,
  useMap as useLeafletMap,
} from 'react-leaflet';
import PetMarker from './Marker';
import { userLocationIcon } from '../../utils/maps';
import { RefreshCw, Flame, Calendar } from 'lucide-react';

// Subcomponent to trigger flyTo on center changes
const MapRecenter = ({ center, zoom }) => {
  const map = useLeafletMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.0 });
    }
  }, [center, zoom, map]);
  return null;
};

export const Map = ({
  center = [21.0185, 105.8235],
  zoom = 14,
  spas = [],
  selectedSpa,
  onSelectSpa,
  onBookSpa,
  userLocation = { lat: 21.0185, lng: 105.8235 },
  radiusKm = 3,
  onRefreshArea,
  className = 'h-full w-full',
}) => {
  const activeCenter = selectedSpa
    ? [selectedSpa.lat, selectedSpa.lng]
    : [userLocation.lat, userLocation.lng];

  return (
    <div className={`relative ${className} overflow-hidden bg-[#090d16]`}>
      <MapContainer
        center={activeCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={true}
        style={{ height: '100%', width: '100%', backgroundColor: '#090d16' }}
      >
        <MapRecenter center={activeCenter} zoom={zoom} />

        {/* High quality CartoDB Dark Matter tiles matching exact screenshot */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Radius circle around user location */}
        {userLocation && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#f97316',
              fillColor: '#ea580c',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '6, 6',
            }}
          />
        )}

        {/* User GPS location pin */}
        {userLocation && (
          <LeafletMarker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          />
        )}

        {/* Spa Pins */}
        {spas.map((spa) => (
          <PetMarker
            key={spa.id}
            spa={spa}
            isSelected={selectedSpa?.id === spa.id}
            onClick={onSelectSpa}
            onBook={onBookSpa}
          />
        ))}
      </MapContainer>

      {/* Floating Badges & Controls Overlay (exact match to screenshot) */}
      
      {/* 1. Top Left Legend: "Vị trí của bạn" */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-white text-xs font-semibold shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/80 animate-pulse"></span>
          <span>Vị trí của bạn</span>
        </div>
      </div>

      {/* 2. Top Center Button: "Tìm kiếm lại khu vực này" */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto">
        <button
          type="button"
          onClick={onRefreshArea}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 text-slate-100 hover:text-white text-xs font-bold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
          <span>Tìm kiếm lại khu vực này</span>
        </button>
      </div>

      {/* 3. Floating Preview Card for Selected Spa on Map (like screenshot popup) */}
      {selectedSpa && (
        <div className="absolute top-20 right-6 z-[1000] pointer-events-auto max-w-xs animate-scale-up hidden sm:block">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white shadow-2xl space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-white truncate">
                {selectedSpa.name}
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span>{selectedSpa.distanceText || 'Cách 1.2km'}</span>
              <span className="text-amber-400 font-bold">★ {selectedSpa.rating}</span>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onBookSpa && onBookSpa(selectedSpa)}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 cursor-pointer hover:underline"
              >
                [ Đặt lịch ]
              </button>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {selectedSpa.address.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Right Promo Badge: "🔥 Combo Spa + Pate Giảm 10%" */}
      <div className="absolute bottom-5 right-5 z-[1000] pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-orange-500/40 text-xs font-bold text-orange-400 shadow-xl hover:border-orange-500 transition-colors cursor-pointer">
          <Flame className="w-4 h-4 text-orange-500 animate-bounce-subtle" />
          <span>Combo Spa + Pate <span className="text-amber-300">Giảm 10%</span></span>
        </div>
      </div>
    </div>
  );
};
export default Map;
