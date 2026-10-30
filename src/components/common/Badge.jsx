import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    info: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};
export default Badge;

