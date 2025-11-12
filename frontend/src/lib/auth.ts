import { User, AuthResponse } from './api';
import { emitAuthChange } from './auth-events';

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    emitAuthChange();
  }
};

export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const logout = () => {
  removeAuthToken();
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const handleAuthResponse = (response: AuthResponse) => {
  setAuthToken(response.token);
  setUser({
    userId: response.userId,
    username: response.username,
    email: response.email,
  });
  emitAuthChange();
};
