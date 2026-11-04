import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { spaService } from '../services/spaService';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';
import BookingModal from '../components/spa/BookingModal';
import RatingStars from '../components/common/RatingStars';

export const SpaDetailPage = () => {
  const { id } = useParams();
  const [spa, setSpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchSpa = async () => {
      setLoading(true);
      try {
        const data = await spaService.getSpaById(id);
        setSpa(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpa();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs text-slate-500">Đang tải thông tin cơ sở Spa...</p>
      </div>
    );
  }

  if (!spa) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy cơ sở Spa</h2>
        <Link to="/" className="text-orange-600 text-xs font-bold underline mt-2 block">
          Quay lại Trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-orange-600">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-medium truncate">{spa.name}</span>
      </nav>

      {/* Spa Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[320px] flex items-end p-6 sm:p-10 shadow-xl">
        <img
          src={spa.image}
          alt={spa.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            {spa.verified && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-4 h-4" /> Đối tác kiểm định Petosory
              </span>
            )}
            <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-slate-900" /> {spa.rating} ({spa.reviewCount} đánh giá)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black">{spa.name}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" /> {spa.address}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" /> {spa.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" /> {spa.openTime}
            </span>
          </div>
        </div>

        <div className="absolute top-6 right-6 hidden sm:block">
          <Button
            variant="primary"
            size="lg"
            icon={Calendar}
            onClick={() => setBookingModalOpen(true)}
          >
            Đặt lịch chăm sóc ngay
          </Button>
        </div>
      </div>

      {/* Grid: Services & Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Services menu */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" /> Bảng giá dịch vụ niêm yết
            </h3>
            <p className="text-xs text-slate-500">
              Cam kết dịch vụ đúng quy trình, sử dụng sữa tắm hữu cơ nhập khẩu an toàn cho da nhạy cảm.
            </p>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {spa.services.map((srv, idx) => (
                <div
                  key={idx}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                      {srv.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Thời lượng ước tính: {srv.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="text-base font-black text-orange-600">
                      {formatCurrency(srv.price)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBookingModalOpen(true)}
                    >
                      Đặt dịch vụ này
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About description */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Giới thiệu về cơ sở
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {spa.description}
            </p>
          </div>
        </div>

        {/* Right: Booking widget & policies */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-4 sticky top-24">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              Đặt lịch hẹn nhanh
            </h4>
            <p className="text-xs text-slate-500">
              Không cần thanh toán trước, chỉ xác nhận thông tin khi nhân viên gọi tiếp đón.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              icon={Calendar}
              onClick={() => setBookingModalOpen(true)}
            >
              Chọn ngày giờ hẹn
            </Button>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Không phát sinh chi phí bất ngờ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Nhắc lịch tự động qua tin nhắn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Khử trùng chuồng lưu trú trước và sau mỗi bé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        spa={spa}
      />
    </div>
  );
};
export default SpaDetailPage;
