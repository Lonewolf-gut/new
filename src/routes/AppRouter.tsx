import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { PatientRoutes } from '@/routes/PatientRoutes';
import { DoctorRoutes } from '@/routes/DoctorRoutes';
import { HospitalAdminRoutes } from '@/routes/HospitalAdminRoutes';
import {
  LazyAuthForm,
  LazyProgressiveOnboarding,
  withSuspense
} from '@/components/lazy/LazyComponents';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { LandingPage } from '@/pages/LandingPage';
import { TermsOfService } from '@/pages/Terms';
import { PaymentRefundPolicy } from '@/pages/Payment';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import PaymentCallback from '@/components/PaymentCallback';
import type { UserRole } from '@/types/interfaces';

export const AppRouter: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, user, redirectToDashboard } = useAuth();

  const SuspenseAuthForm = withSuspense(LazyAuthForm);
  const SuspenseProgressiveOnboarding = withSuspense(LazyProgressiveOnboarding);

  const handleBack = () => {
    window.history.back();
  };

  const handleAuthSuccess = () => {
    navigate('/');
  };

  const handleOnboardingComplete = () => {
    // After onboarding, send the user to their role-specific dashboard
    const role = user?.profile?.role as UserRole | undefined;

    if (role) {
      redirectToDashboard(role);
    } else {
      // Fallback to home if we somehow don't have the role yet
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner text='Loading...' />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <LandingPage />
        }
      />

    <Route path="/terms" element={<TermsOfService />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />    
    <Route path="/payment" element={<PaymentRefundPolicy />} />    

      <Route
        path="/auth"
        element={
          <SuspenseAuthForm
            onBack={handleBack}
            onSuccess={handleAuthSuccess}
          />
        }
      />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute
            allowedRoles={['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN']}
          >
            <SuspenseProgressiveOnboarding
              onBack={handleBack}
              onSuccess={handleOnboardingComplete}
            />
          </ProtectedRoute>
        }
      />

      {/* Protected role-based routes */}
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospital-admin/*"
        element={
          <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN']}>
            <HospitalAdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* Dashboard redirect route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN']}>
            <Navigate to="/" replace />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="/payment/callback" element={<PaymentCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


