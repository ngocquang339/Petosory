import React, { useState } from 'react';
import { Camera, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import RatingStars from '../common/RatingStars';
import { validateReviewForm } from '../../utils/validators';

export const FeedbackModal = ({ isOpen, onClose, targetTitle, onSubmit, initialRating = 5 }) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateReviewForm({ rating, comment });
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ rating, comment });
      setComment('');
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đánh giá & Nhận xét">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Sản phẩm / Đơn hàng
          </span>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
            {targetTitle}
          </h4>
        </div>

        {/* Rating stars selector */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-center space-y-2 border border-slate-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Bạn cảm thấy thế nào về trải nghiệm này?
          </p>
          <div className="flex justify-center">
            <RatingStars
              rating={rating}
              size="lg"
              interactive={true}
              onChange={(newRating) => setRating(newRating)}
            />
          </div>
          <p className="text-xs font-bold text-orange-500">
            {rating === 5
              ? '⭐⭐⭐⭐⭐ Tuyệt vời! Rất hài lòng'
              : rating === 4
              ? '⭐⭐⭐⭐ Tốt, rất đáng tiền'
              : rating === 3
              ? '⭐⭐⭐ Bình thường'
              : rating === 2
              ? '⭐⭐ Chưa hài lòng lắm'
              : '⭐ Rất tệ'}
          </p>
        </div>

        {/* Comment field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Nội dung nhận xét chi tiết:
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về chất lượng hạt, bao bì, đóng gói hoặc thái độ phục vụ..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Photo upload mock */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Thêm hình ảnh thực tế (tùy chọn):
          </label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/40">
            <Camera className="w-6 h-6 mx-auto text-slate-400 mb-1" />
            <span className="text-xs text-slate-500">Bấm để tải ảnh hoặc video thú cưng</span>
          </div>
        </div>

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" size="md" loading={submitting}>
            Gửi đánh giá
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default FeedbackModal;

