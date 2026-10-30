import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, ShoppingBag, BookOpen, Package, User, Heart, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ className = '' }) => {
  const { user } = useAuth();

  const links = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Bản đồ Pet Map', path: '/map', icon: MapPin },
    { label: 'Cửa hàng Pet Shop', path: '/shop', icon: ShoppingBag },
    { label: 'Cẩm nang nuôi thú cưng', path: '/blogs', icon: BookOpen },
    { label: 'Đơn hàng của tôi', path: '/orders', icon: Package },
    { label: 'Hồ sơ & Thú cưng', path: '/profile', icon: User },
  ];

  return (
    <aside className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between ${className}`}>
      <div className="space-y-6">
        {user && (
          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-slate-800 rounded-2xl">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover border border-orange-200"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                {user.fullName}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-orange-200/50 dark:border-slate-700 text-center">
        <span className="text-xl">🐶🐱</span>
        <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-1">Hội yêu thú cưng</h5>
        <p className="text-[11px] text-slate-500 mt-0.5">Đặt lịch spa ngay hôm nay để nhận voucher giảm 20k!</p>
      </div>
    </aside>
  );
};
export default Sidebar;

