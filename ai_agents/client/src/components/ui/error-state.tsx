/**
 * Error State Components
 * Reusable error displays with retry functionality
 */

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  showHomeLink?: boolean;
  fullPage?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  showHomeLink = false,
  fullPage = false,
}: ErrorStateProps) {
  const containerClass = fullPage
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex items-center justify-center p-8';

  const errorMessage = message || (typeof error === 'string' ? error : error?.message);

  return (
    <div className={containerClass}>
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          
          {errorMessage && (
            <p className="text-gray-600 mb-6">{errorMessage}</p>
          )}

          <div className="flex flex-col gap-3">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            
            {showHomeLink && (
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InlineErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function InlineError({ message, onDismiss }: InlineErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}
