import { TEST_IDS } from '@/shared/constants/testids';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form as FormikForm } from 'formik';
import { AUTH_CONFIG } from '../lib/authForm.config';
import { authSchema, AuthFormValues } from '../model/auth.schema';
import { FormField } from '@/shared/ui/form-field';
import { PLACEHOLDERS } from '@/shared/constants/form-field-data';

type AuthMode = 'login' | 'registration';

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (email: string, password: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

const initialValues: AuthFormValues = {
  email: '',
  password: '',
};

export const AuthForm = ({
  mode,
  onSubmit,
  error,
  isLoading = false,
}: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const config = AUTH_CONFIG[mode];

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const passwordToggle = (
    <button
      type='button'
      onClick={togglePasswordVisibility}
      className='text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50'
      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
      disabled={isLoading}
    >
      <span className='material-symbols-outlined text-[20px]'>
        {showPassword ? 'visibility_off' : 'visibility'}
      </span>
    </button>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={authSchema}
      onSubmit={(values) => onSubmit(values.email, values.password)}
    >
      <FormikForm className='space-y-6'>
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
          <FormField
            name='email'
            label='Email'
            type='email'
            placeholder={PLACEHOLDERS.email}
            disabled={isLoading}
            dataTestId={TEST_IDS.auth.email}
          />

          <FormField
            name='password'
            label='Пароль'
            type='password'
            placeholder={PLACEHOLDERS.password}
            disabled={isLoading}
            dataTestId={TEST_IDS.auth.password}
            rightAddon={passwordToggle}
          />
        </div>

        <button
          type='submit'
          data-testid={TEST_IDS.auth.submit}
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
            className='text-blue-500 hover:text-blue-600 font-medium pl-1'
          >
            {config.linkLabel}
          </Link>
        </p>
      </FormikForm>
    </Formik>
  );
};
