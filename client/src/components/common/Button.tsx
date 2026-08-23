import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-extrabold rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const mappedVariant = variant === 'outline' ? 'secondary' : variant;

  const variantClasses = {
    primary:
      'bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] shadow-md hover:shadow-[0_0_25px_rgba(232,141,56,0.4)]',
    secondary:
      'bg-[#121E2C] hover:bg-[#1A2E42] text-[#E9E3D2] border border-[#E88D38]/30 shadow-sm hover:border-[#E88D38]/60',
    danger:
      'bg-semantic-danger/20 hover:bg-semantic-danger/30 text-semantic-danger border border-semantic-danger/40',
    ghost:
      'bg-transparent hover:bg-white/5 text-[#A7B1B5] hover:text-[#E9E3D2]',
    outline:
      'bg-[#121E2C] hover:bg-[#1A2E42] text-[#E9E3D2] border border-[#E88D38]/30 shadow-sm hover:border-[#E88D38]/60',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs space-x-1.5',
    md: 'px-4 py-2.5 text-xs space-x-2',
    lg: 'px-6 py-3.5 text-sm space-x-2.5',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[mappedVariant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
