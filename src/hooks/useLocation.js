import { useLocationContext } from '../context/LocationContext';

export const useLocation = () => {
  const context = useLocationContext();
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

