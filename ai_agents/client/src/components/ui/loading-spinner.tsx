/**
 * Loading Spinner Component
 * Reusable loading indicator for async operations
 */

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingState({ message = 'Loading...', fullPage = false }: LoadingStateProps) {
  const containerClass = fullPage
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto text-teal-600" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
