'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI Button
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
  onError?: (error: Error, errorInfo: ErrorInfo) => void; // Optional error callback
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null }; // errorInfo is set in componentDidCatch
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally, you could try to reload the page or trigger a specific re-fetch
    // window.location.reload(); // Simplest retry, but might not be ideal for all cases
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-card border border-destructive/50 rounded-lg shadow-md text-card-foreground"
        >
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-headline font-semibold text-destructive mb-2">
            Oops! Something went wrong.
          </h2>
          <p className="text-muted-foreground font-body text-center mb-6 max-w-md">
            We're sorry for the inconvenience. An unexpected error occurred.
            Please try again, or contact support if the problem persists.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 w-full max-w-md bg-destructive/10 p-3 rounded-md text-left">
              <summary className="cursor-pointer font-medium text-destructive">Error Details (Dev Mode)</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-destructive/80 break-all">
                {this.state.error.toString()}
                {this.state.errorInfo && `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}`}
              </pre>
            </details>
          )}

          <Button
            onClick={this.handleRetry}
            variant="outline"
            className="font-body border-primary text-primary hover:bg-primary/10 hover:text-primary"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
