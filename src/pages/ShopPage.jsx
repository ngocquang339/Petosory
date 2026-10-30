import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { Filter, Search, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../utils/constants';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPetType, setSelectedPetType] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const list = await productService.getProducts({
        category: selectedCategory,
        petType: selectedPetType,
        search: searchQuery,
        sortBy,
        minPrice: 0,
        maxPrice,
      });
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPetType, sortBy, searchQuery, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Pet Store Chính Hãng
          </span>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">
            Thế giới mua sắm cho Chó & Mèo cưng
          </h1>
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
            Hạt dinh dưỡng, cát vệ sinh sinh học, phụ kiện thời trang và thực phẩm chức năng nhập khẩu chính ngạch 100%.
          </p>
        </div>
        <div className="absolute right-6 -bottom-6 text-9xl opacity-20 select-none hidden md:block">
          🐕🐱
        </div>
      </div>

      {/* Main shop content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Search box */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-orange-500" /> Tìm kiếm sản phẩm
            </h4>
            <input
              type="text"
              placeholder="Tên hạt, pate, nhãn hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Categories Filter */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" /> Danh mục sản phẩm
            </h4>
            <div className="space-y-1.5">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.id && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Type Filter */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Dành cho thú cưng</h4>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'cat', label: '🐱 Mèo' },
                { id: 'dog', label: '🐶 Chó' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedPetType(t.id)}
                  className={`py-2 text-xs font-bold rounded-xl border text-center cursor-pointer transition-colors ${
                    selectedPetType === t.id
                      ? 'border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Mức giá tối đa</h4>
              <span className="text-xs font-bold text-orange-600">
                {new Intl.NumberFormat('vi-VN').format(maxPrice)} ₫
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>50.000₫</span>
              <span>1.000.000₫</span>
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Hiển thị <b>{products.length}</b> sản phẩm chất lượng
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                Sắp xếp theo:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-auto cursor-pointer"
              >
                <option value="default">Phổ biến nhất</option>
                <option value="rating">Đánh giá cao nhất ⭐</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-800 rounded-2xl p-4 h-80 animate-pulse border border-slate-100 dark:border-slate-700" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700 space-y-3">
              <span className="text-5xl">🛍️</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-xs text-slate-400">
                Hãy thử nới rộng khoảng giá hoặc chọn danh mục khác nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ShopPage;

