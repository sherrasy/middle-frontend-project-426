import { TEST_IDS } from '@/shared/constants/testids';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AUTH_CONFIG } from '../lib/authForm.config';

type AuthMode = 'login' | 'registration';

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (email: string, password: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

export const AuthForm = ({
  mode,
  onSubmit,
  error,
  isLoading = false,
}: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const config = AUTH_CONFIG[mode];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          {config.title}
        </h1>
        {config.description && (
          <p className='text-sm text-gray-500'>{config.description}</p>
        )}
      </div>

      {error && (
        <div
          className='p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'
          data-testid={TEST_IDS.auth.error}
        >
          {error}
        </div>
      )}

      <div className='space-y-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-900 mb-1'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full h-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
            placeholder='Введите email'
            disabled={isLoading}
            data-testid={TEST_IDS.auth.email}
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-900 mb-1'
          >
            Пароль
          </label>
          <div className='relative'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full h-10 border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
              placeholder='Введите пароль'
              disabled={isLoading}
              data-testid={TEST_IDS.auth.password}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50'
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              disabled={isLoading}
            >
              <span className='material-symbols-outlined text-[20px]'>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='w-full h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
      >
        {isLoading ? (
          <>
            <span className='material-symbols-outlined text-[18px] animate-spin'>
              progress_activity
            </span>
            {mode === 'login' ? 'Вход...' : 'Регистрация...'}
          </>
        ) : (
          config.submitButtonText
        )}
      </button>

      <p className='text-center text-sm text-gray-500'>
        {config.linkText}
        <Link
          to={config.linkTo}
          className='text-blue-500 hover:text-blue-600 font-medium'
        >
          {config.linkLabel}
        </Link>
      </p>
    </form>
  );
};
