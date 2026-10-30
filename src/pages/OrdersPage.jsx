import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  MessageSquare,
  ChevronRight,
  XCircle,
  ShoppingBag,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatCurrency, getOrderStatusInfo } from '../utils/helpers';
import { useCart } from '../hooks/useCart';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FeedbackModal from '../components/product/FeedbackModal';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Cancel Order Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Đổi ý không muốn mua nữa');
  const [isCancelling, setIsCancelling] = useState(false);

  // Feedback Modal State
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders(activeTab);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // Use Case: Re-buy Product
  const handleRebuy = (order) => {
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        },
        item.quantity || 1
      );
    });
    navigate('/cart');
  };

  // Use Case: Cancel Submitted Order
  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);
    try {
      await orderService.cancelSubmittedOrder(cancelModalOrder.id, cancelReason);
      setCancelModalOrder(null);
      await fetchOrders();
    } catch (err) {
      alert(err.message || 'Không thể hủy đơn hàng');
    } finally {
      setIsCancelling(false);
    }
  };

  // Use Case: Give Order Feedback
  const handleFeedbackSubmit = async ({ rating, comment }) => {
    if (!feedbackOrder) return;
    await orderService.submitOrderFeedback(feedbackOrder.id, { rating, comment });
    await fetchOrders();
  };

  const tabs = [
    { id: 'ALL', label: 'Tất cả đơn hàng' },
    { id: 'PENDING', label: 'Chờ xác nhận' },
    { id: 'PROCESSING', label: 'Đang chuẩn bị' },
    { id: 'SHIPPING', label: 'Đang giao hàng' },
    { id: 'DELIVERED', label: 'Đã giao' },
    { id: 'CANCELLED', label: 'Đã hủy' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-500" /> Đơn hàng của tôi (My Orders)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi tiến trình vận chuyển, chỉnh sửa thông tin hoặc đặt mua lại dễ dàng.
          </p>
        </div>

        <Link to="/shop">
          <Button variant="outline" size="sm" icon={ShoppingBag}>
            Tiếp tục mua hàng
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-800 h-44 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center border border-slate-100 dark:border-slate-700 space-y-3">
          <span className="text-5xl">📦</span>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Không có đơn hàng nào trong mục này
          </h3>
          <p className="text-xs text-slate-400">
            Hãy khám phá các sản phẩm hạt dinh dưỡng và đồ chơi mới nhất tại Petosory Shop!
          </p>
          <div className="pt-2">
            <Link to="/shop">
              <Button variant="primary" size="md">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.status);
            const canCancel = order.status === 'PENDING' || order.status === 'PROCESSING';
            const isDelivered = order.status === 'DELIVERED';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                {/* Order Top Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                      #{order.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      Ngày đặt: {order.orderDate}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs text-slate-400">
                            Số lượng: x{item.quantity}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Receiver summary */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong>Người nhận:</strong> {order.receiver.fullName} ({order.receiver.phone}) — {order.receiver.address}
                  </div>
                  <div>
                    <strong>Thanh toán:</strong> {order.paymentMethod} ({order.paymentStatus})
                  </div>
                </div>

                {/* Order Footer & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-500">Tổng thanh toán:</span>
                    <span className="text-lg font-black text-orange-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  {/* Customer Order Features Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* View Details */}
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết đơn
                      </Button>
                    </Link>

                    {/* Use Case: Re-buy Product */}
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={RotateCcw}
                      onClick={() => handleRebuy(order)}
                    >
                      Mua lại
                    </Button>

                    {/* Use Case: Cancel Submitted Order */}
                    {canCancel && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setCancelModalOrder(order)}
                      >
                        Hủy đơn hàng
                      </Button>
                    )}

                    {/* Use Case: Give Order Feedback */}
                    {isDelivered && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={MessageSquare}
                        onClick={() => setFeedbackOrder(order)}
                      >
                        {order.isReviewed ? 'Đã đánh giá' : 'Đánh giá đơn'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <Modal
          isOpen={Boolean(cancelModalOrder)}
          onClose={() => setCancelModalOrder(null)}
          title={`Hủy đơn hàng #${cancelModalOrder.id}`}
        >
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Sau khi hủy, đơn hàng sẽ không thể khôi phục lại.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Vui lòng chọn lý do hủy:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Đổi ý không muốn mua nữa">Đổi ý không muốn mua nữa</option>
                <option value="Muốn thay đổi địa chỉ hoặc số điện thoại">Muốn thay đổi địa chỉ hoặc số điện thoại</option>
                <option value="Tìm thấy giá rẻ hơn ở nơi khác">Tìm thấy giá rẻ hơn ở nơi khác</option>
                <option value="Đặt nhầm sản phẩm / số lượng">Đặt nhầm sản phẩm / số lượng</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCancelModalOrder(null)}
                disabled={isCancelling}
              >
                Giữ lại đơn
              </Button>
              <Button
                variant="danger"
                size="md"
                loading={isCancelling}
                onClick={handleConfirmCancel}
              >
                Xác nhận Hủy đơn
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Give Order Feedback Modal */}
      {feedbackOrder && (
        <FeedbackModal
          isOpen={Boolean(feedbackOrder)}
          onClose={() => setFeedbackOrder(null)}
          targetTitle={`Đơn hàng #${feedbackOrder.id}`}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};
export default OrdersPage;
