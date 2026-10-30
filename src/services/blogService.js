import { INITIAL_BLOGS } from '../utils/constants';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const blogService = {
  async getBlogs() {
    await delay();
    return INITIAL_BLOGS;
  },

  async getBlogById(id) {
    await delay();
    const blog = INITIAL_BLOGS.find((b) => b.id === id);
    if (!blog) throw new Error('Không tìm thấy bài viết');
    return blog;
  },
};

