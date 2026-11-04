import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CalendarCheck,
  Users,
  TrendingUp,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Clock,
  Check,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { spaService } from '../../services/spaService';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const Dashboard = ({ bookings = [], onConfirmBooking, onRejectBooking }) => {
  const [localBookings, setLocalBookings] = useState(bookings);
  const [processingId, setProcessingId] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Reject Modal State
  const [rejectModalBooking, setRejectModalBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('Quán có việc bận nên đóng cửa');
  const [customReason, setCustomReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const handleConfirm = async (id) => {
    setProcessingId(id);
    try {
      if (onConfirmBooking) {
        await onConfirmBooking(id);
      } else {
        await spaService.confirmSpaBooking(id);
      }
      setLocalBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CONFIRMED' } : b))
      );
      setSuccessToast(`Đã xác nhận lịch hẹn #${id} thành công!`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      alert(err.message || 'Lỗi khi xác nhận lịch hẹn');
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenRejectModal = (booking) => {
    setRejectModalBooking(booking);
    setRejectReason('Quán có việc bận nên đóng cửa');
    setCustomReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalBooking) return;
    const finalReason =
      rejectReason === 'Khác' && customReason.trim()
        ? customReason.trim()
        : rejectReason;

    setIsRejecting(true);
    const id = rejectModalBooking.id;
    try {
      if (onRejectBooking) {
        await onRejectBooking(id, finalReason);
      } else {
        await spaService.rejectSpaBooking(id, finalReason);
      }
      setLocalBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: 'CANCELLED',
                cancelReason: finalReason,
                cancelledBy: 'SPA_OWNER',
                rejectedBySpa: true,
                cancelledAt: new Date().toISOString(),
              }
            : b
        )
      );
      setRejectModalBooking(null);
      setSuccessToast(`Đã từ chối lịch hẹn #${id} (Lý do: "${finalReason}")`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      alert(err.message || 'Lỗi khi từ chối lịch hẹn');
    } finally {
      setIsRejecting(false);
    }
  };
  const stats = [
    {
      title: 'Doanh thu tháng này',
      value: '28.450.000 ₫',
      change: '+18.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      title: 'Lịch hẹn đã tiếp nhận',
      value: '64 lịch',
      change: '+12%',
      isPositive: true,
      icon: CalendarCheck,
      color: 'bg-sky-500',
    },
    {
      title: 'Khách hàng thân thiết',
      value: '192 khách',
      change: '+24 khách mới',
      isPositive: true,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Đánh giá hài lòng',
      value: '4.9 / 5.0 ⭐',
      change: '98% 5 sao',
      isPositive: true,
      icon: Sparkles,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400">{stat.title}</p>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">
                  {stat.value}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-md`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 animate-scale-up">
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {/* Bookings table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Danh sách Lịch hẹn Spa mới nhất</span>
            </h3>
            <p className="text-xs text-slate-400">
              Các cuộc hẹn khách hàng vừa đặt trực tuyến cần xem xét và duyệt tiếp nhận
            </p>
          </div>
          <div className="flex items-center gap-2">
            {localBookings.filter((b) => b.status === 'PENDING').length > 0 && (
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5 border border-amber-300 dark:border-amber-800">
                <Clock className="w-3.5 h-3.5" />
                {localBookings.filter((b) => b.status === 'PENDING').length} lịch chờ duyệt
              </span>
            )}
            <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-slate-700 px-3 py-1 rounded-full">
              Tổng cộng: {localBookings.length} lịch
            </span>
          </div>
        </div>

        {localBookings.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chưa có lịch hẹn mới nào được đặt trực tuyến. Hãy thử đặt 1 lịch từ bản đồ Pet Map nhé!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Mã lịch</th>
                  <th className="pb-3 font-semibold">Chủ nuôi & SĐT</th>
                  <th className="pb-3 font-semibold">Bé cưng</th>
                  <th className="pb-3 font-semibold">Dịch vụ</th>
                  <th className="pb-3 font-semibold">Thời gian</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold text-right pr-2">Thao tác duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {localBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 font-mono font-bold text-orange-600">{b.id}</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-800 dark:text-white">{b.contactName}</div>
                      <div className="text-slate-400">{b.contactPhone}</div>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{b.petName}</span> (
                      {b.petType === 'cat' ? 'Mèo' : 'Chó'})
                    </td>
                    <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                      {b.serviceName}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">
                      {b.bookingTime} - {b.bookingDate}
                    </td>
                    <td className="py-3">
                      {b.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                          CHỜ XÁC NHẬN
                        </span>
                      ) : b.status === 'CONFIRMED' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ĐÃ XÁC NHẬN
                        </span>
                      ) : b.rejectedBySpa || b.cancelledBy === 'SPA_OWNER' ? (
                        <span
                          className="inline-flex items-center gap-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-rose-300 dark:border-rose-800"
                          title={`Lý do: ${b.cancelReason || 'Spa từ chối tiếp nhận'}`}
                        >
                          <XCircle className="w-3 h-3 text-rose-600" />
                          SPA TỪ CHỐI
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-300 dark:border-slate-700">
                          <XCircle className="w-3 h-3 text-slate-500" />
                          KHÁCH HỦY
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right pr-2">
                      {b.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleConfirm(b.id)}
                            disabled={processingId === b.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer active:scale-95"
                            title="Xác nhận lịch hẹn này"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {processingId === b.id ? 'Đang duyệt...' : 'Xác nhận lịch'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenRejectModal(b)}
                            disabled={processingId === b.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition disabled:opacity-50 cursor-pointer active:scale-95"
                            title="Từ chối lịch hẹn"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : b.status === 'CONFIRMED' ? (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                          ✓ Đã duyệt
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {b.rejectedBySpa || b.cancelledBy === 'SPA_OWNER' ? 'Đã từ chối' : 'Đã đóng'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REJECT BOOKING MODAL */}
      {rejectModalBooking && (
        <Modal
          isOpen={Boolean(rejectModalBooking)}
          onClose={() => setRejectModalBooking(null)}
          title={`Từ chối tiếp nhận lịch hẹn #${rejectModalBooking.id}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-bold">
                  Khách hàng sẽ nhận được thông báo về việc từ chối tiếp nhận kèm lý do bạn chọn dưới đây.
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Khách: <strong>{rejectModalBooking.contactName}</strong> ({rejectModalBooking.contactPhone}) • Bé: <strong>{rejectModalBooking.petName}</strong> • Giờ hẹn: <strong>{rejectModalBooking.bookingTime} - {rejectModalBooking.bookingDate}</strong>
                </p>
              </div>
            </div>

            {/* Reason selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Chọn lý do từ chối tiếp nhận:
              </label>

              {[
                'Quán có việc bận nên đóng cửa',
                'Khung giờ này Spa đã kín chỗ / quá tải phục vụ',
                'Dịch vụ yêu cầu hiện đang bảo trì thiết bị hoặc tạm ngưng',
                'Không đủ kỹ thuật viên chuyên môn / bác sĩ trong ca này',
                'Khác',
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    rejectReason === reason
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 font-bold text-orange-900 dark:text-orange-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {rejectReason === 'Khác' && (
                <div className="pt-1">
                  <textarea
                    rows={3}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Nhập lý do cụ thể gửi tới khách hàng..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="md"
                onClick={() => setRejectModalBooking(null)}
                disabled={isRejecting}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleConfirmReject}
                loading={isRejecting}
              >
                Xác nhận Từ chối
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Dashboard;

