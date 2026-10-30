import React, { useState } from 'react';
import { useMap } from '../hooks/useMap';
import { useLocation } from '../hooks/useLocation';
import Map from '../components/map/Map';
import SearchBox from '../components/map/SearchBox';
import SpaList from '../components/spa/SpaList';
import SpaMapCard from '../components/map/SpaMapCard';
import BookingModal from '../components/spa/BookingModal';
import { MapPin, Filter, Navigation } from 'lucide-react';

export const MapPage = () => {
  const {
    spas,
    selectedSpa,
    setSelectedSpa,
    loading,
    searchQuery,
    setSearchQuery,
    userCoords,
  } = useMap();
  const { locateUser, isLocating, locationError, selectedCity } = useLocation();

  const [bookingSpa, setBookingSpa] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'spa', label: 'Tắm Spa & Cắt tỉa' },
    { id: 'clinic', label: 'Khám thú y' },
    { id: 'hotel', label: 'Khách sạn thú cưng' },
  ];

  const filteredSpas = spas.filter((spa) => {
    if (filterType === 'all') return true;
    if (filterType === 'spa')
      return spa.services.some((s) => s.name.toLowerCase().includes('tắm') || s.name.toLowerCase().includes('tỉa'));
    if (filterType === 'clinic')
      return spa.name.toLowerCase().includes('thú y') || spa.services.some((s) => s.name.toLowerCase().includes('khám') || s.name.toLowerCase().includes('vaccine'));
    if (filterType === 'hotel')
      return spa.services.some((s) => s.name.toLowerCase().includes('khách sạn'));
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Bản đồ Dịch vụ Thú cưng Pet Map
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tìm kiếm cơ sở spa, khách sạn, phòng khám thú y được kiểm định chất lượng tại {selectedCity.name}.
          </p>
        </div>

        {locationError && (
          <span className="text-xs text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
            {locationError}
          </span>
        )}
      </div>

      {/* Main interactive split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left Side: Search & Spas List */}
        <div className="lg:col-span-5 flex flex-col space-y-3 h-full overflow-hidden">
          {/* Search Box */}
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            onLocateMe={locateUser}
            isLocating={isLocating}
          />

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  filterType === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List of Spas */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Tìm thấy <b>{filteredSpas.length}</b> cơ sở phù hợp</span>
              <span>Bấm vào thẻ để định vị trên bản đồ</span>
            </div>

            <SpaList
              spas={filteredSpas}
              selectedSpa={selectedSpa}
              onSelectSpa={setSelectedSpa}
              onBookSpa={setBookingSpa}
            />
          </div>
        </div>

        {/* Right Side: Map Container */}
        <div className="lg:col-span-7 h-full relative">
          <Map
            center={[selectedCity.lat, selectedCity.lng]}
            zoom={13}
            spas={filteredSpas}
            selectedSpa={selectedSpa}
            onSelectSpa={setSelectedSpa}
            userLocation={userCoords}
            className="w-full h-full min-h-[400px]"
          />

          {/* Floating selected spa card on map */}
          {selectedSpa && (
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto z-[1000] pointer-events-auto">
              <SpaMapCard spa={selectedSpa} onBookClick={setBookingSpa} />
            </div>
          )}
        </div>
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
export default MapPage;

