import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            bg-white dark:bg-surface-800 block w-full rounded-lg border
            text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2
            ${error
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
              : 'border-surface-300 dark:border-surface-600 focus:ring-primary-500 focus:border-primary-500'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors duration-200
            disabled:bg-surface-50 dark:disabled:bg-surface-700 disabled:text-surface-500
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;