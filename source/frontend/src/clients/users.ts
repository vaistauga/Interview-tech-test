import { API_CONFIG } from '@/config/api';
import { User } from '@/types/User';
import { apiClient } from './api-client';

export const usersClient = {
  getUsers: async (accountId: string): Promise<User[]> => {
    const response = await apiClient.get<User[]>(API_CONFIG.ENDPOINTS.USERS, {
      params: {
        accountId,
      },
    });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(
      `${API_CONFIG.ENDPOINTS.USERS}/${id}`,
    );
    return response.data;
  },

  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await apiClient.post<User>(
      API_CONFIG.ENDPOINTS.USERS,
      user,
    );
    return response.data;
  },

  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(
      `${API_CONFIG.ENDPOINTS.USERS}/${id}`,
      user,
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
  },

  importUsers: async (
    accountId: string,
    file: File,
  ): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();

    formData.append('accountId', accountId);
    formData.append('file', file);

    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(API_CONFIG.ENDPOINTS.USERS_IMPORT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
