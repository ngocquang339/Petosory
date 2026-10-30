import React, { useState } from 'react';
import { Calendar, Clock, PawPrint, Phone, User, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../hooks/useAuth';
import { spaService } from '../../services/spaService';
import { formatCurrency } from '../../utils/helpers';

export const BookingModal = ({ isOpen, onClose, spa }) => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(spa?.services?.[0]?.name || '');
  const [petName, setPetName] = useState(user?.pets?.[0]?.name || '');
  const [petType, setPetType] = useState(user?.pets?.[0]?.type || 'cat');
  const [bookingDate, setBookingDate] = useState('2026-11-01');
  const [bookingTime, setBookingTime] = useState('09:30');
  const [contactName, setContactName] = useState(user?.fullName || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  if (!spa) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await spaService.bookSpaService({
        spaId: spa.id,
        spaName: spa.name,
        spaAddress: spa.address,
        serviceName: selectedService,
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
      title={successBooking ? 'Đặt lịch thành công!' : `Đặt lịch tại ${spa.name}`}
      maxWidth="max-w-xl"
    >
      {successBooking ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Lịch hẹn của bạn đã được ghi nhận!
          </h3>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-100 dark:border-slate-700">
            <p>
              <strong>Mã lịch hẹn:</strong> {successBooking.id}
            </p>
            <p>
              <strong>Spa:</strong> {successBooking.spaName}
            </p>
            <p>
              <strong>Dịch vụ:</strong> {successBooking.serviceName}
            </p>
            <p>
              <strong>Thú cưng:</strong> {successBooking.petName} (
              {successBooking.petType === 'cat' ? 'Mèo' : 'Chó'})
            </p>
            <p>
              <strong>Thời gian hẹn:</strong> {successBooking.bookingTime} ngày{' '}
              {successBooking.bookingDate}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Nhân viên CSKH của Spa sẽ gọi điện thoại tới số <strong>{successBooking.contactPhone}</strong> trước 30 phút để xác nhận tiếp đón bé.
          </p>
          <Button variant="primary" size="md" onClick={handleClose} className="w-full">
            Hoàn tất
          </Button>
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

