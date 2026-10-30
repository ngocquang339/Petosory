import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20 focus:ring-orange-500',
    secondary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/20 focus:ring-sky-500',
    outline: 'border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-orange-500',
    ghost: 'bg-transparent hover:bg-orange-50 dark:hover:bg-orange-950/30 text-orange-600 dark:text-orange-400 focus:ring-orange-500',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 focus:ring-rose-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
export default Button;

