import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Package,
  MapPin,
  Clock,
  Phone,
  User,
  CreditCard,
  Truck,
  RotateCcw,
  Edit3,
  XCircle,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatCurrency, getOrderStatusInfo } from '../utils/helpers';
import { useCart } from '../hooks/useCart';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import FeedbackModal from '../components/product/FeedbackModal';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === 'true';
  const { addToCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Update receiver address modal (Use Case: Update Submitted Order)
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ fullName: '', phone: '', address: '', note: '' });
  const [updatingAddress, setUpdatingAddress] = useState(false);

  // Cancel order modal (Use Case: Cancel Submitted Order)
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Đổi ý không muốn mua nữa');
  const [cancelling, setCancelling] = useState(false);

  // Feedback modal (Use Case: Give Order Feedback)
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
      if (data) {
        setEditFormData({
          fullName: data.receiver.fullName,
          phone: data.receiver.phone,
          address: data.receiver.address,
          note: data.receiver.note || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Use Case: Update Submitted Order
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setUpdatingAddress(true);
    try {
      const updated = await orderService.updateSubmittedOrder(order.id, editFormData);
      setOrder(updated);
      setEditAddressOpen(false);
    } catch (err) {
      alert(err.message || 'Lỗi cập nhật địa chỉ');
    } finally {
      setUpdatingAddress(false);
    }
  };

  // Use Case: Cancel Submitted Order
  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const cancelled = await orderService.cancelSubmittedOrder(order.id, cancelReason);
      setOrder(cancelled);
      setCancelModalOpen(false);
    } catch (err) {
      alert(err.message || 'Lỗi hủy đơn');
    } finally {
      setCancelling(false);
    }
  };

  // Use Case: Re-buy Product
  const handleRebuy = () => {
    if (!order) return;
    order.items.forEach((item) => {
      addToCart(item, item.quantity || 1);
    });
    navigate('/cart');
  };

  // Use Case: Give Order Feedback
  const handleFeedbackSubmit = async ({ rating, comment }) => {
    const updated = await orderService.giveOrderFeedback(order.id, { rating, comment });
    setOrder(updated);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs text-slate-500">Đang tải thông tin chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-xl font-bold">Không tìm thấy đơn hàng #{id}</h2>
        <Link to="/orders">
          <Button variant="outline" size="sm">
            Quay lại danh sách đơn hàng
          </Button>
        </Link>
      </div>
    );
  }

  const statusInfo = getOrderStatusInfo(order.status);
  const isPending = order.status === 'PENDING';
  const canCancel = order.status === 'PENDING' || order.status === 'PROCESSING';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Success banner if just placed */}
      {isNew && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                Chúc mừng! Bạn đã đặt hàng thành công!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Mã đơn hàng <b>#{order.id}</b>. Bạn có thể xem lộ trình giao hàng trực tiếp bên dưới.
              </p>
            </div>
          </div>
          <Link to="/orders">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Xem tất cả đơn
            </Button>
          </Link>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/orders" className="hover:text-orange-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Danh sách đơn hàng
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-medium">Chi tiết đơn #{order.id}</span>
      </nav>

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Chi tiết đơn hàng #{order.id}
            </h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Ngày tạo: {order.orderDate}</p>
        </div>

        {/* Action Buttons for Use Cases */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Use Case: Re-buy Product */}
          <Button variant="secondary" size="sm" icon={RotateCcw} onClick={handleRebuy}>
            Mua lại đơn này
          </Button>

          {/* Use Case: Update Submitted Order (Active only when PENDING) */}
          {isPending && (
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => setEditAddressOpen(true)}
            >
              Đổi địa chỉ nhận
            </Button>
          )}

          {/* Use Case: Cancel Submitted Order */}
          {canCancel && (
            <Button variant="danger" size="sm" onClick={() => setCancelModalOpen(true)}>
              Hủy đơn hàng
            </Button>
          )}

          {/* Use Case: Give Order Feedback */}
          {isDelivered && (
            <Button
              variant="primary"
              size="sm"
              icon={MessageSquare}
              onClick={() => setFeedbackOpen(true)}
            >
              {order.isReviewed ? 'Sửa đánh giá' : 'Đánh giá đơn'}
            </Button>
          )}
        </div>
      </div>

      {/* Order Tracking Timeline */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-orange-500" /> Trạng thái tiến trình vận chuyển
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          {order.timeline.map((step, idx) => (
            <div key={idx} className="relative flex sm:flex-col items-center sm:items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  step.done
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {step.done ? '✓' : idx + 1}
              </div>
              <div>
                <h5
                  className={`text-xs font-bold ${
                    step.done
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.status}
                </h5>
                <span className="text-[11px] text-slate-400">{step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receiver and Payment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receiver Info (Can be edited via Update Submitted Order) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" /> Địa chỉ nhận hàng
            </h4>
            {isPending && (
              <button
                onClick={() => setEditAddressOpen(true)}
                className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Chỉnh sửa
              </button>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <p>
              <strong>Người nhận:</strong> {order.receiver.fullName}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.receiver.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.receiver.address}
            </p>
            {order.receiver.note && (
              <p>
                <strong>Ghi chú:</strong> {order.receiver.note}
              </p>
            )}
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-3">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-500" /> Phương thức & Tình trạng thanh toán
            </h4>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <p>
              <strong>Phương thức:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Trạng thái thanh toán:</strong>{' '}
              <span className="font-semibold text-orange-600">{order.paymentStatus}</span>
            </p>
            <p>
              <strong>Phí giao hàng:</strong>{' '}
              {order.shippingFee === 0 ? 'Miễn phí' : formatCurrency(order.shippingFee)}
            </p>
          </div>
        </div>
      </div>

      {/* Items List in Order */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Danh sách sản phẩm trong đơn ({order.items.length} món)
          </h4>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700 p-5 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-200"
                />
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                    {item.name}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                </div>
              </div>

              <span className="text-sm font-black text-slate-900 dark:text-white">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-6 border-t border-slate-100 dark:border-slate-700 flex flex-col items-end space-y-1.5 text-xs">
          <div className="flex justify-between w-64 text-slate-500">
            <span>Tiền hàng:</span>
            <span className="font-semibold text-slate-800 dark:text-white">
              {formatCurrency(order.subtotal || order.totalAmount - (order.shippingFee || 0))}
            </span>
          </div>
          <div className="flex justify-between w-64 text-slate-500">
            <span>Phí vận chuyển:</span>
            <span className="font-semibold text-slate-800 dark:text-white">
              {formatCurrency(order.shippingFee || 0)}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between w-64 text-emerald-600 font-semibold">
              <span>Voucher giảm giá:</span>
              <span>-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between w-64 pt-2 border-t border-slate-200 dark:border-slate-700 items-baseline">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Tổng thanh toán:</span>
            <span className="text-xl font-black text-orange-600">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback preview if already reviewed */}
      {order.isReviewed && order.feedback && (
        <div className="bg-amber-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400">
              ⭐ Đánh giá của bạn ({order.feedback.rating}/5 sao)
            </span>
            <span className="text-[11px] text-slate-400">{order.feedback.date}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
            "{order.feedback.comment}"
          </p>
        </div>
      )}

      {/* Edit Address Modal (Use case: Update Submitted Order) */}
      <Modal
        isOpen={editAddressOpen}
        onClose={() => setEditAddressOpen(false)}
        title="Cập nhật thông tin nhận hàng"
      >
        <form onSubmit={handleUpdateAddress} className="space-y-4">
          <Input
            label="Họ tên người nhận"
            required
            value={editFormData.fullName}
            onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
          />
          <Input
            label="Số điện thoại"
            required
            value={editFormData.phone}
            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
          />
          <Input
            label="Địa chỉ chi tiết"
            required
            value={editFormData.address}
            onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
          />
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ghi chú giao hàng:
            </label>
            <textarea
              rows={2}
              value={editFormData.note}
              onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setEditAddressOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="md" loading={updatingAddress}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Order Modal (Use case: Cancel Submitted Order) */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title={`Hủy đơn hàng #${order.id}`}
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Bạn có chắc chắn muốn hủy đơn hàng này không?
          </p>
          <div>
            <label className="block text-xs font-bold mb-1.5">Lý do hủy đơn:</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <option value="Đổi ý không muốn mua nữa">Đổi ý không muốn mua nữa</option>
              <option value="Muốn thay đổi địa chỉ hoặc số điện thoại">Muốn thay đổi địa chỉ hoặc số điện thoại</option>
              <option value="Đặt nhầm sản phẩm / số lượng">Đặt nhầm sản phẩm / số lượng</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setCancelModalOpen(false)}>
              Quay lại
            </Button>
            <Button variant="danger" size="md" loading={cancelling} onClick={handleCancelOrder}>
              Xác nhận Hủy
            </Button>
          </div>
        </div>
      </Modal>

      {/* Give Order Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        targetTitle={`Đơn hàng #${order.id}`}
        initialRating={order.feedback?.rating || 5}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};
export default OrderDetailPage;
