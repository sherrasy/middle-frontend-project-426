import { AuthForm } from '@/shared/ui/auth-form';

export const SignInPage = () => {
  const handleSubmit = (email: string, password: string) => {
    // Логика регистрации
    console.log('Register:', email, password);
  };

  return (
    <div className='w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
      <AuthForm mode='registration' onSubmit={handleSubmit} />
    </div>
  );
};
