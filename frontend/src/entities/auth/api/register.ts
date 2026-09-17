import { api } from '@/shared/config/axiosApi';
import { LOCALSTORAGE_NAMES } from '@/shared/constants/localstorage-names';
import { AuthResponse } from '../lib/types';

export const registerApi = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
  });
  localStorage.setItem(LOCALSTORAGE_NAMES.token, data.token);
  localStorage.setItem(LOCALSTORAGE_NAMES.user, JSON.stringify(data.user));
  return data;
};
