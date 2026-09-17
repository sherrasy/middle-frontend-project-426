import { api } from '@/shared/config/axiosApi';
import { AuthResponse } from '../lib/types';
import { LOCALSTORAGE_NAMES } from '@/shared/constants/localstorage-names';

export const loginApi = async (email: string, password: string) => {
  const {data} = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  localStorage.setItem(LOCALSTORAGE_NAMES.token, data.token);
  localStorage.setItem(
    LOCALSTORAGE_NAMES.user,
    JSON.stringify(data.user),
  );
  return data;
};
