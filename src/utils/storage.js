// LocalStorage wrapper with serialization and error-handling
const STORAGE_PREFIX = 'petosory_';

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading key "${key}" from localStorage:`, error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error saving key "${key}" to localStorage:`, error);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.warn(`Error removing key "${key}" from localStorage:`, error);
    }
  },

  clear() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  },
};

