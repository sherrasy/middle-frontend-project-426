import { api } from '@/shared/config/axiosApi';
import { AuthResponse } from '../lib/types';

export const loginApi = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return data;
};
