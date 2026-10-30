import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image wrapper */}
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discountPercent > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                -{discountPercent}%
              </span>
            )}
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {product.petType === 'cat' ? '🐱 Mèo' : product.petType === 'dog' ? '🐶 Chó' : '🐾 Tất cả'}
            </span>
          </div>

          <button
            type="button"
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:scale-110 transition-all cursor-pointer"
            title="Thêm vào danh sách yêu thích"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Product details */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Price & Add to cart button */}
      <div className="p-4 pt-0">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            added
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-500 text-orange-600 dark:text-orange-400 hover:text-white shadow-xs'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Đã thêm giỏ hàng!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default ProductCard;

