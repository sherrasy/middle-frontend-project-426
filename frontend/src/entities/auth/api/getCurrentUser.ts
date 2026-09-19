import { api } from '@/shared/config/axiosApi';
import { User } from '../lib/types';

export const getCurrentUserApi = async () => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};
