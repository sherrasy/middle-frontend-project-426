import { useField } from 'formik';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email';
  placeholder?: string;
  maxLength?: number;
  dataTestId?: string;
}

interface FormSelectFieldProps {
  name: string;
  label: string;
  type: 'select';
  dataTestId?: string;
  children: React.ReactNode;
}

type FormFieldCombinedProps = FormFieldProps | FormSelectFieldProps;

export const FormField = (props: FormFieldCombinedProps) => {
  const [field, meta] = useField(props.name);
  const hasError = meta.touched && meta.error;

  const baseClasses =
    'w-full px-3 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  const errorClasses = hasError ? 'border-red-400' : 'border-gray-300';

  return (
    <div>
      <label className='block text-sm font-medium text-gray-900 mb-1.5'>
        {props.label}
      </label>

      {props.type === 'select' ? (
        <select
          {...field}
          data-testid={props.dataTestId}
          className={`${baseClasses} ${errorClasses} bg-white appearance-none cursor-pointer`}
        >
          {props.children}
        </select>
      ) : (
        <input
          {...field}
          type={props.type ?? 'text'}
          data-testid={props.dataTestId}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          className={`${baseClasses} ${errorClasses}`}
        />
      )}

      {hasError && <p className='mt-1 text-sm text-red-500'>{meta.error}</p>}
    </div>
  );
};
