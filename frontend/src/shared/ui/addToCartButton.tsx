import type { ButtonHTMLAttributes } from 'react';

interface AddToCartButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isAccessible: boolean;
}

export const AddToCartButton = ({
  isAccessible,
  className = '',
  ...props
}: AddToCartButtonProps) => {
  return (
    <button
      type='button'
      disabled={!isAccessible}
      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
        isAccessible
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      } ${className}`}
      {...props}
    >
      В корзину
    </button>
  );
};
