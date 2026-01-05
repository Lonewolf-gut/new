import React from 'react';
import { Route, Routes } from 'react-router';

interface AdminRoutesProps {
  userRole: string;
  fallback?: React.ReactNode;
}

export const AdminRoutes: React.FC<AdminRoutesProps> = ({ userRole: _userRole }) => {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Admin Features Not Available</h2>
              <p className="text-muted-foreground">
                Admin functionality has been removed in this minimal version.
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};