"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  section?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.section || 'component'}:`, error, errorInfo);
    // Here you could send the error to an error reporting service
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <ErrorFallback error={this.state.error} resetError={this.resetError} section={this.props.section} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  section?: string;
}

export function ErrorFallback({ error, resetError, section }: ErrorFallbackProps) {
  const sectionName = section ? `${section} section` : 'this section';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border border-destructive/20 rounded-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Something went wrong in {sectionName}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        We encountered an error while loading {sectionName}. This might be a temporary issue.
      </p>

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-4 w-full max-w-2xl">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
            Error Details (Development Only)
          </summary>
          <pre className="mt-2 p-3 bg-muted rounded text-left text-xs overflow-auto">
            <code>{error.message}</code>
            {error.stack && (
              <>
                <br /><br />
                <code>{error.stack}</code>
              </>
            )}
          </pre>
        </details>
      )}

      <div className="flex gap-3">
        <Button onClick={resetError} size="sm" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button asChild size="sm">
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Specialized error boundaries for different sections

export function DashboardErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      section="Dashboard"
      fallback={({ resetError }) => (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <ErrorFallback
            resetError={resetError}
            section="Dashboard"
          />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function FormErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      section="Form"
      fallback={({ resetError }) => (
        <div className="p-6 bg-card border border-destructive/20 rounded-lg">
          <ErrorFallback
            resetError={resetError}
            section="Form"
          />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function DataErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      section="Data Loading"
      fallback={({ resetError }) => (
        <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg">
          <ErrorFallback
            resetError={resetError}
            section="Data Loading"
          />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// Hook for functional components to use error boundaries
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Caught error:', error, errorInfo);
    // In a real app, send to error reporting service
  };
}
