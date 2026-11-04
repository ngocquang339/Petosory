import { storage } from '../utils/storage';
import { INITIAL_SPAS } from '../utils/constants';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const mapDbToBooking = (row) => ({
  id: row.id,
  spaId: row.spa_id,
  spaName: row.spa_name,
  spaAddress: row.spa_address,
  spaPhone: row.spa_phone,
  serviceName: row.service_name,
  price: row.price ? Number(row.price) : 0,
  petName: row.pet_name,
  petType: row.pet_type,
  bookingDate: row.booking_date,
  bookingTime: row.booking_time,
  contactName: row.contact_name,
  contactPhone: row.contact_phone,
  note: row.note || '',
  status: row.status,
  createdAt: row.created_at,
  confirmedAt: row.confirmed_at,
  cancelledAt: row.cancelled_at,
  cancelReason: row.cancel_reason,
  cancelledBy: row.cancelled_by,
  rejectedBySpa: Boolean(row.rejected_by_spa),
});

const mapBookingToDb = (b) => ({
  id: b.id,
  spa_id: b.spaId,
  spa_name: b.spaName,
  spa_address: b.spaAddress || '',
  spa_phone: b.spaPhone || '',
  service_name: b.serviceName,
  price: b.price || 0,
  pet_name: b.petName,
  pet_type: b.petType,
  booking_date: b.bookingDate,
  booking_time: b.bookingTime,
  contact_name: b.contactName,
  contact_phone: b.contactPhone,
  note: b.note || '',
  status: b.status || 'PENDING',
  created_at: b.createdAt || new Date().toISOString(),
  confirmed_at: b.confirmedAt || null,
  cancelled_at: b.cancelledAt || null,
  cancel_reason: b.cancelReason || null,
  cancelled_by: b.cancelledBy || null,
  rejected_by_spa: Boolean(b.rejectedBySpa),
});

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
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('spas').select('*');
        if (city && city !== 'all') {
          query = query.eq('city', city);
        }
        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          const mappedSpas = data.map((row) => ({
            id: row.id,
            name: row.name,
            address: row.address,
            city: row.city || 'hanoi',
            phone: row.phone,
            lat: Number(row.lat),
            lng: Number(row.lng),
            rating: Number(row.rating || 5.0),
            reviewCount: row.review_count || 0,
            openTime: row.open_time || '08:00 - 20:30',
            image:
              row.image_url ||
              'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
            services: [
              { name: 'Tắm spa sục ozon & sấy tạo kiểu', price: 180000, duration: '60 phút' },
              { name: 'Cắt tỉa tạo kiểu lông Poodle chuẩn Hàn Quốc', price: 250000, duration: '90 phút' },
            ],
          }));
          storage.set('spas', mappedSpas);
          if (search.trim()) {
            const q = search.toLowerCase();
            return mappedSpas.filter(
              (s) =>
                s.name.toLowerCase().includes(q) ||
                s.address.toLowerCase().includes(q)
            );
          }
          return mappedSpas;
        } else if (!error && Array.isArray(data) && data.length === 0) {
          // Auto-seed default spas to Supabase
          const localInitial = initSpasStorage();
          for (const s of localInitial) {
            await supabase.from('spas').insert({
              id: s.id,
              name: s.name,
              address: s.address,
              city: s.city || 'hanoi',
              phone: s.phone,
              lat: s.lat,
              lng: s.lng,
              rating: s.rating,
              review_count: s.reviewCount || 0,
              open_time: s.openTime || '08:00 - 20:30',
              image_url: s.image,
            });
          }
          return localInitial;
        }
      } catch (err) {
        console.warn('Supabase getSpas error:', err);
      }
    }

    await delay(100);
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
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('spas')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            address: data.address,
            city: data.city || 'hanoi',
            phone: data.phone,
            lat: Number(data.lat),
            lng: Number(data.lng),
            rating: Number(data.rating || 5.0),
            reviewCount: data.review_count || 0,
            openTime: data.open_time || '08:00 - 20:30',
            image:
              data.image_url ||
              'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
            services: [
              { name: 'Tắm spa sục ozon & sấy tạo kiểu', price: 180000, duration: '60 phút' },
              { name: 'Cắt tỉa tạo kiểu lông Poodle chuẩn Hàn Quốc', price: 250000, duration: '90 phút' },
            ],
          };
        }
      } catch (err) {
        console.warn('Supabase getSpaById error:', err);
      }
    }

    await delay(100);
    const spas = initSpasStorage();
    const spa = spas.find((s) => s.id === id);
    if (!spa) throw new Error('Không tìm thấy cơ sở Spa');
    return spa;
  },

  async saveSpa(spaData) {
    const spas = initSpasStorage();
    let id = spaData.id;
    if (!id) {
      id = 'spa-' + Date.now().toString().slice(-5);
    }

    const newSpa = {
      id,
      name: spaData.name || 'Cơ sở Spa mới',
      address: spaData.address || '',
      city: spaData.city || 'hanoi',
      district: spaData.district || 'Đống Đa',
      phone: spaData.phone || '',
      lat: Number(spaData.lat) || 21.0182,
      lng: Number(spaData.lng) || 105.8245,
      rating: Number(spaData.rating) || 5.0,
      reviewCount: Number(spaData.reviewCount) || 0,
      openTime: spaData.openTime || '08:00 - 20:30',
      isOpen: true,
      image:
        spaData.image ||
        'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
      services:
        spaData.services && spaData.services.length > 0
          ? spaData.services
          : [
              { name: 'Tắm spa sục ozon & sấy tạo kiểu', price: 180000, duration: '60 phút' },
              { name: 'Cắt tỉa tạo kiểu lông Poodle chuẩn Hàn Quốc', price: 250000, duration: '90 phút' },
            ],
    };

    if (isSupabaseConfigured) {
      try {
        const dbPayload = {
          id: newSpa.id,
          name: newSpa.name,
          address: newSpa.address,
          city: newSpa.city,
          phone: newSpa.phone,
          lat: newSpa.lat,
          lng: newSpa.lng,
          rating: newSpa.rating,
          review_count: newSpa.reviewCount,
          open_time: newSpa.openTime,
          image_url: newSpa.image,
        };
        const { error } = await supabase.from('spas').upsert(dbPayload);
        if (error) console.warn('Supabase upsert spa error:', error);
      } catch (err) {
        console.warn('Supabase saveSpa failed:', err);
      }
    }

    const index = spas.findIndex((s) => s.id === id);
    if (index !== -1) {
      spas[index] = newSpa;
    } else {
      spas.unshift(newSpa);
    }
    storage.set('spas', spas);
    return newSpa;
  },

  async bookSpaService(booking) {
    const newBooking = {
      id: 'BK-' + Date.now().toString().slice(-6),
      ...booking,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('spa_bookings')
          .insert(mapBookingToDb(newBooking));
        if (error) {
          console.warn('Supabase insert warning:', error);
        }
      } catch (err) {
        console.warn('Supabase book error:', err);
      }
    }

    const bookings = initSpaBookingsStorage();
    bookings.unshift(newBooking);
    storage.set('spa_bookings', bookings);
    return newBooking;
  },

  async confirmSpaBooking(bookingId) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('spa_bookings')
          .update({
            status: 'CONFIRMED',
            confirmed_at: new Date().toISOString(),
          })
          .eq('id', bookingId);
        if (error) console.warn('Supabase confirm warning:', error);
      } catch (err) {
        console.warn('Supabase confirm error:', err);
      }
    }

    const bookings = initSpaBookingsStorage();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = 'CONFIRMED';
      bookings[index].confirmedAt = new Date().toISOString();
      storage.set('spa_bookings', bookings);
      return bookings[index];
    }
    return { id: bookingId, status: 'CONFIRMED' };
  },

  async rejectSpaBooking(bookingId, reason = 'Quán có việc bận nên đóng cửa') {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('spa_bookings')
          .update({
            status: 'CANCELLED',
            cancelled_at: new Date().toISOString(),
            cancel_reason: reason,
            cancelled_by: 'SPA_OWNER',
            rejected_by_spa: true,
          })
          .eq('id', bookingId);
        if (error) console.warn('Supabase reject warning:', error);
      } catch (err) {
        console.warn('Supabase reject error:', err);
      }
    }

    const bookings = initSpaBookingsStorage();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = 'CANCELLED';
      bookings[index].cancelledAt = new Date().toISOString();
      bookings[index].cancelReason = reason;
      bookings[index].cancelledBy = 'SPA_OWNER';
      bookings[index].rejectedBySpa = true;
      storage.set('spa_bookings', bookings);
      return bookings[index];
    }
    return { id: bookingId, status: 'CANCELLED', cancelReason: reason };
  },

  async getSpaBookings(status = 'ALL') {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('spa_bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (status && status !== 'ALL') {
          query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          if (data.length > 0) {
            const mapped = data.map(mapDbToBooking);
            storage.set('spa_bookings', mapped);
            return mapped;
          } else {
            // Seed initial sample bookings to Supabase so owner has data right away
            const localInitial = initSpaBookingsStorage();
            for (const item of localInitial) {
              await supabase.from('spa_bookings').insert(mapBookingToDb(item));
            }
            return status === 'ALL'
              ? localInitial
              : localInitial.filter((b) => b.status === status);
          }
        }
      } catch (err) {
        console.warn('Supabase fetch error, fallback to local storage:', err);
      }
    }

    await delay(100);
    const bookings = initSpaBookingsStorage();
    if (!status || status === 'ALL') {
      return bookings;
    }
    return bookings.filter((b) => b.status === status);
  },

  async getBookingById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('spa_bookings')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          return mapDbToBooking(data);
        }
      } catch (err) {
        console.warn('Supabase getBookingById error:', err);
      }
    }

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
    const bookings = initSpaBookingsStorage();
    const index = bookings.findIndex((b) => b.id === bookingId);
    let targetBooking = index !== -1 ? bookings[index] : null;

    if (targetBooking) {
      const { canCancel, message } = this.checkBookingCancelable(targetBooking);
      if (!canCancel) {
        throw new Error(message || 'Không thể hủy lịch hẹn này');
      }
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('spa_bookings')
          .update({
            status: 'CANCELLED',
            cancelled_at: new Date().toISOString(),
            cancel_reason: cancelReason,
            cancelled_by: 'CUSTOMER',
            rejected_by_spa: false,
          })
          .eq('id', bookingId);
      } catch (err) {
        console.warn('Supabase customer cancel error:', err);
      }
    }

    if (index !== -1) {
      const updatedBooking = {
        ...bookings[index],
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        cancelReason,
        cancelledBy: 'CUSTOMER',
        rejectedBySpa: false,
      };
      bookings[index] = updatedBooking;
      storage.set('spa_bookings', bookings);
      return updatedBooking;
    }
    return { id: bookingId, status: 'CANCELLED' };
  },

  subscribeToBookings(callback) {
    if (!isSupabaseConfigured) return () => {};
    const channel = supabase
      .channel('realtime:spa_bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spa_bookings' },
        (payload) => {
          if (callback) callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};


