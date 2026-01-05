import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export interface ToastOptions {
  message: string;
  description?: string;
  type: ToastType;
}

export const showToast = ({ message, description, type }: ToastOptions) => {
  const toastConfig = {
    description,
    style: getToastStyle(type),
    className: getToastClassName(type)
  };

  switch (type) {
    case 'success':
      return toast.success(message, toastConfig);
    case 'error':
      return toast.error(message, toastConfig);
    case 'warning':
      return toast.warning(message, toastConfig);
    case 'info':
      return toast.info(message, toastConfig);
    case 'loading':
      return toast.loading(message, toastConfig);
    default:
      return toast(message, toastConfig);
  }
};

const getToastStyle = (type: ToastType): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    border: '0px solid',
  };

  switch (type) {
    case 'success':
    return {
      ...baseStyle,
      backgroundColor: '#f0fdf4',
      color: '#0d542b',
      borderColor: '#22c55e',
    };
    case 'error':
      return {
        ...baseStyle,
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        borderColor: '#ef4444',
      };
    case 'warning':
      return {
        ...baseStyle,
        backgroundColor: '#fffbeb',
        color: '#d97706',
        borderColor: '#f59e0b',
      };
    case 'info':
      return {
        ...baseStyle,
        backgroundColor: '#eff6ff',
        color: '#2563eb',
        borderColor: '#3b82f6',
      };
    case 'loading':
      return {
        ...baseStyle,
        backgroundColor: '#f8fafc',
        color: '#475569',
        borderColor: '#94a3b8',
      };
    default:
      return baseStyle;
  }
};

/**
 * Get CSS class names for toast based on type
 */
const getToastClassName = (type: ToastType): string => {
  const baseClasses = 'font-medium';
  
  switch (type) {
    case 'success':
      return `${baseClasses} text-green-800 bg-green-50 border-green-200`;
    case 'error':
      return `${baseClasses} text-red-800 bg-red-50 border-red-200`;
    case 'warning':
      return `${baseClasses} text-yellow-800 bg-yellow-50 border-yellow-200`;
    case 'info':
      return `${baseClasses} text-blue-800 bg-blue-50 border-blue-200`;
    case 'loading':
      return `${baseClasses} text-gray-800 bg-gray-50 border-gray-200`;
    default:
      return baseClasses;
  }
};

// Convenience functions for common toast types
export const showSuccessToast = (message: string, description?: string) => 
  showToast({ message, description, type: 'success' });

export const showErrorToast = (message: string, description?: string) => 
  showToast({ message, description, type: 'error' });

export const showWarningToast = (message: string, description?: string) => 
  showToast({ message, description, type: 'warning' });

export const showInfoToast = (message: string, description?: string) => 
  showToast({ message, description, type: 'info' });

export const showLoadingToast = (message: string, description?: string) => 
  showToast({ message, description, type: 'loading' });