import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ChevronDown,
  Star,
  Clock,
  Sparkles,
  ShoppingBag,
  X,
  ArrowRight,
  Flame,
  CheckCircle2,
  Gift,
} from 'lucide-react';
import Map from './Map';
import BookingModal from '../spa/BookingModal';
import { INITIAL_SPAS } from '../../utils/constants';

export const PetMapHeroView = () => {
  // Filters matching screenshot dropdowns
  const [selectedDistrict, setSelectedDistrict] = useState('Đống Đa, Hà Nội');
  const [selectedRadius, setSelectedRadius] = useState(3); // in km
  const [selectedService, setSelectedService] = useState('Tắm & Cắt tỉa');
  const [showShopBanner, setShowShopBanner] = useState(true);

  // Spas data & active selection
  const [spas, setSpas] = useState(INITIAL_SPAS);
  const [selectedSpa, setSelectedSpa] = useState(INITIAL_SPAS[0]); // Default selected: Petosory Flagship Spa
  const [bookingSpa, setBookingSpa] = useState(null);

  // User location (Hoàng Cầu, Đống Đa, Hà Nội: [21.018, 105.824])
  const userCoords = { lat: 21.018, lng: 105.824 };

  // Filter spas by radius and service
  const filteredSpas = useMemo(() => {
    return spas.filter((spa) => {
      // Radius filter
      if (spa.distanceNum && spa.distanceNum > selectedRadius) {
        return false;
      }
      // Service filter
      if (selectedService === 'Tắm & Cắt tỉa') {
        return spa.services.some(
          (s) =>
            s.name.toLowerCase().includes('tắm') ||
            s.name.toLowerCase().includes('tỉa') ||
            s.name.toLowerCase().includes('grooming')
        );
      }
      if (selectedService === 'Khám thú y') {
        return (
          spa.name.toLowerCase().includes('clinic') ||
          spa.name.toLowerCase().includes('thú y') ||
          spa.services.some((s) => s.name.toLowerCase().includes('khám'))
        );
      }
      if (selectedService === 'Khách sạn thú cưng') {
        return spa.services.some((s) => s.name.toLowerCase().includes('khách sạn'));
      }
      return true;
    });
  }, [spas, selectedRadius, selectedService]);

  const handleRefreshArea = () => {
    // Re-center and reset selected
    setSelectedSpa(filteredSpas[0] || null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-108px)] min-h-[620px] max-h-[920px] flex flex-col md:flex-row bg-[#0b0f19] text-slate-100 overflow-hidden font-sans">
      {/* LEFT PANEL (Matches left side of screenshot) */}
      <div className="w-full md:w-[440px] lg:w-[480px] h-full flex flex-col bg-[#0d131f] border-r border-slate-800/80 z-10 shrink-0">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 space-y-3.5 shrink-0 bg-[#0d131f]/95 backdrop-blur-md">
          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-xl font-bold">📍</span>
            <h1 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
              TÌM PET SPA & GROOMING GẦN BẠN NHẤT
            </h1>
          </div>

          {/* Three Filter Dropdowns (exact match to screenshot) */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Dropdown 1: Vị trí */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full appearance-none bg-[#162136] hover:bg-[#1a2742] text-slate-200 text-[11px] font-semibold py-2 pl-2.5 pr-6 rounded-xl border border-slate-700/60 focus:outline-none focus:border-orange-500 cursor-pointer truncate transition-colors"
              >
                <option value="Đống Đa, Hà Nội">Vị trí: Đống Đa, Hà Nội</option>
                <option value="Ba Đình, Hà Nội">Vị trí: Ba Đình, Hà Nội</option>
                <option value="Cầu Giấy, Hà Nội">Vị trí: Cầu Giấy, Hà Nội</option>
                <option value="Tây Hồ, Hà Nội">Vị trí: Tây Hồ, Hà Nội</option>
                <option value="Hai Bà Trưng, Hà Nội">Vị trí: Hai Bà Trưng, Hà Nội</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown 2: Bán kính */}
            <div className="relative">
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="w-full appearance-none bg-[#162136] hover:bg-[#1a2742] text-slate-200 text-[11px] font-semibold py-2 pl-2.5 pr-6 rounded-xl border border-slate-700/60 focus:outline-none focus:border-orange-500 cursor-pointer truncate transition-colors"
              >
                <option value={1}>Bán kính: 1km</option>
                <option value={3}>Bán kính: 3km</option>
                <option value={5}>Bán kính: 5km</option>
                <option value={10}>Bán kính: 10km</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown 3: Dịch vụ */}
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full appearance-none bg-[#162136] hover:bg-[#1a2742] text-slate-200 text-[11px] font-semibold py-2 pl-2.5 pr-6 rounded-xl border border-slate-700/60 focus:outline-none focus:border-orange-500 cursor-pointer truncate transition-colors"
              >
                <option value="Tắm & Cắt tỉa">Dịch vụ: Tắm & Cắt tỉa</option>
                <option value="Khám thú y">Dịch vụ: Khám thú y</option>
                <option value="Khách sạn thú cưng">Dịch vụ: Khách sạn</option>
                <option value="Tất cả dịch vụ">Dịch vụ: Tất cả</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* List of Spa Cards (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {filteredSpas.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <span className="text-3xl block mb-2">🔍</span>
              Không có Spa nào trong bán kính {selectedRadius}km. Hãy thử chọn bán kính 5km hoặc 10km!
            </div>
          ) : (
            filteredSpas.map((spa) => {
              const isSelected = selectedSpa?.id === spa.id;

              return (
                <div
                  key={spa.id}
                  onClick={() => setSelectedSpa(spa)}
                  className={`relative p-3 rounded-2xl cursor-pointer transition-all duration-200 flex gap-3 ${
                    isSelected
                      ? 'bg-[#162136] border-2 border-orange-500 shadow-xl shadow-orange-950/20'
                      : 'bg-[#131b2c] hover:bg-[#18233a] border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="w-24 sm:w-28 h-22 sm:h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0 relative">
                    <img
                      src={spa.image}
                      alt={spa.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Name */}
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isSelected ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {spa.name}
                      </h3>

                      {/* Distance & Rating */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-0.5">
                        <span>{spa.distanceText || 'Cách 1.2km'}</span>
                        <div className="flex items-center gap-0.5 text-amber-400 font-bold">
                          <span>★</span>
                          <span>{spa.rating}</span>
                        </div>
                      </div>

                      {/* Open status */}
                      <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                        Đang mở cửa
                      </p>
                    </div>

                    {/* Action button & Perks (Card 1 selected in screenshot) */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      {/* Tag note */}
                      {spa.tag ? (
                        <span className="text-[10px] text-rose-300/90 font-medium truncate flex items-center gap-1">
                          🎁 {spa.tag}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 truncate">
                          {spa.phone}
                        </span>
                      )}

                      {/* Booking button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookingSpa(spa);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-md shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                      >
                        Đặt lịch ngay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Banner on Left Panel (matches bottom left of screenshot) */}
        {showShopBanner && (
          <div className="p-3 bg-[#111928] border-t border-slate-800/90 shrink-0">
            <div className="relative p-2.5 rounded-xl bg-[#1a2333] border border-orange-500/30 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">🏪</span>
                <p className="text-[11px] text-slate-300 leading-tight">
                  <span className="text-orange-400 font-bold">🎁 Cần mua sắm cho Boss?</span>{' '}
                  Ghé ngay Pet Shop online hàng chính hãng{' '}
                  <Link
                    to="/shop"
                    className="text-orange-400 hover:text-orange-300 font-bold underline"
                  >
                    [Xem shop →]
                  </Link>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowShopBanner(false)}
                className="text-slate-400 hover:text-white p-1 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT MAP (Matches dark interactive map of screenshot) */}
      <div className="flex-1 h-full relative">
        <Map
          center={[userCoords.lat, userCoords.lng]}
          zoom={14}
          spas={filteredSpas}
          selectedSpa={selectedSpa}
          onSelectSpa={setSelectedSpa}
          onBookSpa={setBookingSpa}
          userLocation={userCoords}
          radiusKm={selectedRadius}
          onRefreshArea={handleRefreshArea}
          className="w-full h-full"
        />
      </div>

      {/* Booking Modal */}
      {bookingSpa && (
        <BookingModal
          isOpen={Boolean(bookingSpa)}
          onClose={() => setBookingSpa(null)}
          spa={bookingSpa}
        />
      )}
    </div>
  );
};
export default PetMapHeroView;

