import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

type AuthMode = 'login' | 'registration';

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (email: string, password: string) => void;
}

const AUTH_CONFIG = {
  login: {
    title: 'Вход',
    description: null,
    submitButtonText: 'Войти',
    linkText: 'Нет аккаунта?',
    linkLabel: 'Зарегистрироваться',
    linkTo: ROUTES.SIGNIN,
  },
  registration: {
    title: 'Регистрация',
    description:
      'Аккаунт нужен, чтобы оформить заказ и видеть историю покупок.',
    submitButtonText: 'Зарегистрироваться',
    linkText: 'Уже есть аккаунт?',
    linkLabel: 'Войти',
    linkTo: ROUTES.SIGNUP,
  },
} as const;

export const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState('demo+1785426603748@example.com');
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
            className='w-full h-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
            placeholder='Введите email'
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
              className='w-full h-10 border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              placeholder='Введите пароль'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
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
        className='w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors'
      >
        {config.submitButtonText}
      </button>

      <p className='text-center text-sm text-gray-500'>
        {config.linkText}{' '}
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
