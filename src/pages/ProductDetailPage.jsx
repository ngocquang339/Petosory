import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  MessageSquare,
  ChevronRight,
  Heart,
  Share2,
} from 'lucide-react';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/helpers';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import RatingStars from '../components/common/RatingStars';
import FeedbackModal from '../components/product/FeedbackModal';
import Button from '../components/common/Button';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const prod = await productService.getProductById(id);
      const revs = await productService.getReviews(id);
      setProduct(prod);
      setReviews(revs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    const res = await productService.addReview(id, {
      rating,
      comment,
      userName: user?.fullName || 'Khách hàng',
    });
    setProduct(res.product);
    setReviews((prev) => [res.review, ...prev]);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy sản phẩm này!</h2>
        <Link to="/shop" className="text-orange-600 text-sm font-semibold underline mt-2 block">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-orange-600">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-orange-600">Cửa hàng</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main product presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                Giảm {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Còn {product.stock} sản phẩm
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-slate-800 px-3 py-1 rounded-xl">
                <RatingStars rating={product.rating} size="sm" />
                <span className="text-xs font-bold text-amber-600">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">
                Dựa trên <b>{product.reviewCount}</b> đánh giá của khách hàng
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-orange-50/70 dark:bg-slate-800/60 p-5 rounded-2xl border border-orange-100 dark:border-slate-700 flex items-baseline gap-4">
            <span className="text-3xl font-black text-orange-600">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-emerald-600 font-bold ml-auto">
              ✓ Tiết kiệm {formatCurrency((product.originalPrice || product.price) - product.price)}
            </span>
          </div>

          {/* Features Highlights */}
          {product.features && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Đặc điểm nổi bật:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & Add to Cart button */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Số lượng:</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-800 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2" /> Đã thêm {quantity} sản phẩm vào giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào giỏ hàng
                  </>
                )}
              </Button>

              <Link to="/cart" className="sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Xem giỏ hàng
                </Button>
              </Link>
            </div>
          </div>

          {/* Commitments strip */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-center text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-orange-500" />
              <span>Giao hàng 2H</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              <span>100% Chính hãng</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-emerald-500" />
              <span>Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews Tabs */}
      <div className="space-y-6 pt-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Mô tả chi tiết sản phẩm
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>{product.description}</p>
        </div>

        {/* Customer Reviews Section & Submit Feedback */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Đánh giá từ khách hàng ({reviews.length})
              </h3>
              <p className="text-xs text-slate-400">Chia sẻ cảm nhận thực tế sau khi sử dụng</p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={MessageSquare}
              onClick={() => setFeedbackModalOpen(true)}
            >
              Viết đánh giá sản phẩm
            </Button>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center">
                      {rev.userName[0]}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white">
                        {rev.userName}
                      </h5>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-10">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        targetTitle={product.name}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};
export default ProductDetailPage;
