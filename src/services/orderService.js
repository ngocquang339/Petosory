import { storage } from '../utils/storage';
import { INITIAL_ORDERS } from '../utils/constants';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const initOrdersStorage = () => {
  let orders = storage.get('orders');
  if (!orders || !orders.length) {
    storage.set('orders', INITIAL_ORDERS);
    orders = INITIAL_ORDERS;
  }
  return orders;
};

export const orderService = {
  async getMyOrders(statusFilter = 'ALL') {
    await delay();
    let orders = initOrdersStorage();
    if (statusFilter && statusFilter !== 'ALL') {
      orders = orders.filter((o) => o.status === statusFilter);
    }
    return orders;
  },

  async getOrderById(orderId) {
    await delay();
    const orders = initOrdersStorage();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Không tìm thấy đơn hàng #' + orderId);
    return order;
  },

  async createOrder({ items, receiver, paymentMethod, discountAmount = 0, shippingFee = 25000 }) {
    await delay(400);
    const orders = initOrdersStorage();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      orderDate: formattedDate,
      status: 'PENDING',
      totalAmount,
      subtotal,
      shippingFee,
      discountAmount,
      receiver,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Chưa thanh toán (COD)' : 'Đã thanh toán Online',
      timeline: [
        { status: 'Đặt hàng thành công', time: formattedDate, done: true },
        { status: 'Chờ người bán xác nhận', time: 'Đang xử lý', done: false },
      ],
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    };

    orders.unshift(newOrder);
    storage.set('orders', orders);
    return newOrder;
  },

  async updateSubmittedOrder(orderId, updatedReceiver) {
    await delay(300);
    const orders = initOrdersStorage();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Không tìm thấy đơn hàng');

    const order = orders[index];
    if (order.status !== 'PENDING') {
      throw new Error('Chỉ có thể chỉnh sửa thông tin giao hàng khi đơn ở trạng thái Chờ xác nhận');
    }

    orders[index] = {
      ...order,
      receiver: { ...order.receiver, ...updatedReceiver },
    };
    storage.set('orders', orders);
    return orders[index];
  },

  async cancelSubmittedOrder(orderId, reason = 'Đổi ý không muốn mua nữa') {
    await delay(300);
    const orders = initOrdersStorage();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Không tìm thấy đơn hàng');

    const order = orders[index];
    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      throw new Error('Không thể hủy đơn hàng đã hoặc đang được giao');
    }

    orders[index] = {
      ...order,
      status: 'CANCELLED',
      cancelReason: reason,
      timeline: [
        ...order.timeline,
        { status: `Đã hủy đơn hàng (Lý do: ${reason})`, time: new Date().toLocaleDateString('vi-VN'), done: true },
      ],
    };
    storage.set('orders', orders);
    return orders[index];
  },

  async giveOrderFeedback(orderId, { rating, comment }) {
    await delay(300);
    const orders = initOrdersStorage();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Không tìm thấy đơn hàng');

    orders[index] = {
      ...orders[index],
      isReviewed: true,
      feedback: {
        rating,
        comment,
        date: new Date().toLocaleDateString('vi-VN'),
      },
    };
    storage.set('orders', orders);
    return orders[index];
  },
};

