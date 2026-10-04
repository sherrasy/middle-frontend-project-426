import { Formik, Form as FormikForm } from 'formik';
import {
  DELIVERY_METHODS,
  FIELD_LIMITS,
  PLACEHOLDERS,
  UI_MESSAGES,
} from '../lib/consts';
import { TEST_IDS } from '@/shared/constants/testids';
import { FormField } from './form-field';
import { CheckoutFormValues, checkoutSchema } from '../model/checkout.schema';

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => Promise<void>;
  serverError: string | null;
  isSubmitting: boolean;
}

const initialValues: CheckoutFormValues = {
  deliveryMethod: DELIVERY_METHODS.DELIVERY,
  recipientName: '',
  phone: '',
  address: '',
};

export const CheckoutForm = ({
  onSubmit,
  serverError,
  isSubmitting,
}: CheckoutFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={checkoutSchema}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <FormikForm
          data-testid={TEST_IDS.checkout.form}
          className='bg-white rounded-xl border border-gray-200 p-6 space-y-5 lg:col-span-3'
        >
          <h2 className='text-base font-semibold text-gray-900'>Получение</h2>

          <div className='space-y-5'>
            <FormField
              name='deliveryMethod'
              label='Способ получения'
              type='select'
              dataTestId={TEST_IDS.checkout.method}
            >
              <option value={DELIVERY_METHODS.DELIVERY}>
                {UI_MESSAGES.delivery.delivery}
              </option>
              <option value={DELIVERY_METHODS.PICKUP}>
                {UI_MESSAGES.delivery.pickup}
              </option>
            </FormField>

            <FormField
              name='recipientName'
              label='Имя получателя'
              placeholder={PLACEHOLDERS.recipientName}
              maxLength={FIELD_LIMITS.recipientName.maxLength}
              dataTestId={TEST_IDS.checkout.name}
            />

            <FormField
              name='phone'
              label='Телефон'
              type='tel'
              placeholder={PLACEHOLDERS.phone}
              maxLength={FIELD_LIMITS.phone.maxLength}
              dataTestId={TEST_IDS.checkout.phone}
            />

            {values.deliveryMethod === DELIVERY_METHODS.DELIVERY && (
              <FormField
                name='address'
                label='Адрес доставки'
                placeholder={PLACEHOLDERS.address}
                maxLength={FIELD_LIMITS.address.maxLength}
                dataTestId={TEST_IDS.checkout.address}
              />
            )}
          </div>

          {serverError && (
            <div
              className='text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200'
              data-testid={TEST_IDS.order.error}
            >
              {serverError}
            </div>
          )}

          <button
            type='submit'
            data-testid={TEST_IDS.checkout.submit}
            disabled={isSubmitting}
            className='w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
          >
            {isSubmitting ? 'Оформление…' : 'Оформить заказ'}
          </button>
        </FormikForm>
      )}
    </Formik>
  );
};
