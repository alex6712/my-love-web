import { Toaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white',
      }}
    />
  );
};
