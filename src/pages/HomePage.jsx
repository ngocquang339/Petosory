import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  Clock,
  Heart,
  ChevronRight,
  Award,
} from 'lucide-react';
import { productService } from '../services/productService';
import { spaService } from '../services/spaService';
import { blogService } from '../services/blogService';
import ProductCard from '../components/product/ProductCard';
import BookingModal from '../components/spa/BookingModal';
import Button from '../components/common/Button';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredSpas, setFeaturedSpas] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedSpaForBooking, setSelectedSpaForBooking] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      const [prods, spas, blogList] = await Promise.all([
        productService.getProducts(),
        spaService.getSpas(),
        blogService.getBlogs(),
      ]);
      setFeaturedProducts(prods.filter((p) => p.isFeatured).slice(0, 4));
      setFeaturedSpas(spas.slice(0, 3));
      setBlogs(blogList.slice(0, 3));
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50/50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-12 md:py-20 border-b border-orange-100/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold tracking-wide shadow-xs animate-bounce-subtle">
                <Sparkles className="w-3.5 h-3.5" /> Nền tảng Thú cưng All-in-One số 1 Việt Nam
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                Chăm sóc boss yêu <br />
                <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                  trọn vẹn từng khoảnh khắc
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Khám phá bản đồ Pet Map tìm kiếm các cơ sở Spa thú cưng uy tín gần bạn nhất, đặt lịch hẹn nhanh chóng và mua sắm đồ ăn dinh dưỡng chính hãng 100%.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link to="/map">
                  <Button size="lg" variant="primary" icon={MapPin}>
                    Khám phá Pet Map ngay
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button size="lg" variant="outline" icon={ShoppingBag}>
                    Ghé thăm Pet Shop
                  </Button>
                </Link>
              </div>

              {/* Quick Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-orange-600">50+</div>
                  <p className="text-xs text-slate-500">Đối tác Spa & Clinic</p>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-orange-600">10,000+</div>
                  <p className="text-xs text-slate-500">Khách hàng tin tưởng</p>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-orange-600">4.9/5</div>
                  <p className="text-xs text-slate-500">Đánh giá hài lòng</p>
                </div>
              </div>
            </div>

            {/* Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-orange-400 to-amber-300 rounded-3xl opacity-30 blur-2xl transform -rotate-3" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80"
                    alt="Happy pets at Petosory"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  {/* Floating card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                        🐾
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Petosory Flagship Spa
                        </h4>
                        <p className="text-[11px] text-slate-500">Đang phục vụ • 142 Hoàng Cầu</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      ⭐ 4.9
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Icons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/map"
            className="group p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs hover:shadow-lg hover:border-orange-300 transition-all text-center flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-3">
              📍
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Bản đồ Pet Map</h4>
            <p className="text-xs text-slate-400 mt-1">Tìm spa & thú y gần bạn</p>
          </Link>

          <Link
            to="/shop?category=food"
            className="group p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs hover:shadow-lg hover:border-orange-300 transition-all text-center flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-3">
              🍖
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Thức ăn & Hạt</h4>
            <p className="text-xs text-slate-400 mt-1">Dinh dưỡng chuẩn quốc tế</p>
          </Link>

          <Link
            to="/shop?category=hygiene"
            className="group p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs hover:shadow-lg hover:border-orange-300 transition-all text-center flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-3">
              🛁
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Tắm Spa & Vệ sinh</h4>
            <p className="text-xs text-slate-400 mt-1">Sữa tắm & dụng cụ grooming</p>
          </Link>

          <Link
            to="/blogs"
            className="group p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs hover:shadow-lg hover:border-orange-300 transition-all text-center flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-3">
              📖
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Cẩm nang thú cưng</h4>
            <p className="text-xs text-slate-400 mt-1">Kinh nghiệm từ chuyên gia</p>
          </Link>
        </div>
      </section>

      {/* Featured Spas on Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Dịch vụ đẳng cấp
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Cơ sở Spa & Làm đẹp được đánh giá cao
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Khử khuẩn định kỳ, phòng điều hòa mát lạnh và thợ cắt tỉa đạt chứng chỉ quốc tế.
            </p>
          </div>

          <Link to="/map">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              Xem tất cả trên bản đồ
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSpas.map((spa) => (
            <div
              key={spa.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={spa.image}
                    alt={spa.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{spa.openTime}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-slate-900" />
                    <span>{spa.rating}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {spa.name}
                  </h3>
                  <div className="flex items-start gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{spa.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {spa.services.slice(0, 2).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-orange-50 dark:bg-slate-700 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-md"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setSelectedSpaForBooking(spa)}
                >
                  Đặt lịch Spa ngay
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section (Add to Cart use case) */}
      <section className="bg-slate-50 dark:bg-slate-900/60 py-16 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                <ShoppingBag className="w-4 h-4" /> Mua sắm tiện lợi
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Sản phẩm dinh dưỡng & đồ dùng nổi bật
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Giao hàng nhanh trong 2h, đổi trả miễn phí trong 7 ngày nếu thú cưng không hợp.
              </p>
            </div>

            <Link to="/shop">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                Xem toàn bộ cửa hàng
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Blogs & Pet Knowledge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Kiến thức bổ ích
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Cẩm nang chăm sóc boss yêu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kinh nghiệm nuôi dưỡng, dinh dưỡng khoa học và mẹo huấn luyện từ bác sĩ thú y.
            </p>
          </div>

          <Link to="/blogs">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              Đọc tất cả bài viết
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blogs/${blog.id}`}
              className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-video overflow-hidden bg-slate-100 relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {blog.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-orange-600 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span>Đọc tiếp</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Spa Booking Modal */}
      {selectedSpaForBooking && (
        <BookingModal
          isOpen={Boolean(selectedSpaForBooking)}
          onClose={() => setSelectedSpaForBooking(null)}
          spa={selectedSpaForBooking}
        />
      )}
    </div>
  );
};
export default HomePage;
