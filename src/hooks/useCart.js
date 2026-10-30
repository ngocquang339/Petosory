import { useCartContext } from '../context/CartContext';

export const useCart = () => {
  const context = useCartContext();
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

