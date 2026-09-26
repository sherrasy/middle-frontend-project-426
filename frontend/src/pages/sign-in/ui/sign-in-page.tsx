import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/entities/auth';
import { ROUTES } from '@/shared/constants/routes';
import { AuthForm } from '@/feature/auth-user/ui/auth-form';
import { useAuthForm } from '@/feature/auth-user/model/useAuthForm';

export const SignInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { error, isLoading, handleSubmit } = useAuthForm({
    onSuccess: () => navigate(ROUTES.CABINET, { replace: true }),
  });

  const onSubmit = (email: string, password: string) =>
    handleSubmit({
      promise: login(email, password),
      errorMessage: 'Ошибка входа. Проверьте данные.',
    });

  return (
    <div className='mx-auto w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
      <AuthForm
        mode='login'
        onSubmit={onSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};
