export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  // Vietnamese phone format check: 10 digits starting with 03, 05, 07, 08, 09
  const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return re.test(phone.replace(/\s+/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateCheckoutForm = (data) => {
  const errors = {};
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Vui lòng nhập họ tên người nhận (ít nhất 2 ký tự)';
  }
  if (!data.phone || !validatePhone(data.phone)) {
    errors.phone = 'Vui lòng nhập số điện thoại hợp lệ (10 số)';
  }
  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'Vui lòng nhập địa chỉ giao hàng chi tiết';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateReviewForm = (data) => {
  const errors = {};
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Vui lòng chọn số sao đánh giá (1 - 5)';
  }
  if (!data.comment || data.comment.trim().length < 5) {
    errors.comment = 'Vui lòng nhập nhận xét ít nhất 5 ký tự';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

