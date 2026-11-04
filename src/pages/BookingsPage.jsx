import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  PawPrint,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Info,
  ShieldCheck,
  Plus,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { spaService } from '../services/spaService';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export const BookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Cancel Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Bận việc đột xuất không thể đưa bé qua');
  const [customReason, setCustomReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Detail Modal State
  const [detailBooking, setDetailBooking] = useState(null);

  // Success Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Timer tick every 30s to update remaining cancel time live
  const [, setTimerTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const all = await spaService.getSpaBookings('ALL');
      setAllBookings(all);
      if (activeTab === 'ALL') {
        setBookings(all);
      } else {
        setBookings(all.filter((b) => b.status === activeTab));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open Cancel Modal
  const handleOpenCancelModal = (booking) => {
    const check = spaService.checkBookingCancelable(booking);
    if (!check.canCancel) {
      alert(check.message);
      return;
    }
    setCancelModalBooking(booking);
    setCancelReason('Bận việc đột xuất không thể đưa bé qua');
    setCustomReason('');
    setCancelError('');
  };

  // Confirm Cancel
  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setIsCancelling(true);
    setCancelError('');

    const finalReason =
      cancelReason === 'Khác' && customReason.trim()
        ? customReason.trim()
        : cancelReason;

    try {
      await spaService.cancelSpaBooking(cancelModalBooking.id, finalReason);
      setCancelModalBooking(null);
      showToast(`Đã hủy thành công lịch hẹn #${cancelModalBooking.id}!`);
      await fetchBookings();
    } catch (err) {
      setCancelError(err.message || 'Lỗi khi hủy lịch hẹn');
    } finally {
      setIsCancelling(false);
    }
  };

  // Format date helper
  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')} - ${d.getDate().toString().padStart(2, '0')}/${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Counts
  const totalCount = allBookings.length;
  const pendingCount = allBookings.filter((b) => b.status === 'PENDING').length;
  const confirmedCount = allBookings.filter((b) => b.status === 'CONFIRMED').length;
  const cancelledCount = allBookings.filter((b) => b.status === 'CANCELLED').length;

  const tabs = [
    { id: 'ALL', label: 'Tất cả lịch hẹn' },
    { id: 'PENDING', label: 'Chờ Spa xác nhận' },
    { id: 'CONFIRMED', label: 'Đã xác nhận' },
    { id: 'CANCELLED', label: 'Đã hủy' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md animate-scale-up">
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/" className="hover:text-orange-600 transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Lịch hẹn của tôi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-orange-500" />
            Quản lý Lịch hẹn Spa & Grooming
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Xem lại thông tin các buổi chăm sóc, làm đẹp cho thú cưng và quản lý chính sách hủy lịch hẹn
          </p>
        </div>

        <Link to="/map">
          <Button variant="primary" size="md" icon={Plus}>
            Đặt lịch Spa mới
          </Button>
        </Link>
      </div>

      {/* Cancellation Policy Banner (chính sách chỉ cho hủy trong khoảng 3h) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-slate-900 border border-orange-200/80 dark:border-orange-800/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-orange-900 dark:text-orange-300 flex items-center gap-2">
              <span>Chính sách hủy lịch hẹn của Petosory</span>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 font-extrabold">
                Thời hạn 3 Giờ
              </span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              Quý khách chỉ có thể <strong>hủy lịch hẹn trực tuyến trong vòng 3 giờ</strong> kể từ thời điểm đặt lịch. Quá 3 giờ, hệ thống sẽ chốt danh sách phục vụ cho Spa để chuẩn bị nhân sự và đồ dùng, do đó quý khách sẽ <strong>không thể hủy trực tuyến</strong> nữa. Trường hợp có việc khẩn cấp, vui lòng liên hệ trực tiếp hotline của Spa để được hỗ trợ.
            </p>
          </div>
        </div>

        <div className="shrink-0 text-xs font-semibold text-orange-700 dark:text-orange-400 bg-white/80 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-orange-200 dark:border-slate-700">
          Hotline hỗ trợ: <strong className="text-orange-600 dark:text-orange-400 font-bold">1900 6868</strong>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-400'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.id === 'ALL'
                  ? totalCount
                  : tab.id === 'PENDING'
                  ? pendingCount
                  : tab.id === 'CONFIRMED'
                  ? confirmedCount
                  : cancelledCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Đang tải danh sách lịch hẹn...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-[#111928] rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center mx-auto text-2xl shadow-inner">
            📅
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
              Không tìm thấy lịch hẹn nào
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {activeTab === 'ALL'
                ? 'Bạn chưa có lịch hẹn nào. Hãy tìm Spa uy tín gần bạn và đặt lịch chăm sóc cho bé cưng ngay nhé!'
                : `Không có lịch hẹn nào ở trạng thái "${
                    tabs.find((t) => t.id === activeTab)?.label
                  }".`}
            </p>
          </div>
          <Link to="/map" className="inline-block pt-2">
            <Button variant="primary" size="md" icon={Plus}>
              Khám phá Pet Map & Đặt lịch
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const cancelCheck = spaService.checkBookingCancelable(booking);
            const isPending = booking.status === 'PENDING';
            const isConfirmed = booking.status === 'CONFIRMED';
            const isCancelled = booking.status === 'CANCELLED';

            return (
              <div
                key={booking.id}
                className={`bg-white dark:bg-[#111928] rounded-2xl border transition-all hover:shadow-md ${
                  isCancelled
                    ? 'border-slate-200 dark:border-slate-800/80 opacity-90'
                    : isPending
                    ? 'border-amber-300 dark:border-amber-800/80 hover:border-amber-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-orange-500/40'
                }`}
              >
                {/* Header bar of Card */}
                <div className="p-4 sm:px-6 sm:py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2.5 py-1 rounded-lg">
                      #{booking.id}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Đặt lúc: {formatDateTime(booking.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        CHỜ SPA XÁC NHẬN
                      </span>
                    )}
                    {isConfirmed && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ĐÃ XÁC NHẬN
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        ĐÃ HỦY
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Spa Info (Col 5) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Cơ sở tiếp đón
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                        {booking.spaName}
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>{booking.spaAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                        <span>Hotline Spa: <strong className="font-semibold text-slate-800 dark:text-slate-200">{booking.spaPhone || '1900 6868'}</strong></span>
                      </div>
                    </div>

                    {booking.note && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Ghi chú cho Spa: </span>
                        <span>{booking.note}</span>
                      </div>
                    )}
                  </div>

                  {/* Middle: Appointment & Pet Details (Col 4) */}
                  <div className="lg:col-span-4 space-y-3 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6 pt-4 lg:pt-0">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Thời gian hẹn gặp
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 font-black text-sm sm:text-base flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{booking.bookingTime}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>{booking.bookingDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Dịch vụ:</span>
                        <strong className="text-slate-900 dark:text-white font-bold text-right truncate max-w-[180px]">
                          {booking.serviceName}
                        </strong>
                      </div>
                      {booking.price && (
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Chi phí dự kiến:</span>
                          <strong className="text-orange-600 font-bold">
                            {formatCurrency(booking.price)}
                          </strong>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Bé cưng:</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {booking.petName} ({booking.petType === 'cat' ? '🐱 Mèo' : '🐶 Chó'})
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Người đặt:</span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {booking.contactName} ({booking.contactPhone})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Cancellation Action & Status (Col 3) */}
                  <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between h-full space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Hủy & Thao tác
                    </span>

                    {/* PENDING: Chờ Spa duyệt & check 3-hour policy */}
                    {isPending && (
                      <div className="space-y-3">
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-snug">
                          <span className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-400">
                            <Clock className="w-3.5 h-3.5 animate-pulse" /> Đang chờ Chủ Spa xác nhận
                          </span>
                          <span className="block mt-1">
                            {cancelCheck.canCancel ? (
                              <>
                                Còn <strong>{cancelCheck.remainingText}</strong> trong thời hạn 3 giờ để bạn hủy lịch nếu đổi ý.
                              </>
                            ) : (
                              'Đã quá 3 giờ kể từ khi đặt lịch.'
                            )}
                          </span>
                        </div>

                        {cancelCheck.canCancel ? (
                          <button
                            type="button"
                            onClick={() => handleOpenCancelModal(booking)}
                            className="w-full py-2 px-3 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hủy lịch hẹn</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title="Đã quá thời hạn 3 giờ kể từ khi đặt lịch"
                            className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-400 border border-slate-200 dark:border-slate-700/60 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5 opacity-50" />
                            <span>Không thể hủy (&gt; 3h)</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setDetailBooking(booking)}
                          className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Xem chi tiết</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* CONFIRMED: check 3-hour policy */}
                    {isConfirmed && (
                      <div className="space-y-3">
                        {cancelCheck.canCancel ? (
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-snug">
                              <span className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-400">
                                <Clock className="w-3.5 h-3.5" /> Có thể hủy trực tuyến
                              </span>
                              <span className="block mt-0.5">
                                Còn <strong>{cancelCheck.remainingText}</strong> trong thời hạn 3 giờ cho phép hủy.
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenCancelModal(booking)}
                              className="w-full py-2 px-3 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Hủy lịch hẹn</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                                Hết thời hạn hủy (&gt; 3h)
                              </span>
                              <p className="mt-0.5 text-[10px]">
                                Đã quá 3 giờ kể từ khi đặt. Vui lòng gọi Hotline Spa <strong>{booking.spaPhone || '1900 6868'}</strong> nếu cần hỗ trợ đổi lịch.
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled
                              title="Đã quá thời hạn 3 giờ kể từ khi đặt lịch"
                              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-400 border border-slate-200 dark:border-slate-700/60 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5 opacity-50" />
                              <span>Không thể hủy (&gt; 3h)</span>
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setDetailBooking(booking)}
                          className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Xem chi tiết</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* CANCELLED state */}
                    {isCancelled && (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-[11px] text-rose-800 dark:text-rose-300">
                          <p className="font-bold text-rose-700 dark:text-rose-400">
                            Đã hủy lúc:
                          </p>
                          <p className="text-[10px]">{formatDateTime(booking.cancelledAt)}</p>
                          {booking.cancelReason && (
                            <p className="mt-1 text-[10px] italic">
                              "{booking.cancelReason}"
                            </p>
                          )}
                        </div>

                        <Link
                          to={`/spa/${booking.spaId || 'spa-1'}`}
                          className="block w-full"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            icon={RotateCcw}
                            className="w-full text-xs"
                          >
                            Đặt lại dịch vụ này
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANCEL BOOKING MODAL */}
      {cancelModalBooking && (
        <Modal
          isOpen={Boolean(cancelModalBooking)}
          onClose={() => setCancelModalBooking(null)}
          title="Xác nhận Hủy Lịch Hẹn"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 dark:text-rose-200 space-y-1">
                <p className="font-bold">
                  Bạn có chắc chắn muốn hủy lịch hẹn #{cancelModalBooking.id}?
                </p>
                <p>
                  Lịch hẹn tại <strong>{cancelModalBooking.spaName}</strong> vào lúc{' '}
                  <strong>{cancelModalBooking.bookingTime}</strong> ngày{' '}
                  <strong>{cancelModalBooking.bookingDate}</strong> sẽ bị hủy và không thể khôi phục lại.
                </p>
              </div>
            </div>

            {/* Time remaining indicator */}
            {(() => {
              const check = spaService.checkBookingCancelable(cancelModalBooking);
              return (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Thời hạn hủy lịch:</span>
                  </span>
                  <strong className="font-bold">{check.message}</strong>
                </div>
              );
            })()}

            {/* Reason selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Vui lòng chọn lý do hủy lịch hẹn:
              </label>

              {[
                'Bận việc đột xuất không thể đưa bé qua',
                'Bé cưng không khỏe / có thay đổi sức khỏe',
                'Muốn đổi sang ngày / khung giờ khác',
                'Muốn đổi sang dịch vụ hoặc cơ sở khác',
                'Khác',
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    cancelReason === reason
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 font-bold text-orange-900 dark:text-orange-200'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {cancelReason === 'Khác' && (
                <textarea
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do cụ thể của bạn..."
                  className="w-full mt-2 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              )}
            </div>

            {cancelError && (
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-semibold">
                {cancelError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCancelModalBooking(null)}
                disabled={isCancelling}
              >
                Giữ lại lịch hẹn
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleConfirmCancel}
                loading={isCancelling}
              >
                Xác nhận Hủy Lịch
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* DETAIL MODAL */}
      {detailBooking && (
        <Modal
          isOpen={Boolean(detailBooking)}
          onClose={() => setDetailBooking(null)}
          title={`Chi tiết Lịch hẹn #${detailBooking.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Trạng thái:</span>
              {detailBooking.status === 'PENDING' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
                  <Clock className="w-3 h-3 animate-pulse text-amber-600" /> CHỜ SPA XÁC NHẬN
                </span>
              ) : detailBooking.status === 'CONFIRMED' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ĐÃ XÁC NHẬN
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300">
                  <XCircle className="w-3 h-3 text-rose-600" /> ĐÃ HỦY
                </span>
              )}
            </div>

            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-slate-500">Cơ sở Spa:</span>
                <strong className="text-slate-800 dark:text-white">{detailBooking.spaName}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Địa chỉ:</span>
                <span className="text-right text-slate-700 dark:text-slate-300 max-w-[220px]">
                  {detailBooking.spaAddress}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Hotline Spa:</span>
                <span className="font-bold text-orange-600">{detailBooking.spaPhone || '1900 6868'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Dịch vụ:</span>
                <strong className="text-slate-800 dark:text-white">{detailBooking.serviceName}</strong>
              </p>
              {detailBooking.price && (
                <p className="flex justify-between">
                  <span className="text-slate-500">Giá niêm yết:</span>
                  <span className="font-bold text-orange-600">{formatCurrency(detailBooking.price)}</span>
                </p>
              )}
              <p className="flex justify-between">
                <span className="text-slate-500">Bé cưng:</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {detailBooking.petName} ({detailBooking.petType === 'cat' ? 'Mèo' : 'Chó'})
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Thời gian hẹn:</span>
                <strong className="text-orange-600">
                  {detailBooking.bookingTime} - ngày {detailBooking.bookingDate}
                </strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Người đặt:</span>
                <span>{detailBooking.contactName} ({detailBooking.contactPhone})</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Thời gian tạo:</span>
                <span>{formatDateTime(detailBooking.createdAt)}</span>
              </p>
              {detailBooking.note && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1">Ghi chú:</span>
                  <p className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 italic">
                    "{detailBooking.note}"
                  </p>
                </div>
              )}
              {detailBooking.status === 'CANCELLED' && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-rose-600">
                  <span className="text-slate-500 block mb-1">Thông tin hủy lịch:</span>
                  <p>Hủy lúc: {formatDateTime(detailBooking.cancelledAt)}</p>
                  <p>Lý do: {detailBooking.cancelReason}</p>
                </div>
              )}
            </div>

            <Button variant="primary" size="md" onClick={() => setDetailBooking(null)} className="w-full">
              Đóng
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingsPage;

