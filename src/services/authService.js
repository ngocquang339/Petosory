import { storage } from '../utils/storage';
import { INITIAL_USER, ROLES } from '../utils/constants';

// Simulated delay helper for realistic UX
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay();
    // Default mock user check or demo bypass
    const savedUser = storage.get('current_user') || INITIAL_USER;
    if (email && password) {
      const token = 'mock-jwt-token-' + Date.now();
      storage.set('auth_token', token);
      const user = { ...savedUser, email };
      storage.set('current_user', user);
      return { token, user };
    }
    throw new Error('Email hoặc mật khẩu không chính xác');
  },

  async loginAsDemo(role = ROLES.CUSTOMER) {
    await delay(200);
    const token = 'mock-jwt-demo-' + role;
    storage.set('auth_token', token);

    let user;
    if (role === ROLES.SPA_OWNER) {
      user = {
        id: 'usr-owner-1',
        email: 'owner@petosory.vn',
        fullName: 'Trần Văn Quản Lý',
        phone: '0988 123 456',
        role: ROLES.SPA_OWNER,
        spaName: 'Petosory Flagship Spa',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        pets: [],
      };
    } else {
      user = storage.get('current_user') || INITIAL_USER;
      user.role = ROLES.CUSTOMER;
    }

    storage.set('current_user', user);
    return { token, user };
  },

  async register({ fullName, email, password, phone }) {
    await delay(400);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Save pending registration
    const pendingUser = {
      id: 'usr-' + Date.now(),
      fullName,
      email,
      phone,
      role: ROLES.CUSTOMER,
      verificationCode,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      pets: [],
    };
    storage.set('pending_registration', pendingUser);
    return {
      message: 'Mã xác thực đã được gửi đến email ' + email,
      verificationCode, // Returned for effortless testing in development
    };
  },

  async verifyEmail(code) {
    await delay(300);
    const pendingUser = storage.get('pending_registration');
    if (!pendingUser) {
      throw new Error('Không tìm thấy thông tin đăng ký chờ xác thực');
    }
    if (pendingUser.verificationCode === code.trim() || code.trim() === '123456') {
      const token = 'mock-jwt-token-' + Date.now();
      delete pendingUser.verificationCode;
      storage.set('auth_token', token);
      storage.set('current_user', pendingUser);
      storage.remove('pending_registration');
      return { token, user: pendingUser };
    }
    throw new Error('Mã xác thực OTP không chính xác!');
  },

  async resetPassword(email) {
    await delay(400);
    if (!email) throw new Error('Vui lòng nhập email');
    return {
      message: `Hướng dẫn đặt lại mật khẩu đã được gửi đến ${email}. (Mã xác thực demo: 654321)`,
      resetCode: '654321',
    };
  },

  async changePassword(currentPassword, newPassword) {
    await delay(300);
    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    return { message: 'Đổi mật khẩu thành công!' };
  },

  getCurrentUser() {
    return storage.get('current_user', null);
  },

  logout() {
    storage.remove('auth_token');
    storage.remove('current_user');
  },
};

