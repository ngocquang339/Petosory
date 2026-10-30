import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { ROLES, INITIAL_USER } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user session
    const current = authService.getCurrentUser() || INITIAL_USER;
    setUser(current);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { user: loggedInUser } = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginAsDemo = async (role = ROLES.CUSTOMER) => {
    const { user: demoUser } = await authService.loginAsDemo(role);
    setUser(demoUser);
    return demoUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const updated = await userService.updateProfile(profileData);
    setUser({ ...updated });
    return updated;
  };

  const addPet = async (petData) => {
    await userService.addPet(petData);
    const updated = await userService.getProfile();
    setUser({ ...updated });
  };

  const deletePet = async (petId) => {
    await userService.deletePet(petId);
    const updated = await userService.getProfile();
    setUser({ ...updated });
  };

  const isAuthenticated = Boolean(user && user.role !== ROLES.GUEST);
  const role = user?.role || ROLES.GUEST;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        login,
        loginAsDemo,
        logout,
        updateUserProfile,
        addPet,
        deletePet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

