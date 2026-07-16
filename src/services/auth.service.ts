import api from '@/config/api';
import type { ApiResponse } from '../types/api.types';

export const authService = {
  login: (username: string, password: string) =>
    api.post<ApiResponse<any>>('/auth/login', { username, password }).then(r => r.data.data),
  register: (data: any) =>
    api.post<ApiResponse<any>>('/auth/register', data).then(r => r.data.data),
  me: () =>
    api.get<ApiResponse<any>>('/auth/me').then(r => r.data.data),
  changePassword: (data: any) =>
    api.post<ApiResponse<any>>('/auth/change-password', data).then(r => r.data),
};
