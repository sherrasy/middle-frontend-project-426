import { api } from '@/shared/config/axiosApi';
import { AuthResponse } from '../lib/types';

export const registerApi = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
  });
  return data;
};
