import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

export const FormField = ({ label, htmlFor, children }: FormFieldProps) => (
  <div>
    <label
      htmlFor={htmlFor}
      className='block text-lg font-semibold text-gray-900 mb-2 cursor-pointer'
    >
      {label}
    </label>
    {children}
  </div>
);
