import { useField } from 'formik';

interface FormFieldBaseProps {
  name: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  dataTestId?: string;
  disabled?: boolean;
  className?: string;
  rightAddon?: React.ReactNode;
}

interface FormFieldInputProps extends FormFieldBaseProps {
  type?: 'text' | 'tel' | 'email' | 'password';
}

interface FormFieldSelectProps extends FormFieldBaseProps {
  type: 'select';
  children: React.ReactNode;
}

type FormFieldCombinedProps = FormFieldInputProps | FormFieldSelectProps;

export const FormField = (props: FormFieldCombinedProps) => {
  const [field, meta] = useField(props.name);
  const hasError = Boolean(meta.touched && meta.error);

  const baseClasses =
    'w-full px-3 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100';

  const errorClasses = hasError ? 'border-red-400' : 'border-gray-300';
  const addonClasses = props.rightAddon ? 'pr-10' : '';
  const customClasses = props.className ?? '';

  return (
    <div>
      <label className='block text-sm font-medium text-gray-900 mb-1.5'>
        {props.label}
      </label>

      <div className='relative'>
        {props.type === 'select' ? (
          <select
            {...field}
            data-testid={props.dataTestId}
            disabled={props.disabled}
            className={`${baseClasses} ${errorClasses} ${customClasses} bg-white cursor-pointer`}
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
            disabled={props.disabled}
            className={`${baseClasses} ${errorClasses} ${addonClasses} ${customClasses}`}
          />
        )}

        {props.rightAddon && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2'>
            {props.rightAddon}
          </div>
        )}
      </div>

      {hasError && <p className='mt-1 text-sm text-red-500'>{meta.error}</p>}
    </div>
  );
};
