import { AuthForm } from '@/shared/ui/auth-form';

export const SignUpPage = () => {
  const handleSubmit = (email: string, password: string) => {
    // Логика входа
    console.log('Login:', email, password);
  };

  return (
    <div className='w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
      <AuthForm mode='login' onSubmit={handleSubmit} />
    </div>
  );
};
