import { useState } from 'react';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/common';

interface UseAuthFormProps {
  onSuccess?: () => void;
}

export const useAuthForm = ({ onSuccess }: UseAuthFormProps = {}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async <T>({
    promise,
    errorMessage = 'Произошла ошибка',
  }: {
    promise: Promise<T>;
    errorMessage?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await promise;
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        const apiError = err.response?.data as ApiError;
        setError(apiError?.message || errorMessage);
      } else {
        setError('Произошла непредвиденная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { error, setError, isLoading, handleSubmit };
};
