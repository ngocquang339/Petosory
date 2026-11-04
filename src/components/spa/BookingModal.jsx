import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, PawPrint, Phone, User, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../hooks/useAuth';
import { spaService } from '../../services/spaService';
import { formatCurrency } from '../../utils/helpers';

export const BookingModal = ({ isOpen, onClose, spa }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(spa?.services?.[0]?.name || '');
  const [petName, setPetName] = useState(user?.pets?.[0]?.name || '');
  const [petType, setPetType] = useState(user?.pets?.[0]?.type || 'cat');
  const [bookingDate, setBookingDate] = useState('2026-11-05');
  const [bookingTime, setBookingTime] = useState('09:30');
  const [contactName, setContactName] = useState(user?.fullName || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  if (!spa) return null;

  const matchedService = spa.services?.find((s) => s.name === selectedService);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await spaService.bookSpaService({
        spaId: spa.id,
        spaName: spa.name,
        spaAddress: spa.address,
        spaPhone: spa.phone || '0988 123 456',
        serviceName: selectedService,
        price: matchedService?.price || 180000,
        petName,
        petType,
        bookingDate,
        bookingTime,
        contactName,
        contactPhone,
        note,
      });
      setSuccessBooking(result);
    } catch (err) {
      alert(err.message || 'Lỗi đặt lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessBooking(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={successBooking ? 'Yêu cầu đặt lịch đã gửi!' : `Đặt lịch tại ${spa.name}`}
      maxWidth="max-w-xl"
    >
      {successBooking ? (
        <div className="text-center py-5 space-y-4">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Clock className="w-9 h-9 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Đang chờ xác nhận từ Chủ Spa!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Yêu cầu đặt lịch của bạn đã được gửi thành công đến cơ sở <strong>{successBooking.spaName}</strong>. Chủ Spa sẽ kiểm tra phòng chăm sóc và xác nhận lịch hẹn của bạn sớm nhất.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-semibold">Trạng thái hiện tại:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <Clock className="w-3 h-3 text-amber-600" />
                CHỜ XÁC NHẬN
              </span>
            </div>
            <p>
              <strong>Mã lịch hẹn:</strong> <span className="font-mono text-orange-600 font-bold">{successBooking.id}</span>
            </p>
            <p>
              <strong>Spa tiếp đón:</strong> {successBooking.spaName}
            </p>
            <p>
              <strong>Dịch vụ:</strong> {successBooking.serviceName} {successBooking.price ? `(${formatCurrency(successBooking.price)})` : ''}
            </p>
            <p>
              <strong>Thú cưng:</strong> {successBooking.petName} (
              {successBooking.petType === 'cat' ? 'Mèo' : 'Chó'})
            </p>
            <p>
              <strong>Thời gian dự kiến:</strong> {successBooking.bookingTime} ngày{' '}
              {successBooking.bookingDate}
            </p>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-left text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Chính sách hủy lịch:</strong> Trong thời gian chờ duyệt và trong vòng <strong>3 giờ</strong> kể từ lúc đặt hẹn, bạn có thể tự do hủy yêu cầu lịch hẹn trực tuyến nếu thay đổi kế hoạch.
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Nhân viên CSKH của Spa sẽ gọi điện thoại tới số <strong>{successBooking.contactPhone}</strong> trước 30 phút để xác nhận tiếp đón bé.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleClose();
                navigate('/bookings');
              }}
              className="flex-1"
            >
              Xem danh sách lịch hẹn
            </Button>
            <Button variant="outline" size="md" onClick={handleClose} className="flex-1">
              Đóng
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selected Service */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Chọn dịch vụ chăm sóc:
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {spa.services.map((srv, idx) => (
                <option key={idx} value={srv.name}>
                  {srv.name} — {formatCurrency(srv.price)} ({srv.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Pet info */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tên thú cưng"
              required
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="VD: Mochi, Lucky..."
              icon={PawPrint}
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Loài:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPetType('cat')}
                  className={`py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                    petType === 'cat'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  🐱 Mèo
                </button>
                <button
                  type="button"
                  onClick={() => setPetType('dog')}
                  className={`py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                    petType === 'dog'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  🐶 Chó
                </button>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ngày đặt hẹn"
              type="date"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              icon={Calendar}
            />
            <Input
              label="Giờ hẹn"
              type="time"
              required
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              icon={Clock}
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tên chủ nuôi"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              icon={User}
            />
            <Input
              label="Số điện thoại"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              icon={Phone}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Ghi chú thêm cho Spa (tính cách bé, yêu cầu sấy nhẹ...):
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Bé hơi nhát nước, xin vui lòng thao tác nhẹ nhàng..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Policy reminder */}
          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 text-[11px] text-orange-800 dark:text-orange-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600 shrink-0" />
            <span>
              <strong>Lưu ý:</strong> Bạn có thể hủy lịch trực tuyến miễn phí trong vòng <strong>3 giờ</strong> kể từ lúc đặt hẹn. Quá 3 giờ sẽ không thể hủy trực tuyến.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="md" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading}>
              Xác nhận Đặt lịch Spa
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
export default BookingModal;

