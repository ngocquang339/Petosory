import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';
import CartItem from '../components/product/CartItem';
import Button from '../components/common/Button';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    cartCount,
    subtotal,
    shippingFee,
    promoDiscount,
    promoCode,
    applyPromoCode,
    finalTotal,
    clearCart,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage(res);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-24 h-24 bg-orange-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          🛒
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
          Giỏ hàng của bạn đang trống!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Hãy dạo quanh cửa hàng Petosory để chọn những món hạt thơm ngon và đồ chơi xinh xắn cho boss nhé.
        </p>
        <div className="pt-2">
          <Link to="/shop">
            <Button variant="primary" size="lg" icon={ShoppingBag}>
              Khám phá sản phẩm ngay
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Quản lý Giỏ hàng ({cartCount} món)
          </h1>
          <p className="text-xs text-slate-500">
            Kiểm tra số lượng và áp dụng mã voucher ưu đãi
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
        >
          <Trash2 className="w-4 h-4" /> Làm trống giỏ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items List (Manage Shopping Cart use case) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs">
          <div className="space-y-1">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Tiếp tục mua hàng
            </Link>
          </div>
        </div>

        {/* Right: Order Summary & Voucher */}
        <div className="lg:col-span-4 space-y-6">
          {/* Voucher input */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-orange-500" /> Mã giảm giá / Voucher
            </h4>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập PETOSORY20 hoặc FREESHIP"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-mono"
              />
              <Button type="submit" variant="secondary" size="sm">
                Áp dụng
              </Button>
            </form>

            {promoMessage && (
              <p
                className={`text-xs font-semibold ${
                  promoMessage.success ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                {promoMessage.message}
              </p>
            )}

            <div className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              💡 Thử mã: <b className="text-orange-600">PETOSORY20</b> (giảm 20.000₫) hoặc{' '}
              <b className="text-orange-600">FREESHIP</b> (miễn phí vận chuyển)!
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tóm tắt thanh toán</h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tiền hàng ({cartCount} sản phẩm):</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Mã voucher giảm giá ({promoCode}):</span>
                  <span>-{formatCurrency(promoDiscount)}</span>
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Tổng cộng:</span>
                <span className="text-xl font-black text-orange-600">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              icon={ArrowRight}
              onClick={() => navigate('/checkout')}
            >
              Tiến hành Đặt hàng
            </Button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 text-center pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Giao dịch bảo mật 100% qua SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
