import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Heart,
  ChevronDown,
  LogOut,
  Package,
  Calendar,
  LayoutDashboard,
  ShieldCheck,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useLocation as useAppLocation } from '../../hooks/useLocation';
import { useThemeContext } from '../../context/ThemeContext';
import { ROLES } from '../../utils/constants';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout, loginAsDemo } = useAuth();
  const { cartCount } = useCart();
  const { selectedCity, selectCity, cities } = useAppLocation();
  const { theme, toggleTheme } = useThemeContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Cửa hàng', path: '/shop' },
    { label: 'Lịch hẹn 📅', path: '/bookings' },
    { label: 'Cẩm nang Pet', path: '/blogs' },
  ];

  return (
    <header className="sticky top-0 z-[1100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors shadow-xs">
      {/* Top micro bar for demo switch & location */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-orange-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> PETOSORY-Nền tảng chăm sóc thú cưng One For All
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <div className="hidden sm:flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>Khu vực:</span>
            <select
              value={selectedCity.id}
              onChange={(e) => selectCity(e.target.value)}
              className="bg-slate-800 text-white rounded px-2 py-0.5 border border-slate-700 text-xs cursor-pointer focus:outline-none"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact info & Perks */}
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>Hotline CSKH: <strong className="text-orange-400">1900 6868</strong></span>
          <span className="text-slate-600">•</span>
          <span>Giao nhanh 2H • Miễn phí vận chuyển từ 500k</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent tracking-tight">
                Petosory
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
                Pet Spa & Store
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {role === ROLES.SPA_OWNER && (
              <Link
                to="/owner-dashboard"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 transition-colors"
              >
                Quản lý Spa
              </Link>
            )}
          </nav>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs xl:max-w-sm relative"
          >
            <input
              type="text"
              placeholder="Tìm hạt dinh dưỡng, pate, spa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-4 pr-10 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Actions: Cart, Theme Toggle, User profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-orange-50 dark:hover:bg-slate-700 cursor-pointer transition-all flex items-center justify-center shadow-xs hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 transition-colors group"
              title="Giỏ hàng của bạn"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-scale-up">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 bg-white dark:bg-slate-800 cursor-pointer transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-orange-200"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-scale-up"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400">Đăng nhập với</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-semibold uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <User className="w-4 h-4 text-orange-500" />
                      <span>Hồ sơ & Thú cưng</span>
                    </Link>

                    <Link
                      to="/bookings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>Lịch hẹn của tôi</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Package className="w-4 h-4 text-sky-500" />
                      <span>Đơn hàng của tôi</span>
                    </Link>

                    {role === ROLES.SPA_OWNER && (
                      <Link
                        to="/owner-dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-500" />
                        <span>Bảng quản lý Spa</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/25 transition-all"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Tìm sản phẩm, dịch vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800"
            >
              Đơn hàng của tôi
            </Link>
            {role === ROLES.SPA_OWNER && (
              <Link
                to="/owner-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50"
              >
                Quản lý Spa
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;

