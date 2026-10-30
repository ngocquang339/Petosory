import { storage } from '../utils/storage';
import { INITIAL_USER } from '../utils/constants';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const getCurrentUserFromStorage = () => {
  let user = storage.get('current_user');
  if (!user) {
    storage.set('current_user', INITIAL_USER);
    user = INITIAL_USER;
  }
  return user;
};

export const userService = {
  async getProfile() {
    await delay();
    return getCurrentUserFromStorage();
  },

  async updateProfile(profileData) {
    await delay(300);
    const user = getCurrentUserFromStorage();
    const updated = { ...user, ...profileData };
    storage.set('current_user', updated);
    return updated;
  },

  async getPets() {
    await delay();
    const user = getCurrentUserFromStorage();
    return user.pets || [];
  },

  async addPet(petData) {
    await delay(250);
    const user = getCurrentUserFromStorage();
    const newPet = {
      id: 'pet-' + Date.now(),
      avatar:
        petData.type === 'cat'
          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80',
      ...petData,
    };
    const updatedPets = [...(user.pets || []), newPet];
    const updated = { ...user, pets: updatedPets };
    storage.set('current_user', updated);
    return newPet;
  },

  async deletePet(petId) {
    await delay(200);
    const user = getCurrentUserFromStorage();
    const updatedPets = (user.pets || []).filter((p) => p.id !== petId);
    const updated = { ...user, pets: updatedPets };
    storage.set('current_user', updated);
    return updatedPets;
  },
};

