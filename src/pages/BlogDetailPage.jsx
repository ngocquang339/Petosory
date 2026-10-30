import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, Heart, ChevronRight } from 'lucide-react';
import { blogService } from '../services/blogService';
import Button from '../components/common/Button';

export const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await blogService.getBlogById(id);
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs text-slate-500">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy bài viết</h2>
        <Link to="/blogs" className="text-orange-600 text-xs font-bold underline mt-2 block">
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/blogs" className="hover:text-orange-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tất cả bài viết
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-medium truncate max-w-sm">
          {blog.title}
        </span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <span className="bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
          {blog.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-slate-100 dark:border-slate-800 pb-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
              <User className="w-4 h-4 text-orange-500" /> {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {blog.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {blog.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:text-orange-600 cursor-pointer">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:text-orange-600 cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden aspect-video bg-slate-100 shadow-md">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      {/* Body content */}
      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
        {blog.content}
      </div>

      {/* Bottom CTA to shop / map */}
      <div className="bg-orange-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-orange-200/60 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Cần tư vấn thêm cho thú cưng của bạn?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Tìm ngay phòng khám thú y hoặc bác sĩ gần bạn nhất trên Pet Map.
          </p>
        </div>
        <Link to="/map">
          <Button variant="primary" size="md">
            Mở Pet Map ngay
          </Button>
        </Link>
      </div>
    </article>
  );
};
export default BlogDetailPage;

