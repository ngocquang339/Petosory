import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Search,
} from 'lucide-react';
import Map from './Map';
import BookingModal from '../spa/BookingModal';
import { INITIAL_SPAS } from '../../utils/constants';
import { calculateDistanceNum } from '../../utils/helpers';
import { spaService } from '../../services/spaService';

const DISTRICT_COORDINATES = {
  'Đống Đa, Hà Nội': { lat: 21.0182, lng: 105.8245 },
  'Ba Đình, Hà Nội': { lat: 21.0341, lng: 105.8235 },
  'Cầu Giấy, Hà Nội': { lat: 21.0362, lng: 105.7906 },
  'Tây Hồ, Hà Nội': { lat: 21.0713, lng: 105.8230 },
  'Hai Bà Trưng, Hà Nội': { lat: 21.0065, lng: 105.8524 },
};

export const PetMapHeroView = () => {
  // Filters matching screenshot dropdowns
  const [selectedDistrict, setSelectedDistrict] = useState('Đống Đa, Hà Nội');
  const [selectedRadius, setSelectedRadius] = useState(3); // in km
  const [selectedService, setSelectedService] = useState('Tắm & Cắt tỉa');
  const [showShopBanner, setShowShopBanner] = useState(true);

  // Exact Search & Geocoding states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const searchContainerRef = useRef(null);

  // Map view target coordinates & zoom (centers on searched spa or address)
  const [mapTargetCoords, setMapTargetCoords] = useState([21.0182, 105.8245]);
  const [mapZoom, setMapZoom] = useState(15);

  // Spas data & active selection
  const [spas, setSpas] = useState(INITIAL_SPAS);
  const [selectedSpa, setSelectedSpa] = useState(INITIAL_SPAS[0]); // Default selected: Petosory Flagship Spa
  const [bookingSpa, setBookingSpa] = useState(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load latest spas from Database Cloud & Local Storage
  useEffect(() => {
    const loadSpas = async () => {
      try {
        const data = await spaService.getSpas();
        if (data && data.length > 0) {
          setSpas(data);
          if (!selectedSpa) {
            setSelectedSpa(data[0]);
          }
        }
      } catch (err) {
        console.warn('Load spas error:', err);
      }
    };
    loadSpas();
  }, []);

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
        setMapTargetCoords([latitude, longitude]);
        setMapZoom(16);
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

  // Change District & Center
  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName);
    const coords = DISTRICT_COORDINATES[districtName];
    if (coords) {
      setUserCoords(coords);
      setMapTargetCoords([coords.lat, coords.lng]);
      setMapZoom(15);
      setLocationNotice({
        type: 'info',
        message: `Đã chuyển vị trí tìm kiếm sang ${districtName}`,
      });
      setTimeout(() => setLocationNotice(null), 3000);
    }
  };

  // Autocomplete matching spas from query
  const matchedSpas = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return spas
      .filter(
        (spa) =>
          spa.name.toLowerCase().includes(q) ||
          spa.address.toLowerCase().includes(q) ||
          spa.services?.some((s) => s.name.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [spas, searchQuery]);

  // Select an exact Spa (from search suggestion, direct click, etc.)
  const handleSelectExactSpa = (spa) => {
    setSelectedSpa(spa);
    setSearchQuery(spa.name);
    setIsSearchOpen(false);
    setMapTargetCoords([spa.lat, spa.lng]);
    setMapZoom(17);
    setLocationNotice({
      type: 'success',
      message: `Đã định vị tiệm: ${spa.name}`,
    });
    setTimeout(() => setLocationNotice(null), 3500);
  };

  // Search Address Geocoding (Nominatim OpenStreetMap)
  const handleSearchAddress = async (queryText) => {
    const query = (queryText || searchQuery).trim();
    if (!query) return;

    setIsSearchOpen(false);
    setIsSearchingAddress(true);
    setLocationNotice({
      type: 'info',
      message: `Đang tìm tọa độ cho "${query}"...`,
    });

    try {
      // Direct spa check first
      const directSpa = spas.find((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      if (directSpa) {
        handleSelectExactSpa(directSpa);
        setIsSearchingAddress(false);
        return;
      }

      // Nominatim search with Hà Nội context
      const searchParam =
        query.toLowerCase().includes('hà nội') ||
        query.toLowerCase().includes('hanoi')
          ? query
          : `${query}, Hà Nội, Việt Nam`;

      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchParam
        )}&limit=1`,
        { headers: { 'Accept-Language': 'vi' } }
      );
      let data = await response.json();

      // If empty, try without Hanoi/Vietnam suffix
      if (!data || data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=1`,
          { headers: { 'Accept-Language': 'vi' } }
        );
        data = await response.json();
      }

      if (data && data.length > 0) {
        const foundLat = parseFloat(data[0].lat);
        const foundLng = parseFloat(data[0].lon);
        const shortName = data[0].display_name.split(',')[0];

        const newCoords = { lat: foundLat, lng: foundLng };
        setUserCoords(newCoords);
        setMapTargetCoords([foundLat, foundLng]);
        setMapZoom(16);

        // Find nearest spa to this address
        const nearestSpa = [...spas].sort((a, b) => {
          const distA = calculateDistanceNum(foundLat, foundLng, a.lat, a.lng);
          const distB = calculateDistanceNum(foundLat, foundLng, b.lat, b.lng);
          return distA - distB;
        })[0];

        if (nearestSpa) {
          setSelectedSpa(nearestSpa);
        }

        setLocationNotice({
          type: 'success',
          message: `Đã định vị: ${shortName}! Đang quét các Spa quanh khu vực này.`,
        });
        setTimeout(() => setLocationNotice(null), 4500);
      } else {
        setLocationNotice({
          type: 'error',
          message: `Không tìm thấy địa chỉ "${query}". Hãy thử nhập kèm tên đường/quận (VD: 88 Hào Nam, Đống Đa).`,
        });
        setTimeout(() => setLocationNotice(null), 5000);
      }
    } catch (err) {
      console.error('Geocoding search error:', err);
      setLocationNotice({
        type: 'error',
        message: 'Lỗi kết nối định vị địa chỉ. Bạn vui lòng thử lại sau giây lát.',
      });
      setTimeout(() => setLocationNotice(null), 4000);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  // Submit search (Enter or click button)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    if (matchedSpas.length > 0) {
      handleSelectExactSpa(matchedSpas[0]);
    } else {
      handleSearchAddress(searchQuery);
    }
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Selecting a card from the left panel
  const handleSelectSpaCard = (spa) => {
    setSelectedSpa(spa);
    setMapTargetCoords([spa.lat, spa.lng]);
    setMapZoom(16.5);
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

  // Filter spas by radius and service (and prioritize search query matches)
  const filteredSpas = useMemo(() => {
    return spasWithDistance.filter((spa) => {
      const q = searchQuery.toLowerCase().trim();
      const hasSpaMatch = q && spas.some((s) => s.name.toLowerCase().includes(q));

      // If user searched a spa name specifically, prioritize showing matching spas
      if (hasSpaMatch) {
        const matchName = spa.name.toLowerCase().includes(q);
        const matchService = spa.services?.some((s) => s.name.toLowerCase().includes(q));
        if (matchName || matchService) {
          return true;
        }
      }

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
  }, [spasWithDistance, selectedRadius, selectedService, searchQuery, spas]);

  const handleRefreshArea = () => {
    setMapTargetCoords([userCoords.lat, userCoords.lng]);
    setMapZoom(15);
    setSelectedSpa(filteredSpas[0] || null);
    setLocationNotice({
      type: 'info',
      message: 'Đã quét lại các tiệm Spa trong khu vực hiện tại.',
    });
    setTimeout(() => setLocationNotice(null), 3000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-108px)] min-h-[620px] max-h-[920px] flex flex-col md:flex-row bg-slate-50 dark:bg-[#0b1320] text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* LEFT PANEL (Responsive to Light & Dark Mode) */}
      <div className="w-full md:w-[440px] lg:w-[480px] h-full flex flex-col bg-white dark:bg-[#0d1526] border-r border-slate-200 dark:border-slate-800 z-10 shrink-0 transition-colors duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0 bg-white/95 dark:bg-[#0d1526]/95 backdrop-blur-md">
          {/* Brand Tagline Badge */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>PETOSORY-Nền tảng chăm sóc thú cưng One For All</span>
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-xl font-bold">📍</span>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide uppercase">
              TÌM PET SPA & GROOMING GẦN BẠN NHẤT
            </h1>
          </div>

          {/* Dedicated Exact Spa & Address Search Bar */}
          <div ref={searchContainerRef} className="relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-1.5">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Nhập tên Spa (Petosory, Paws...) hoặc địa chỉ..."
                  className="w-full bg-slate-100 hover:bg-slate-200/80 focus:bg-white dark:bg-[#162136] dark:hover:bg-[#1a2742] dark:focus:bg-[#111927] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium py-2.5 pl-9 pr-8 rounded-xl border border-slate-300 dark:border-slate-700/60 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Xóa từ khóa"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isSearchingAddress}
                className="px-3.5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-75 disabled:cursor-wait cursor-pointer"
                title="Tìm kiếm"
              >
                {isSearchingAddress ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Tìm...</span>
                  </>
                ) : (
                  <span>Tìm</span>
                )}
              </button>
            </form>

            {/* Autocomplete Suggestions Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#111928] rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-scale-up">
                {/* Matched Spas */}
                {matchedSpas.length > 0 && (
                  <div className="p-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Gợi ý tiệm Spa ({matchedSpas.length})
                    </div>
                    {matchedSpas.map((spa) => (
                      <button
                        key={spa.id}
                        type="button"
                        onClick={() => handleSelectExactSpa(spa)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-[#1c283f] flex items-center gap-2.5 transition-colors group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          🐾
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400">
                              {spa.name}
                            </p>
                            <span className="text-[10px] text-amber-500 font-bold shrink-0">
                              ★ {spa.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {spa.address}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Geocode Address Option */}
                <div className="border-t border-slate-100 dark:border-slate-800 p-1">
                  <button
                    type="button"
                    onClick={() => handleSearchAddress(searchQuery)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a2333] flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-semibold transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-orange-500" />
                    <span className="truncate">
                      Tìm vị trí: "<strong className="text-slate-900 dark:text-white">{searchQuery}</strong>" trên bản đồ
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Three Filter Dropdowns */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Dropdown 1: Vị trí */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
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
                {searchQuery.trim()
                  ? `Không tìm thấy Spa nào khớp với "${searchQuery}" trong bán kính ${selectedRadius}km.`
                  : `Không có Spa nào trong bán kính ${selectedRadius}km từ vị trí hiện tại của bạn.`}
              </p>
              <div className="flex flex-col gap-2 pt-1">
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Xóa từ khóa tìm kiếm
                  </button>
                )}
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
                    handleClearSearch();
                    setUserCoords({ lat: 21.0182, lng: 105.8245 });
                    setMapTargetCoords([21.0182, 105.8245]);
                    setMapZoom(15);
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
                  onClick={() => handleSelectSpaCard(spa)}
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
          center={mapTargetCoords}
          zoom={mapZoom}
          spas={filteredSpas}
          selectedSpa={selectedSpa}
          onSelectSpa={handleSelectSpaCard}
          onBookSpa={setBookingSpa}
          userLocation={userCoords}
          radiusMeters={420}
          onRefreshArea={handleRefreshArea}
          onLocateUser={handleLocateUser}
          isLocating={isLocating}
          hideOverlays={Boolean(bookingSpa)}
          className="w-full h-full min-h-[550px]"
        />

        {/* Floating Notification for Location Request / Status */}
        {locationNotice && !bookingSpa && (
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

