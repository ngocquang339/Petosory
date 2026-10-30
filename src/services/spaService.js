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
    const bookings = storage.get('spa_bookings', []);
    const newBooking = {
      id: 'BK-' + Date.now().toString().slice(-6),
      ...booking,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
    };
    bookings.unshift(newBooking);
    storage.set('spa_bookings', bookings);
    return newBooking;
  },

  async getSpaBookings() {
    return storage.get('spa_bookings', []);
  },
};

