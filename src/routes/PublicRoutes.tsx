import React from 'react';
import { Routes, Route } from 'react-router';
import { LazyNotFound, withSuspense } from '@/components/lazy/LazyComponents';

export const PublicRoutes: React.FC = () => {
  const SuspenseNotFound = withSuspense(LazyNotFound);

  return (
    <Routes>
      <Route
        path="*"
        element={<SuspenseNotFound />}
      />
    </Routes>
  );
};