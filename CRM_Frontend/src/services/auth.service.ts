import api from './api';
import type { User } from '../types';

interface LoginResponse {
  token: string;
  user: User & { id: string };
}

export const authService = {
  /**
   * Login — stores token in localStorage, returns user object.
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await api.post<{ data: LoginResponse }>('/auth/login', { email, password });
    const { token, user } = res.data.data;
    localStorage.setItem('crm_token', token);
    return { token, user };
  },

  /**
   * Logout — clears token locally and invalidates cookie on server.
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_auth');
    }
  },

  /**
   * Fetch the currently authenticated user from the server.
   */
  getMe: async (): Promise<User> => {
    const res = await api.get<{ data: User & { id: string } }>('/auth/me');
    return res.data.data;
  },
};
