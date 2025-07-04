import { apiClient } from './apiClient';
import { LoginForm, RegisterForm, ApiResponse, User } from '@/types';

export const authService = {
  login: async (credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterForm): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ token: string }>> => {
    const response = await apiClient.put(`/auth/reset-password/${token}`, { 
      password,
      confirmPassword: password 
    });
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse> => {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  updateProfile: async (profileData: any): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  updateStatus: async (status: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.put('/users/status', { status });
    return response.data;
  },

  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await apiClient.put('/users/change-password', passwords);
    return response.data;
  },

  uploadAvatar: async (imageUri: string): Promise<ApiResponse<{ user: User; avatar: string }>> => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const response = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAvatar: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.delete('/users/avatar');
    return response.data;
  },
};