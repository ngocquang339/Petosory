import { storage } from '../utils/storage';
import { INITIAL_SPAS } from '../utils/constants';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const initSpasStorage = () => {
  let spas = storage.get('spas');
  if (!spas || !spas.length) {
    storage.set('spas', INITIAL_SPAS);
    spas = INITIAL_SPAS;
  }
  return spas;
};

export const CANCEL_WINDOW_HOURS = 3;

const initSpaBookingsStorage = () => {
  let bookings = storage.get('spa_bookings');
  if (!bookings || !bookings.length) {
    const now = Date.now();
    const initialBookings = [
      {
        id: 'BK-892101',
        spaId: 'spa-1',
        spaName: 'Petosory Flagship Spa - 142 Hoàng Cầu',
        spaAddress: '142 Hoàng Cầu, Đống Đa, Hà Nội',
        spaPhone: '0988 123 456',
        serviceName: 'Tắm spa sục ozon & sấy tạo kiểu',
        price: 180000,
        petName: 'Miu Miu',
        petType: 'cat',
        bookingDate: new Date(now + 86400000).toISOString().split('T')[0], // Ngày mai
        bookingTime: '09:30',
        contactName: 'Nguyễn Thị Hương',
        contactPhone: '0912 345 678',
        note: 'Bé hơi nhát nước, nhờ các bạn nhẹ tay với bé.',
        createdAt: new Date(now - 15 * 60 * 1000).toISOString(), // Vừa đặt cách đây 15 phút (< 3h) -> CHỜ SPA XÁC NHẬN
        status: 'PENDING',
      },
      {
        id: 'BK-891942',
        spaId: 'spa-2',
        spaName: 'Paws Grooming & Spa - 75 Nguyễn Lương Bằng',
        spaAddress: '75 Nguyễn Lương Bằng, Đống Đa, Hà Nội',
        spaPhone: '0977 456 789',
        serviceName: 'Cắt tỉa tạo kiểu lông Poodle chuẩn Hàn Quốc',
        price: 250000,
        petName: 'Bông Bông',
        petType: 'dog',
        bookingDate: new Date(now + 2 * 86400000).toISOString().split('T')[0], // 2 ngày tới
        bookingTime: '14:00',
        contactName: 'Nguyễn Thị Hương',
        contactPhone: '0912 345 678',
        note: 'Cắt phom tròn đầu nấm cho bé cưng.',
        createdAt: new Date(now - 5 * 3600 * 1000).toISOString(), // Đặt cách đây 5 tiếng (> 3h) -> QUÁ HẠN HỦY
        status: 'CONFIRMED',
      },
      {
        id: 'BK-890514',
        spaId: 'spa-5',
        spaName: 'Pet House Spa & Clinic - 28 Thái Hà',
        spaAddress: '28 Thái Hà, Đống Đa, Hà Nội',
        spaPhone: '0903 112 233',
        serviceName: 'Khám thú y & Spa tắm dưỡng',
        price: 250000,
        petName: 'Miu Miu',
        petType: 'cat',
        bookingDate: new Date(now - 86400000).toISOString().split('T')[0],
        bookingTime: '10:30',
        contactName: 'Nguyễn Thị Hương',
        contactPhone: '0912 345 678',
        note: 'Khám định kỳ tai mũi họng',
        createdAt: new Date(now - 30 * 3600 * 1000).toISOString(),
        status: 'CANCELLED',
        cancelledAt: new Date(now - 28 * 3600 * 1000).toISOString(),
        cancelReason: 'Bận việc đột xuất không thể đưa bé qua đúng giờ',
      },
    ];
    storage.set('spa_bookings', initialBookings);
    return initialBookings;
  }
  return bookings;
};

