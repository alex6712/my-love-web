import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-pink/10 to-romantic-rose/10">
            <div className="text-center p-8 glass-effect rounded-2xl">
              <h1 className="text-2xl font-bold text-romantic-heart mb-4">
                Ой! Что-то пошло не так
              </h1>
              <p className="text-muted-foreground mb-6">
                Мы уже работаем над исправлением этой проблемы
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Обновить страницу
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
