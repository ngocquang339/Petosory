import React from 'react';
import { DollarSign, CalendarCheck, Users, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export const Dashboard = ({ bookings = [] }) => {
  const stats = [
    {
      title: 'Doanh thu tháng này',
      value: '28.450.000 ₫',
      change: '+18.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      title: 'Lịch hẹn đã tiếp nhận',
      value: '64 lịch',
      change: '+12%',
      isPositive: true,
      icon: CalendarCheck,
      color: 'bg-sky-500',
    },
    {
      title: 'Khách hàng thân thiết',
      value: '192 khách',
      change: '+24 khách mới',
      isPositive: true,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Đánh giá hài lòng',
      value: '4.9 / 5.0 ⭐',
      change: '98% 5 sao',
      isPositive: true,
      icon: Sparkles,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400">{stat.title}</p>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">
                  {stat.value}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-md`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Danh sách Lịch hẹn Spa mới nhất
            </h3>
            <p className="text-xs text-slate-400">Các cuộc hẹn khách hàng vừa đặt trực tuyến</p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-slate-700 px-3 py-1 rounded-full">
            Tổng cộng: {bookings.length} lịch
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chưa có lịch hẹn mới nào được đặt trực tuyến. Hãy thử đặt 1 lịch từ bản đồ Pet Map nhé!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Mã lịch</th>
                  <th className="pb-3 font-semibold">Chủ nuôi & SĐT</th>
                  <th className="pb-3 font-semibold">Bé cưng</th>
                  <th className="pb-3 font-semibold">Dịch vụ</th>
                  <th className="pb-3 font-semibold">Thời gian</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 font-mono font-bold text-orange-600">{b.id}</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-800 dark:text-white">{b.contactName}</div>
                      <div className="text-slate-400">{b.contactPhone}</div>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{b.petName}</span> (
                      {b.petType === 'cat' ? 'Mèo' : 'Chó'})
                    </td>
                    <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                      {b.serviceName}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">
                      {b.bookingTime} - {b.bookingDate}
                    </td>
                    <td className="py-3">
                      {b.status === 'CANCELLED' ? (
                        <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          ĐÃ HỦY
                        </span>
                      ) : (
                        <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          ĐÃ XÁC NHẬN
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;