export const spaService = {
  async getSpas({ city = 'all', search = '' } = {}) {
    await delay();
    let spas = initSpasStorage();

    if (city && city !== 'all') {
      spas = spas.filter((s) => s.city === city);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      spas = spas.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.services.some((srv) => srv.name.toLowerCase().includes(q))
      );
    }

    return spas;
  },

  async getSpaById(id) {
    await delay();
    const spas = initSpasStorage();
    const spa = spas.find((s) => s.id === id);
    if (!spa) throw new Error('Không tìm thấy cơ sở Spa');
    return spa;
  },

  async bookSpaService(booking) {
    await delay(300);
    const bookings = initSpaBookingsStorage();
    const newBooking = {
      id: 'BK-' + Date.now().toString().slice(-6),
      ...booking,
      createdAt: new Date().toISOString(),
      status: 'PENDING', // Đặt lịch ban đầu ở trạng thái Chờ xác nhận từ Spa Owner
    };
    bookings.unshift(newBooking);
    storage.set('spa_bookings', bookings);
    return newBooking;
  },

  async confirmSpaBooking(bookingId) {
    await delay(250);
    const bookings = initSpaBookingsStorage();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      throw new Error('Không tìm thấy thông tin lịch hẹn để xác nhận');
    }
    const booking = bookings[index];
    if (booking.status === 'CANCELLED') {
      throw new Error('Lịch hẹn này đã bị hủy, không thể xác nhận');
    }
    booking.status = 'CONFIRMED';
    booking.confirmedAt = new Date().toISOString();
    bookings[index] = booking;
    storage.set('spa_bookings', bookings);
    return booking;
  },

  async rejectSpaBooking(bookingId, reason = 'Spa từ chối tiếp nhận (quá tải / kín lịch)') {
    await delay(250);
    const bookings = initSpaBookingsStorage();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      throw new Error('Không tìm thấy thông tin lịch hẹn');
    }
    const booking = bookings[index];
    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date().toISOString();
    booking.cancelReason = reason;
    bookings[index] = booking;
    storage.set('spa_bookings', bookings);
    return booking;
  },

  async getSpaBookings(status = 'ALL') {
    await delay(150);
    const bookings = initSpaBookingsStorage();
    if (!status || status === 'ALL') {
      return bookings;
    }
    return bookings.filter((b) => b.status === status);
  },

  async getBookingById(id) {
    await delay(100);
    const bookings = initSpaBookingsStorage();
    const booking = bookings.find((b) => b.id === id);
    if (!booking) throw new Error('Không tìm thấy thông tin lịch hẹn');
    return booking;
  },

  checkBookingCancelable(booking) {
    if (!booking) return { canCancel: false, message: 'Lịch hẹn không tồn tại' };
    if (booking.status === 'CANCELLED') {
      return { canCancel: false, message: 'Lịch hẹn này đã bị hủy trước đó' };
    }
    const createdTime = new Date(booking.createdAt).getTime();
    const diffMs = Date.now() - createdTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    const maxMs = CANCEL_WINDOW_HOURS * 60 * 60 * 1000;
    const remainingMs = maxMs - diffMs;

    if (diffHours > CANCEL_WINDOW_HOURS || remainingMs <= 0) {
      return {
        canCancel: false,
        hoursPassed: Number(diffHours.toFixed(1)),
        remainingMinutes: 0,
        message: 'Đã quá thời hạn 3 giờ cho phép hủy trực tuyến (> 3h kể từ lúc đặt hẹn).',
      };
    }

    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    const remHours = Math.floor(remainingMinutes / 60);
    const remMins = remainingMinutes % 60;
    const remainingText = remHours > 0 ? `${remHours}h ${remMins}m` : `${remMins} phút`;

    return {
      canCancel: true,
      hoursPassed: Number(diffHours.toFixed(1)),
      remainingMinutes,
      remainingText,
      message: `Còn ${remainingText} để hủy lịch trực tuyến`,
    };
  },

  async cancelSpaBooking(bookingId, cancelReason = 'Khách hàng hủy trực tuyến') {
    await delay(300);
    const bookings = initSpaBookingsStorage();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      throw new Error('Không tìm thấy thông tin lịch hẹn cần hủy');
    }

    const booking = bookings[index];
    const { canCancel, message } = this.checkBookingCancelable(booking);

    if (!canCancel) {
      throw new Error(message || 'Không thể hủy lịch hẹn này');
    }

    const updatedBooking = {
      ...booking,
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
      cancelReason,
    };

    bookings[index] = updatedBooking;
    storage.set('spa_bookings', bookings);
    return updatedBooking;
  },
};

