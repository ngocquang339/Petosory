import React, { createContext, useContext, useState } from 'react';
import { CITIES } from '../utils/constants';
import { getCurrentPosition } from '../utils/maps';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]); // Default Hanoi
  const [userCoords, setUserCoords] = useState({ lat: 21.0285, lng: 105.8542 });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const selectCity = (cityId) => {
    const city = CITIES.find((c) => c.id === cityId) || CITIES[0];
    setSelectedCity(city);
    setUserCoords({ lat: city.lat, lng: city.lng });
  };

  const locateUser = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const pos = await getCurrentPosition();
      setUserCoords(pos);
      return pos;
    } catch (err) {
      setLocationError(err.message || 'Không thể lấy vị trí hiện tại');
      return userCoords;
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        cities: CITIES,
        selectedCity,
        selectCity,
        userCoords,
        setUserCoords,
        locateUser,
        isLocating,
        locationError,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);

