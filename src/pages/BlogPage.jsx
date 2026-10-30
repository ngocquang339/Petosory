import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, User, ChevronRight, Search } from 'lucide-react';
import { blogService } from '../services/blogService';

export const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      const data = await blogService.getBlogs();
      setBlogs(data);
    };
    fetch();
  }, []);

  const categories = ['all', 'Sức Khỏe', 'Dinh Dưỡng', 'Huấn Luyện'];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
          Cẩm nang thú cưng (Pet Blogs)
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Kiến thức & Kinh nghiệm chăm sóc thú cưng
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Tổng hợp lời khuyên từ bác sĩ thú y hàng đầu về chế độ dinh dưỡng, phòng ngừa bệnh tật và huấn luyện tại nhà.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                selectedCategory === c
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {c === 'all' ? 'Tất cả chủ đề' : c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredBlogs.map((blog) => (
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
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {blog.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {blog.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-700 text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-orange-500" /> {blog.author}
                </span>
                <span className="font-bold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center">
                  Đọc <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default BlogPage;

