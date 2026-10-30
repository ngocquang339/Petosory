import { spaService } from './spaService';
import { calculateDistance } from '../utils/helpers';
import { CITIES } from '../utils/constants';

export const petMapService = {
  async getLocations(cityId = 'hanoi') {
    const spas = await spaService.getSpas();
    if (cityId === 'all') return spas;
    return spas.filter((s) => s.city === cityId);
  },

  async getNearbySpas(userLat, userLng, radiusKm = 15) {
    const spas = await spaService.getSpas();
    return spas
      .map((spa) => {
        const distStr = calculateDistance(userLat, userLng, spa.lat, spa.lng);
        const distKm = distStr.includes('km')
          ? parseFloat(distStr)
          : parseFloat(distStr) / 1000;
        return {
          ...spa,
          distanceFormatted: distStr,
          distanceKm: distKm,
        };
      })
      .filter((spa) => spa.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  },

  getCities() {
    return CITIES;
  },
};

