/**
 * Empty State Component
 * Display when no data is available
 */

import { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        
        {children}
      </div>
    </div>
  );
}
