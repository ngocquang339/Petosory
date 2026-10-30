import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      {/* Thumbnail */}
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          {item.brand || 'Petosory'}
        </span>
        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
          {item.name}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">Đơn giá: {formatCurrency(item.price)}</p>

        {/* Quantity buttons */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 sm:hidden">
            = {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>

      {/* Total & Remove */}
      <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
        <span className="text-sm font-black text-slate-900 dark:text-white">
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa
        </button>
      </div>

      {/* Mobile delete button */}
      <button
        type="button"
        onClick={() => removeFromCart(item.id)}
        className="sm:hidden p-2 text-rose-500 hover:text-rose-700 self-start"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
export default CartItem;

