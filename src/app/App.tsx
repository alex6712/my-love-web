import { Suspense } from 'react';
import { AppRouter } from '@/app/providers/router';
import { ToastProvider } from '@/app/providers/ToastProvider';
import { ErrorBoundary } from '@/app/providers/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Загрузка...
          </div>
        }
      >
        <AppRouter />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
