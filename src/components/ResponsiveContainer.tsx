import { type ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ResponsiveContainer = memo(({
  children,
  className,
  maxWidth = 'full',
  padding = 'md'
}: ResponsiveContainerProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-7xl'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 md:px-4 py-2 md:py-4',
    md: 'px-4 md:px-6 py-4 md:py-6',
    lg: 'px-6 md:px-8 py-6 md:py-8'
  };

  return (
    <div className={cn(
      "mx-auto w-full",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
});

ResponsiveContainer.displayName = 'ResponsiveContainer';