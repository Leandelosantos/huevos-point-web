import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center bg-bg-primary px-6">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold text-text-primary">
                Algo salió mal
              </h1>
              <p className="mt-3 font-body text-text-secondary">
                Ocurrió un error inesperado. Por favor recargá la página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 min-h-[44px] rounded-lg bg-yolk px-6 py-3 font-body font-bold text-bg-primary"
              >
                Recargar página
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
