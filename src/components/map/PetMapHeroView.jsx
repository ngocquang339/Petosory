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
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Map from './Map';
import BookingModal from '../spa/BookingModal';
import { INITIAL_SPAS } from '../../utils/constants';
import { calculateDistanceNum } from '../../utils/helpers';

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

  // User location state (defaults to Hồ Hoàng Cầu, Đống Đa, Hà Nội: [21.0182, 105.8245])
  const [userCoords, setUserCoords] = useState({ lat: 21.0182, lng: 105.8245 });
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState(null);

  // Request browser geolocation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ chức năng định vị GPS.');
      return;
    }

    setIsLocating(true);
    setLocationNotice({
      type: 'info',
      message: 'Trình duyệt đang gửi yêu cầu lấy vị trí, bạn hãy bấm "Cho phép" (Allow) trên cửa sổ thông báo nhé...',
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setUserCoords(newCoords);
        setSelectedSpa(null); // Unselect spa so map flies and centers directly on user's current location!
        setIsLocating(false);
        setLocationNotice({
          type: 'success',
          message: `Đã định vị thành công vị trí của bạn [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]!`,
        });

        // Hide notice after 4.5s
        setTimeout(() => setLocationNotice(null), 4500);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Không thể lấy được vị trí của bạn.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Bạn đã từ chối quyền truy cập vị trí. Hãy bấm vào biểu tượng ổ khóa 🔒 trên thanh địa chỉ để cấp quyền vị trí cho trang web nhé!';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Thiết bị không xác định được tọa độ GPS hiện tại.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Quá thời gian chờ phản hồi GPS từ trình duyệt.';
        }
        setLocationNotice({ type: 'error', message: errorMsg });
        setTimeout(() => setLocationNotice(null), 6000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Dynamically compute distances from current userCoords
  const spasWithDistance = useMemo(() => {
    return spas.map((spa) => {
      if (spa.lat && spa.lng && userCoords.lat && userCoords.lng) {
        const d = calculateDistanceNum(userCoords.lat, userCoords.lng, spa.lat, spa.lng);
        return {
          ...spa,
          distanceNum: d,
          distanceText: d < 1 ? `Cách ${Math.round(d * 1000)}m` : `Cách ${d.toFixed(1)}km`,
        };
      }
      return spa;
    }).sort((a, b) => (a.distanceNum || 0) - (b.distanceNum || 0));
  }, [spas, userCoords]);

  // Filter spas by radius and service
  const filteredSpas = useMemo(() => {
    return spasWithDistance.filter((spa) => {
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
  }, [spasWithDistance, selectedRadius, selectedService]);

  const handleRefreshArea = () => {
    // Re-center on the first available spa or reset to userCoords
    setSelectedSpa(filteredSpas[0] || null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-108px)] min-h-[620px] max-h-[920px] flex flex-col md:flex-row bg-slate-50 dark:bg-[#0b1320] text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* LEFT PANEL (Responsive to Light & Dark Mode) */}
      <div className="w-full md:w-[440px] lg:w-[480px] h-full flex flex-col bg-white dark:bg-[#0d1526] border-r border-slate-200 dark:border-slate-800 z-10 shrink-0 transition-colors duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3.5 shrink-0 bg-white/95 dark:bg-[#0d1526]/95 backdrop-blur-md">
          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-xl font-bold">📍</span>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide uppercase">
              TÌM PET SPA & GROOMING GẦN BẠN NHẤT
            </h1>
          </div>

          {/* Three Filter Dropdowns */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Dropdown 1: Vị trí */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 border-slate-300 dark:bg-[#162136] dark:hover:bg-[#1a2742] dark:text-slate-200 dark:border-slate-700/60 text-[11px] font-semibold py-2 pl-2.5 pr-6 rounded-xl border focus:outline-none focus:border-orange-500 cursor-pointer truncate transition-colors"
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
                className="w-full appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 border-slate-300 dark:bg-[#162136] dark:hover:bg-[#1a2742] dark:text-slate-200 dark:border-slate-700/60 text-[11px] font-semibold py-2 pl-2.5 pr-6 rounded-xl border focus:outline-none focus:border-orange-500 cursor-pointer truncate transition-colors"
              >
                <option value={1}>Bán kính: 650m</option>
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
                className="w-full appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 border-slate-300 dark:bg-[#162136] dark:hover:bg-[#1a2742] dark:text-slate-200 dark:border-slate-700/60 text-[11px] font-semibold py-2 pl-2.5 pr-6 rounded-xl border focus:outline-none focus:border-orange-500 cursor-pointer truncate transition-colors"
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
            <div className="text-center py-10 px-4 text-slate-500 dark:text-slate-400 text-xs space-y-3 bg-slate-50 dark:bg-[#111827]/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-3xl block">🔍</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                Không có Spa nào trong bán kính <span className="text-orange-500 font-bold">{selectedRadius}km</span> từ vị trí hiện tại của bạn.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedRadius(10)}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:bg-orange-500/20 dark:hover:bg-orange-500/30 dark:text-orange-400 border border-orange-500/30 text-[11px] font-bold transition-all cursor-pointer"
                >
                  Mở rộng bán kính lên 10km
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserCoords({ lat: 21.0182, lng: 105.8245 });
                    setSelectedDistrict('Đống Đa, Hà Nội');
                    setSelectedSpa(INITIAL_SPAS[0]);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-[11px] font-medium transition-all cursor-pointer"
                >
                  Quay lại Hồ Hoàng Cầu, Hà Nội
                </button>
              </div>
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
                      ? 'bg-orange-50/90 dark:bg-[#162136] border-2 border-orange-500 shadow-md dark:shadow-xl dark:shadow-orange-950/30'
                      : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-xs dark:bg-[#111928] dark:hover:bg-[#162136] dark:border-slate-800/80 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="w-24 sm:w-28 h-22 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
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
                          isSelected ? 'text-orange-950 dark:text-white' : 'text-slate-900 dark:text-slate-200'
                        }`}
                      >
                        {spa.name}
                      </h3>

                      {/* Distance & Rating */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">
                        <span>{spa.distanceText || 'Cách 500m'}</span>
                        <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 font-bold">
                          <span>★</span>
                          <span>{spa.rating}</span>
                        </div>
                      </div>

                      {/* Open status */}
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        Đang mở cửa
                      </p>
                    </div>

                    {/* Action button & Perks */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      {spa.tag ? (
                        <span className="text-[10px] text-rose-600 dark:text-rose-300 font-medium truncate flex items-center gap-1">
                          🎁 {spa.tag}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 truncate">
                          {spa.phone}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookingSpa(spa);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
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

        {/* Bottom Banner on Left Panel */}
        {showShopBanner && (
          <div className="p-3 bg-white dark:bg-[#111928] border-t border-slate-200 dark:border-slate-800 shrink-0 transition-colors duration-200">
            <div className="relative p-2.5 rounded-xl bg-orange-50/80 dark:bg-[#1a2333] border border-orange-200 dark:border-orange-500/30 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">🏪</span>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">🎁 Cần mua sắm cho Boss?</span>{' '}
                  Ghé ngay Pet Shop online hàng chính hãng{' '}
                  <Link
                    to="/shop"
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 font-bold underline"
                  >
                    [Xem shop →]
                  </Link>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowShopBanner(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT MAP (Matches dark interactive map of screenshot) */}
      <div className="flex-1 h-full min-h-[550px] w-full relative">
        <Map
          center={[userCoords.lat, userCoords.lng]}
          zoom={15}
          spas={filteredSpas}
          selectedSpa={selectedSpa}
          onSelectSpa={setSelectedSpa}
          onBookSpa={setBookingSpa}
          userLocation={userCoords}
          radiusMeters={420}
          onRefreshArea={handleRefreshArea}
          onLocateUser={handleLocateUser}
          isLocating={isLocating}
          className="w-full h-full min-h-[550px]"
        />

        {/* Floating Notification for Location Request / Status */}
        {locationNotice && (
          <div className="absolute top-16 left-4 z-[1001] max-w-sm animate-scale-up pointer-events-auto">
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold backdrop-blur-md shadow-2xl border flex items-center justify-between gap-2.5 ${
                locationNotice.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-950/50'
                  : locationNotice.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/60 text-rose-200 shadow-rose-950/50'
                  : 'bg-sky-950/90 border-sky-500/60 text-sky-200 shadow-sky-950/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {locationNotice.type === 'info' && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
                )}
                {locationNotice.type === 'success' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {locationNotice.type === 'error' && (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="leading-snug">{locationNotice.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setLocationNotice(null)}
                className="opacity-70 hover:opacity-100 p-0.5 text-xs text-slate-300 hover:text-white shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}
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

