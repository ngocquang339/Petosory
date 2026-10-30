import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  className = '',
  disabled = false,
  helperText,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={id}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-200'
          } bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 ${
            Icon ? 'pl-11' : ''
          } text-sm transition-colors focus:outline-none focus:ring-3 disabled:opacity-50 disabled:bg-slate-50`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
export default Input;

