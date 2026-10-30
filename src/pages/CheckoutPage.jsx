import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Banknote,
  QrCode,
  Wallet,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/helpers';
import { validateCheckoutForm } from '../utils/validators';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, shippingFee, promoDiscount, finalTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Nguyễn Thị Hương',
    phone: user?.phone || '0912 345 678',
    address: user?.address || 'Số 15, Ngõ 91 Nguyễn Chí Thanh, P. Láng Hạ, Q. Đống Đa, Hà Nội',
    note: 'Giao giờ hành chính, gọi trước khi giao',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Giỏ hàng của bạn đang trống!</h2>
        <Link to="/shop">
          <Button variant="primary" size="md">
            Quay lại mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const validation = validateCheckoutForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      const createdOrder = await orderService.createOrder({
        items,
        receiver: formData,
        paymentMethod,
        discountAmount: promoDiscount,
        shippingFee,
      });

      clearCart();
      navigate(`/orders/${createdOrder.id}?new=true`);
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/cart" className="hover:text-orange-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại giỏ hàng
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-medium">Thanh toán & Đặt hàng</span>
      </nav>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Receiver Information & Payment Method (Use case: Enter Receiver Information) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Receiver Information Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-500" /> Thông tin nhận hàng (Receiver Info)
              </h3>
              <span className="text-xs text-slate-400">Bước 1/2</span>
            </div>

            <div className="space-y-3">
              <Input
                label="Họ và tên người nhận"
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                error={errors.fullName}
                placeholder="Nhập đầy đủ họ và tên"
              />

              <Input
                label="Số điện thoại liên lạc"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="VD: 0912 345 678"
              />

              <Input
                label="Địa chỉ giao hàng chi tiết"
                required
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                error={errors.address}
                placeholder="Số nhà, tên ngõ/đường, phường/xã, quận/huyện, tỉnh thành..."
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ghi chú giao hàng (Tùy chọn):
                </label>
                <textarea
                  rows={2}
                  value={formData.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                  placeholder="VD: Giao trước 17h, gọi trước khi đến..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-500" /> Phương thức thanh toán
              </h3>
              <span className="text-xs text-slate-400">Bước 2/2</span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'COD',
                  name: 'Thanh toán khi nhận hàng (COD)',
                  desc: 'Bạn chỉ thanh toán tiền mặt khi shipper giao tận tay',
                  icon: Banknote,
                  color: 'text-amber-500',
                },
                {
                  id: 'VNPAY',
                  name: 'Cổng thanh toán VNPAY-QR',
                  desc: 'Quét mã QR qua tất cả ứng dụng Mobile Banking',
                  icon: QrCode,
                  color: 'text-sky-500',
                },
                {
                  id: 'MOMO',
                  name: 'Ví điện tử MoMo',
                  desc: 'Thanh toán siêu tốc không dùng tiền mặt',
                  icon: Wallet,
                  color: 'text-pink-500',
                },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <label
                    key={m.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 ring-1 ring-orange-500'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={isSelected}
                      onChange={() => setPaymentMethod(m.id)}
                      className="mt-1 accent-orange-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${m.color}`} />
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                          {m.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary (Submit Order use case) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-4 sticky top-24">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Đơn hàng của bạn ({items.length} món)
            </h4>

            {/* Items mini list */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-50 shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      SL: {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Tiền hàng:</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phí vận chuyển toàn quốc:</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Giảm giá voucher:</span>
                  <span>-{formatCurrency(promoDiscount)}</span>
                </div>
              )}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Tổng thanh toán:</span>
                <span className="text-2xl font-black text-orange-600">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            {/* Submit button (Use case: Submit Order) */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-md shadow-orange-500/25"
              loading={submitting}
            >
              Đặt hàng ngay ({formatCurrency(finalTotal)})
            </Button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Bằng việc bấm Đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách giao hàng của Petosory.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CheckoutPage;
