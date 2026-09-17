import { api } from '@/shared/config/axiosApi';
import { LOCALSTORAGE_NAMES } from '@/shared/constants/localstorage-names';

export const logoutApi = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem(LOCALSTORAGE_NAMES.token);
    localStorage.removeItem(LOCALSTORAGE_NAMES.user);
  }
};
