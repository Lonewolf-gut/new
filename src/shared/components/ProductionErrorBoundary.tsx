import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ProductionErrorFallback() {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We encountered an unexpected error. Please try refreshing the page or return to the home page.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button onClick={handleReload} variant="outline" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            <Button onClick={handleGoHome} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ProductionErrorBoundaryProps {
  children: React.ReactNode;
}

export function ProductionErrorBoundary({ children }: ProductionErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={<ProductionErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
}