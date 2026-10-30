import { storage } from '../utils/storage';
import { INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from '../utils/constants';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const initProductsStorage = () => {
  let products = storage.get('products');
  if (!products || !products.length) {
    storage.set('products', INITIAL_PRODUCTS);
    products = INITIAL_PRODUCTS;
  }
  return products;
};

export const productService = {
  async getProducts({ category = 'all', petType = 'all', search = '', sortBy = 'default', minPrice = 0, maxPrice = 2000000 } = {}) {
    await delay();
    let list = initProductsStorage();

    // Filter by Category
    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    // Filter by Pet Type
    if (petType && petType !== 'all') {
      list = list.filter((p) => p.petType === petType || p.petType === 'both');
    }

    // Filter by Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    // Filter by Price
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  },

  async getProductById(id) {
    await delay();
    const list = initProductsStorage();
    const product = list.find((p) => p.id === id);
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    return product;
  },

  async getCategories() {
    return PRODUCT_CATEGORIES;
  },

  async addReview(productId, { rating, comment, userName = 'Khách hàng' }) {
    await delay(300);
    const list = initProductsStorage();
    const index = list.findIndex((p) => p.id === productId);
    if (index === -1) throw new Error('Không tìm thấy sản phẩm');

    const product = list[index];
    const newCount = product.reviewCount + 1;
    const newRating = Number(((product.rating * product.reviewCount + rating) / newCount).toFixed(1));

    const updatedProduct = {
      ...product,
      rating: newRating,
      reviewCount: newCount,
    };
    list[index] = updatedProduct;
    storage.set('products', list);

    // Save product reviews
    const reviewsKey = `reviews_${productId}`;
    const reviews = storage.get(reviewsKey, []);
    const newReview = {
      id: 'rev-' + Date.now(),
      userName,
      rating,
      comment,
      date: new Date().toLocaleDateString('vi-VN'),
    };
    reviews.unshift(newReview);
    storage.set(reviewsKey, reviews);

    return { product: updatedProduct, review: newReview };
  },

  async getReviews(productId) {
    await delay(150);
    const reviewsKey = `reviews_${productId}`;
    const defaultReviews = [
      {
        id: 'rev-def-1',
        userName: 'Nguyễn Minh Quân',
        rating: 5,
        comment: 'Hàng chính hãng đóng gói kỹ lưỡng, bé cún nhà mình thích lắm!',
        date: '25/10/2026',
      },
      {
        id: 'rev-def-2',
        userName: 'Lê Thu Hương',
        rating: 5,
        comment: 'Giao hàng siêu nhanh, date xa, dịch vụ chăm sóc khách hàng rất chu đáo.',
        date: '20/10/2026',
      },
    ];
    return storage.get(reviewsKey, defaultReviews);
  },
};

