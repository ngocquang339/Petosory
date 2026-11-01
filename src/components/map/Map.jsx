import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker as LeafletMarker,
  Circle,
  ZoomControl,
  useMap as useLeafletMap,
} from 'react-leaflet';
import PetMarker from './Marker';
import { userLocationIcon } from '../../utils/maps';
import { RefreshCw, Flame } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';

// Subcomponent to trigger flyTo on center changes and invalidateSize on mount
const MapController = ({ center, zoom }) => {
  const map = useLeafletMap();

  useEffect(() => {
    // Invalidate size on mount to ensure tiles load in flex layout
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.0 });
    }
  }, [center, zoom, map]);

  return null;
};

export const Map = ({
  center = [21.0182, 105.8245],
  zoom = 15,
  spas = [],
  selectedSpa,
  onSelectSpa,
  onBookSpa,
  userLocation = { lat: 21.0182, lng: 105.8245 },
  radiusMeters = 420,
  onRefreshArea,
  onLocateUser,
  isLocating = false,
  className = 'h-[550px] min-h-[500px] w-full',
}) => {
  // Bản đồ đồng nhất giao diện sáng rõ nét (Google Maps) cho cả Chế độ Sáng & Chế độ Tối
  const mapCenter = [userLocation.lat, userLocation.lng];

  return (
    <div
      className={`relative ${className} min-h-[500px] w-full overflow-hidden transition-colors duration-200`}
    >
      {/* Đồng nhất màu bản đồ sáng tự nhiên, không áp dụng bộ lọc tối */}
      <style>{`
        .leaflet-container {
          background-color: #f8fafc !important;
        }
        .leaflet-container .leaflet-tile-pane,
        .leaflet-container .leaflet-tile,
        .dark .leaflet-container .leaflet-tile-pane,
        .dark .leaflet-container .leaflet-tile,
        .dark-map .leaflet-container .leaflet-tile {
          filter: none !important;
          -webkit-filter: none !important;
        }
        .dark .leaflet-container,
        .dark-map .leaflet-container {
          background-color: #f8fafc !important;
        }
      `}</style>

      <MapContainer
        key="pet-map-standard"
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', minHeight: '500px', width: '100%' }}
      >
        <MapController center={mapCenter} zoom={zoom} />

        {/* Nguồn bản đồ Google Maps sáng tự nhiên, hiển thị sắc nét tên đường xá */}
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
        />

        {/* 3. Zoom buttons relocated to bottomright */}
        <ZoomControl position="bottomright" />

        {/* Vòng tròn bán kính và Chấm xanh Vị trí của bạn (tâm chuẩn [21.0182, 105.8245], bán kính 420m) */}
        {userLocation && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={radiusMeters || 420}
            pathOptions={{
              color: '#f59e0b',
              weight: 1.5,
              fillColor: '#fed7aa',
              fillOpacity: 0.32,
              dashArray: undefined,
            }}
          />
        )}

        {/* User GPS location pin (chấm xanh nằm chính giữa tâm vòng tròn cam) */}
        {userLocation && (
          <LeafletMarker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          />
        )}

        {/* Spa Pins (Markers remain sharp orange) */}
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

      {/* Floating Badges & Controls Overlay (responsive to dark/light theme) */}
      
      {/* Top Left Button: "Vị trí của bạn" (Clickable to request user GPS location) */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-auto">
        <button
          type="button"
          onClick={onLocateUser}
          disabled={isLocating}
          title="Nhấn để định vị vị trí hiện tại của bạn"
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 border border-slate-200/90 shadow-md hover:border-sky-500 dark:bg-slate-900/90 dark:hover:bg-slate-800 active:scale-95 backdrop-blur-md dark:border-slate-700/80 dark:hover:border-sky-400 dark:text-white text-xs font-semibold dark:shadow-lg transition-all cursor-pointer disabled:opacity-80 disabled:cursor-wait"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              isLocating
                ? 'bg-amber-400 animate-ping'
                : 'bg-sky-400 shadow-sm shadow-sky-400/80 animate-pulse group-hover:scale-125'
            }`}
          />
          <span className="select-none">
            {isLocating ? 'Đang lấy vị trí...' : 'Vị trí của bạn'}
          </span>
        </button>
      </div>

      {/* Top Center Button: "Tìm kiếm lại khu vực này" */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto">
        <button
          type="button"
          onClick={onRefreshArea}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-md dark:bg-slate-900/90 dark:hover:bg-slate-800 backdrop-blur-md dark:border-slate-700/80 dark:text-slate-100 hover:scale-105 active:scale-95 text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
          <span>Tìm kiếm lại khu vực này</span>
        </button>
      </div>

      {/* Floating Preview Card for Selected Spa on Map */}
      {selectedSpa && (
        <div className="absolute top-20 right-6 z-[1000] pointer-events-auto max-w-xs animate-scale-up hidden sm:block">
          <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-white shadow-xl dark:shadow-2xl space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {selectedSpa.name}
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0"></span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-300">
              <span>{selectedSpa.distanceText || 'Cách 1.2km'}</span>
              <span className="text-amber-500 dark:text-amber-400 font-bold">★ {selectedSpa.rating}</span>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onBookSpa && onBookSpa(selectedSpa)}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 cursor-pointer hover:underline"
              >
                [ Đặt lịch ]
              </button>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {selectedSpa.address.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right Promo Badge (positioned to the left of zoom buttons) */}
      <div className="absolute bottom-5 right-16 z-[1000] pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-orange-400/50 dark:border-orange-500/40 text-xs font-bold text-orange-600 dark:text-orange-400 shadow-lg dark:shadow-xl hover:border-orange-500 transition-colors cursor-pointer">
          <Flame className="w-4 h-4 text-orange-500 animate-bounce-subtle" />
          <span>Combo Spa + Pate <span className="text-amber-600 dark:text-amber-300">Giảm 10%</span></span>
        </div>
      </div>
    </div>
  );
};
export default Map;
