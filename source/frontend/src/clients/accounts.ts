import { API_CONFIG } from '@/config/api';
import { apiClient } from './api-client';

export interface Account {
  id: string;
  name: string;
  description: string;
  defaultLanguage: string;
  isFreeTrial: boolean;
  createdAt: string;
  updatedAt: string;
}

export const accountsClient = {
  getAll: async (): Promise<Account[]> => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ACCOUNTS);
    return response.data;
  },

  getById: async (id: string): Promise<Account> => {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.ACCOUNTS}/${id}`,
    );
    return response.data;
  },
};
