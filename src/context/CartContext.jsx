import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    return storage.get('cart_items', [
      {
        id: 'prod-1',
        name: 'Thức ăn hạt Royal Canin Mini Puppy cho chó con',
        price: 385000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
        brand: 'Royal Canin',
      },
    ]);
  });

  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    storage.set('cart_items', items);
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            quantity,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoDiscount(0);
    setPromoCode('');
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'PETOSORY20') {
      setPromoDiscount(20000);
      setPromoCode('PETOSORY20');
      return { success: true, message: 'Áp dụng mã giảm 20.000₫ thành công!' };
    }
    if (cleanCode === 'FREESHIP') {
      setPromoDiscount(25000);
      setPromoCode('FREESHIP');
      return { success: true, message: 'Miễn phí vận chuyển thành công!' };
    }
    return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' };
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 500000 || items.length === 0 ? 0 : 25000;
  const finalTotal = Math.max(0, subtotal + shippingFee - promoDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        promoDiscount,
        promoCode,
        applyPromoCode,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);

