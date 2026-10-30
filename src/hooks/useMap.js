import { useState, useEffect } from 'react';
import { petMapService } from '../services/petMapService';
import { useLocation } from './useLocation';

export const useMap = (initialCity = 'hanoi') => {
  const { userCoords, selectedCity } = useLocation();
  const [spas, setSpas] = useState([]);
  const [selectedSpa, setSelectedSpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSpas = async (cityId) => {
    setLoading(true);
    try {
      const data = await petMapService.getLocations(cityId);
      setSpas(data);
      if (data.length > 0 && !selectedSpa) {
        setSelectedSpa(data[0]);
      }
    } catch (err) {
      console.error('Failed to load map spas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpas(selectedCity.id || initialCity);
  }, [selectedCity]);

  const filteredSpas = spas.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.services.some((srv) => srv.name.toLowerCase().includes(q))
    );
  });

  return {
    spas: filteredSpas,
    selectedSpa,
    setSelectedSpa,
    loading,
    searchQuery,
    setSearchQuery,
    userCoords,
    reloadSpas: () => loadSpas(selectedCity.id),
  };
};

