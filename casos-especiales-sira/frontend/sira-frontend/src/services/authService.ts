import type { ApiResponse, LoginRequest, LoginResponse } from '../types';
import api from './api';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },
};
