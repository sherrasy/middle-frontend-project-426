import { api } from '@/shared/config/axiosApi';

export const logoutApi = async () => {
  await api.post('/auth/logout');
};
