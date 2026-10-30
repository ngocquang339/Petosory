import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, Shield, Truck, Clock, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      {/* Top features strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Giao hàng hỏa tốc</h4>
              <p className="text-xs text-slate-400">Nội thành 2H & toàn quốc</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Chính hãng</h4>
              <p className="text-xs text-slate-400">Cam kết nguồn gốc xuất xứ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Spa thú cưng 5 sao</h4>
              <p className="text-xs text-slate-400">Đội ngũ groomer tận tâm</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hỗ trợ 24/7</h4>
              <p className="text-xs text-slate-400">Tư vấn sức khỏe thú cưng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="text-2xl font-black text-white tracking-tight">Petosory</span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Hệ sinh thái nền tảng dịch vụ chăm sóc thú cưng toàn diện số 1 Việt Nam. Kết nối khách hàng, spa làm đẹp, phòng khám thú y và mua sắm thông minh.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Trụ sở chính: 142 Hoàng Cầu, Đống Đa, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Hotline: 1900 6868 (8:00 - 21:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Email hỗ trợ: support@petosory.vn</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Khám phá</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/map" className="hover:text-orange-400 transition-colors">
                  Bản đồ Spa gần nhất
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-orange-400 transition-colors">
                  Cửa hàng phụ kiện & thức ăn
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-orange-400 transition-colors">
                  Cẩm nang nuôi mèo & chó
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-orange-400 transition-colors">
                  Tra cứu tình trạng đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer policies */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Chính sách</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="hover:text-orange-400 cursor-pointer">Chính sách giao hàng & đổi trả</span>
              </li>
              <li>
                <span className="hover:text-orange-400 cursor-pointer">Bảo mật thông tin khách hàng</span>
              </li>
              <li>
                <span className="hover:text-orange-400 cursor-pointer">Điều khoản dịch vụ Pet Spa</span>
              </li>
              <li>
                <span className="hover:text-orange-400 cursor-pointer">Dành cho đối tác chủ Spa</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Nhận ưu đãi 20%</h5>
            <p className="text-xs text-slate-400 mb-3">
              Đăng ký email để nhận mã giảm giá và cẩm nang chăm sóc boss yêu mỗi tuần.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 text-xs font-semibold cursor-pointer transition-colors">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Petosory Platform. Thiết kế và phát triển theo mô hình kiến trúc chuẩn Package & Use Case Diagram.</p>
      </div>
    </footer>
  );
};
export default Footer;

