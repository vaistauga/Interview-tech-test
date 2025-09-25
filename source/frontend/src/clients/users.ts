import { API_CONFIG } from '@/config/api';
import { User } from '@/types/User';
import { apiClient } from './api-client';

interface JobStatusResult {
  jobId: string;
  createdAt: string;
  progress: number;
  status: string;
  result: {
    totalUserRows: number;
    newUsers: number;
    fileId: string;
  };
  finishedAt: string;
}

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

  importUsersFile: async (
    accountId: string,
    file: File,
  ): Promise<{ jobId: string; message: string; success: boolean }> => {
    const formData = new FormData();

    formData.append('accountId', accountId);
    formData.append('file', file);

    const response = await apiClient.post<{
      success: boolean;
      message: string;
      jobId: string;
    }>(API_CONFIG.ENDPOINTS.USERS_IMPORT_FILE_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getJobStatus: async (jobId: string): Promise<JobStatusResult> => {
    const response = await apiClient.get<JobStatusResult>(
      `${API_CONFIG.ENDPOINTS.USERS_IMPORT_FILE_STATUS}/status/${jobId}`,
    );
    return response.data;
  },
};
