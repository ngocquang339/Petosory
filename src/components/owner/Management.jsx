import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  MapPin,
  Search,
  Crosshair,
  Sparkles,
  Building2,
  Phone,
  Clock,
  ExternalLink,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createPetPinIcon } from '../../utils/maps';
import { spaService } from '../../services/spaService';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';
import Input from '../common/Input';
import { Link } from 'react-router-dom';

// Controller to smoothly fly to new coordinates
const MapFlyTo = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 16, { duration: 0.8 });
    }
  }, [center, map]);

  return null;
};

// Map click listener to pick coordinates
const LocationPickerEvents = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });
  return null;
};

export const Management = ({ spa, onSpaUpdated }) => {
  const [allSpas, setAllSpas] = useState([]);
  const [selectedSpaId, setSelectedSpaId] = useState(spa?.id || 'spa-1');
  const [isNewSpaMode, setIsNewSpaMode] = useState(false);

  // Form states
  const [spaName, setSpaName] = useState(spa?.name || 'Petosory Flagship Spa - 142 Hoàng Cầu');
  const [phone, setPhone] = useState(spa?.phone || '0988 123 456');
  const [address, setAddress] = useState(spa?.address || '142 Hoàng Cầu, Đống Đa, Hà Nội');
  const [openTime, setOpenTime] = useState(spa?.openTime || '08:00 - 20:30');
  const [lat, setLat] = useState(spa?.lat || 21.0192);
  const [lng, setLng] = useState(spa?.lng || 105.8252);
  const [services, setServices] = useState(
    spa?.services || [
      { name: 'Tắm spa sục ozon & sấy tạo kiểu', price: 180000, duration: '60 phút' },
      { name: 'Cắt tỉa tạo kiểu lông Poodle chuẩn Hàn Quốc', price: 250000, duration: '90 phút' },
    ]
  );

  // New service inputs
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // UI state
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeMsg, setGeocodeMsg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(null);

  // Load spas list
  const loadSpasList = async () => {
    try {
      const list = await spaService.getSpas();
      setAllSpas(list);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    loadSpasList();
  }, []);

  // When selecting an existing spa
  const handleSelectSpa = (s) => {
    setIsNewSpaMode(false);
    setSelectedSpaId(s.id);
    setSpaName(s.name);
    setPhone(s.phone || '');
    setAddress(s.address || '');
    setOpenTime(s.openTime || '08:00 - 20:30');
    setLat(Number(s.lat) || 21.0182);
    setLng(Number(s.lng) || 105.8245);
    setServices(s.services || []);
    setGeocodeMsg(null);
  };

  // Start creating brand new spa
  const handleStartNewSpa = () => {
    setIsNewSpaMode(true);
    setSelectedSpaId(null);
    setSpaName('Moon Pet Spa & Grooming');
    setPhone('0912 345 678');
    setAddress('88 Hào Nam, Đống Đa, Hà Nội');
    setOpenTime('08:00 - 21:00');
    setLat(21.0251);
    setLng(105.8273);
    setServices([
      { name: 'Tắm khoáng sủi bọt phục hồi lông', price: 200000, duration: '60 phút' },
      { name: 'Grooming cắt tỉa trọn gói theo yêu cầu', price: 300000, duration: '90 phút' },
    ]);
    setGeocodeMsg(null);
  };

  // Geocode address using OpenStreetMap Nominatim API
  const handleGeocodeAddress = async () => {
    if (!address.trim()) {
      alert('Vui lòng nhập địa chỉ trước khi tìm tọa độ!');
      return;
    }
    setIsGeocoding(true);
    setGeocodeMsg(null);
    try {
      const query = address.includes('Hà Nội') ? address : `${address}, Hà Nội, Việt Nam`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'vi,en',
        },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const foundLat = parseFloat(Number(data[0].lat).toFixed(6));
        const foundLng = parseFloat(Number(data[0].lon).toFixed(6));
        setLat(foundLat);
        setLng(foundLng);
        setGeocodeMsg({
          type: 'success',
          text: `Đã định vị thành công: [${foundLat}, ${foundLng}]`,
        });
      } else {
        setGeocodeMsg({
          type: 'warning',
          text: 'Không tìm thấy tọa độ chính xác. Hãy click trực tiếp trên bản đồ bên dưới để ghim vị trí quán!',
        });
      }
    } catch (err) {
      setGeocodeMsg({
        type: 'warning',
        text: 'Lỗi tra cứu tự động. Bạn có thể click chuột trực tiếp lên bản đồ để chọn tọa độ.',
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  // Locate current user position
  const handleLocateCurrentPosition = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị GPS');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = parseFloat(pos.coords.latitude.toFixed(6));
        const currentLng = parseFloat(pos.coords.longitude.toFixed(6));
        setLat(currentLat);
        setLng(currentLng);
        setGeocodeMsg({
          type: 'success',
          text: `Đã lấy tọa độ GPS hiện tại: [${currentLat}, ${currentLng}]`,
        });
      },
      () => {
        alert('Không thể truy cập GPS vị trí hiện tại');
      }
    );
  };

  // Service Management
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    setServices([
      ...services,
      { name: newServiceName, price: Number(newServicePrice), duration: '60 phút' },
    ]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Save / Register Spa
  const handleSaveSpa = async () => {
    if (!spaName.trim()) {
      alert('Vui lòng nhập tên cơ sở Spa!');
      return;
    }
    if (!address.trim()) {
      alert('Vui lòng nhập địa chỉ cơ sở!');
      return;
    }

    setIsSaving(true);
    setSavedSuccessMsg(null);

    try {
      const spaPayload = {
        id: isNewSpaMode ? undefined : selectedSpaId,
        name: spaName,
        phone,
        address,
        openTime,
        lat: Number(lat),
        lng: Number(lng),
        services,
      };

      const savedSpa = await spaService.saveSpa(spaPayload);
      await loadSpasList();
      setSelectedSpaId(savedSpa.id);
      setIsNewSpaMode(false);

      if (onSpaUpdated) {
        onSpaUpdated(savedSpa);
      }

      setSavedSuccessMsg(
        `Đã lưu và ghim thành công cơ sở "${savedSpa.name}" lên Pet Map (Database Cloud)!`
      );
      setTimeout(() => setSavedSuccessMsg(null), 5000);
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu cơ sở Spa');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-8">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-orange-100 dark:bg-orange-950/60 text-orange-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Quản lý Cơ sở Spa & Định vị Pet Map
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Đăng ký cơ sở mới, ghim tọa độ GPS lên bản đồ và quản lý bảng giá dịch vụ
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={isNewSpaMode ? 'primary' : 'outline'}
            size="sm"
            icon={Plus}
            onClick={handleStartNewSpa}
          >
            Đăng ký cơ sở Spa mới
          </Button>
          <Link to="/map" target="_blank">
            <Button variant="ghost" size="sm" icon={ExternalLink}>
              Xem Pet Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Select existing Spa list chips */}
      {allSpas.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Chọn cơ sở cần quản lý:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {allSpas.map((s) => {
              const isSelected = !isNewSpaMode && selectedSpaId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSpa(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                      : 'bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Alert for New vs Edit */}
      {isNewSpaMode ? (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 font-medium">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Bạn đang ở chế độ: <strong>Đăng ký cơ sở Spa mới</strong>. Điền thông tin và ghim vị trí bên dưới để xuất hiện trên Pet Map!
            </span>
          </span>
        </div>
      ) : null}

      {/* Basic Spa Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span>1. Thông tin cơ bản</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tên cơ sở Spa"
            value={spaName}
            onChange={(e) => setSpaName(e.target.value)}
            placeholder="VD: Moon Pet Spa & Grooming"
          />
          <Input
            label="Số điện thoại Hotline CSKH"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="VD: 0988 123 456"
          />
          <Input
            label="Địa chỉ cụ thể"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="VD: 88 Hào Nam, Đống Đa, Hà Nội"
          />
          <Input
            label="Thời gian hoạt động"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            placeholder="VD: 08:00 - 21:00"
          />
        </div>
      </div>

      {/* Map Positioning Section (2 CÁCH CHỌN VỊ TRÍ) */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>2. Xác định vị trí trên Bản đồ Pet Map (Tọa độ GPS)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hệ thống dùng tọa độ này để cắm ghim cam hình giọt nước có icon dấu chân thú cưng trên Pet Map
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGeocodeAddress}
              disabled={isGeocoding}
              className="px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="Tự động tìm kiếm tọa độ GPS dựa trên địa chỉ bạn đã nhập ở trên"
            >
              {isGeocoding ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span>Đang tìm...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tự động định vị từ địa chỉ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLocateCurrentPosition}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Lấy tọa độ GPS tại vị trí hiện tại của thiết bị"
            >
              <Crosshair className="w-3.5 h-3.5 text-sky-500" />
              <span>Vị trí hiện tại</span>
            </button>
          </div>
        </div>

        {/* Geocode feedback message */}
        {geocodeMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              geocodeMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{geocodeMsg.text}</span>
          </div>
        )}

        {/* Coordinate Display Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Vĩ độ (Latitude):
            </label>
            <input
              type="number"
              step="0.000001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 21.0182)}
              className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Kinh độ (Longitude):
            </label>
            <input
              type="number"
              step="0.000001"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 105.8245)}
              className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400"
            />
          </div>
        </div>

        {/* Interactive Mini Leaflet Map */}
        <div className="space-y-2">
          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border-2 border-orange-300 dark:border-orange-800/80 shadow-md">
            <MapContainer
              center={[lat, lng]}
              zoom={16}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                attribution="&copy; Google Maps"
              />
              <MapFlyTo center={[lat, lng]} />
              <LocationPickerEvents
                onSelect={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                  setGeocodeMsg({
                    type: 'success',
                    text: `Đã chọn điểm trên bản đồ: [${newLat}, ${newLng}]`,
                  });
                }}
              />
              <Marker
                position={[lat, lng]}
                icon={createPetPinIcon(true)}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    const newLat = Number(position.lat.toFixed(6));
                    const newLng = Number(position.lng.toFixed(6));
                    setLat(newLat);
                    setLng(newLng);
                    setGeocodeMsg({
                      type: 'success',
                      text: `Đã kéo ghim tới tọa độ: [${newLat}, ${newLng}]`,
                    });
                  },
                }}
              />
            </MapContainer>

            {/* Float hint overlay */}
            <div className="absolute top-3 left-3 z-[1000] pointer-events-none">
              <span className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 text-[11px] font-bold shadow-md backdrop-blur-xs border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-orange-500" />
                Click chuột hoặc kéo ghim để định vị quán
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Ghim màu cam này sẽ hiển thị chính xác tại vị trí này trên bản đồ cho tất cả khách hàng khi đặt lịch.
          </p>
        </div>
      </div>

      {/* Services Menu Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center justify-between">
          <span>3. Bảng giá dịch vụ chăm sóc thú cưng:</span>
          <span className="text-xs font-normal text-slate-400">
            {services.length} dịch vụ
          </span>
        </h4>

        <div className="space-y-2 mb-4">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 dark:text-white">{srv.name}</span>
                <span className="text-slate-400 ml-2">({srv.duration || '60 phút'})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-orange-600 dark:text-orange-400">
                  {formatCurrency(srv.price)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveService(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  title="Xóa dịch vụ này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new service */}
        <form onSubmit={handleAddService} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Tên dịch vụ mới (VD: Nhuộm tai, Tắm sục ozon...)"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
          <input
            type="number"
            placeholder="Giá (VNĐ)"
            value={newServicePrice}
            onChange={(e) => setNewServicePrice(e.target.value)}
            className="w-full sm:w-36 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
          <Button type="submit" size="sm" variant="secondary" icon={Plus}>
            Thêm dịch vụ
          </Button>
        </form>
      </div>

      {/* Save Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
        <div>
          {savedSuccessMsg && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-scale-up">
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedSuccessMsg}</span>
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={Save}
          onClick={handleSaveSpa}
          loading={isSaving}
          className="w-full sm:w-auto shadow-md shadow-orange-500/25"
        >
          {isNewSpaMode ? 'Đăng ký & Ghim lên Pet Map' : 'Lưu & Cập nhật lên Pet Map'}
        </Button>
      </div>
    </div>
  );
};

export default Management;
