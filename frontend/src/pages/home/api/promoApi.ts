import { api } from '@/shared/config/axiosApi';
import type { components } from '@/shared/types/api-schema';
import { queryOptions } from '@tanstack/react-query';

export const promoApi = {
  baseKey: 'promo',

  getPromo: async () => {
    const response =
      await api.get<components['schemas']['PromoBlock'][]>('/promo');
    return response.data;
  },

  getPromoOptionsQuery: () => {
    return queryOptions({
      queryKey: [promoApi.baseKey],
      queryFn: () => promoApi.getPromo(),
    });
  },
};
