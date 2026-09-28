import type { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant = 'success' | 'muted' | 'primary';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700',
  muted: 'bg-gray-400 text-white',
  primary: 'bg-blue-100 text-blue-700',
};

export const Badge = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={`px-3 py-1 rounded-md text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
