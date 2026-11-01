import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronRight,
  Award,
  Truck,
  Heart,
} from 'lucide-react';
import { productService } from '../services/productService';
import { blogService } from '../services/blogService';
import PetMapHeroView from '../components/map/PetMapHeroView';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      const [prods, blogList] = await Promise.all([
        productService.getProducts(),
        blogService.getBlogs(),
      ]);
      setFeaturedProducts(prods.filter((p) => p.isFeatured).slice(0, 4));
      setBlogs(blogList.slice(0, 3));
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 pb-16 bg-slate-50 dark:bg-[#090d16] transition-colors duration-200">
      {/* 1. PET MAP INTERFACE (HIỆN RA LUÔN KHI VỪA VÀO WEB THEO ĐÚNG ẢNH MẪU) */}
      <section className="w-full border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl">
        <PetMapHeroView />
      </section>

      {/* 2. QUICK PET PLATFORM SERVICES STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/shop?category=food"
            className="group p-4 bg-white dark:bg-[#111928] hover:bg-slate-50 dark:hover:bg-[#162136] rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/50 shadow-xs dark:shadow-md transition-all text-center flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform mb-2.5">
              🍖
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Thức ăn & Hạt chính hãng</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Dinh dưỡng chuẩn quốc tế</p>
          </Link>

          <Link
            to="/shop?category=hygiene"
            className="group p-4 bg-white dark:bg-[#111928] hover:bg-slate-50 dark:hover:bg-[#162136] rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/50 shadow-xs dark:shadow-md transition-all text-center flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-500/15 text-sky-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform mb-2.5">
              🛁
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Sữa tắm & Vệ sinh</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sữa tắm & dụng cụ grooming</p>
          </Link>

          <Link
            to="/shop?category=accessories"
            className="group p-4 bg-white dark:bg-[#111928] hover:bg-slate-50 dark:hover:bg-[#162136] rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/50 shadow-xs dark:shadow-md transition-all text-center flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform mb-2.5">
              🧶
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Đồ chơi & Phụ kiện</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Vòng cổ, nhà cây, đệm nằm</p>
          </Link>

          <Link
            to="/blogs"
            className="group p-4 bg-white dark:bg-[#111928] hover:bg-slate-50 dark:hover:bg-[#162136] rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/50 shadow-xs dark:shadow-md transition-all text-center flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform mb-2.5">
              📖
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Cẩm nang thú cưng</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kinh nghiệm từ chuyên gia</p>
          </Link>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Use case: View Home Page -> extend Add Product to Cart) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm dark:shadow-none">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                <ShoppingBag className="w-4 h-4" /> Mua sắm tiện lợi
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Sản phẩm dinh dưỡng & đồ dùng nổi bật
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Giao hàng nhanh 2H, cam kết hàng chính hãng 100%, bảo vệ sức khỏe boss yêu.
              </p>
            </div>

            <Link to="/shop">
              <Button variant="outline" size="sm" icon={ArrowRight} className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                Xem toàn bộ cửa hàng
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. BLOGS & TIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Kiến thức bổ ích
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Cẩm nang chăm sóc boss yêu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Lời khuyên dinh dưỡng, lịch tiêm phòng và cách chăm sóc từ chuyên gia.
            </p>
          </div>

          <Link to="/blogs">
            <Button variant="outline" size="sm" icon={ArrowRight} className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              Đọc tất cả bài viết
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blogs/${blog.id}`}
              className="group bg-white dark:bg-[#111928] hover:bg-slate-50 dark:hover:bg-[#162136] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col"
            >
              <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {blog.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-orange-600 dark:text-orange-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Đọc tiếp</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
export default HomePage;
