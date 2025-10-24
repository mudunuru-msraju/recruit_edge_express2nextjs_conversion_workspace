/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ui/error-state';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title="Application Error"
          message="Something went wrong in this section. Please try refreshing."
          error={this.state.error || undefined}
          onRetry={this.handleReset}
          showHomeLink={true}
        />
      );
    }

    return this.props.children;
  }
}
