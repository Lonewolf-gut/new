import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import React from 'react';

// Loading fallback component
export const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  </div>
);

// Patients Dashboard Components
export const LazyPatientDashboardLayout = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.PatientDashboardLayout
  }))
);

export const LazyPatientDashboardPage = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.PatientDashboardPage
  }))
);

export const LazyPatientHealthRecords = React.lazy(() =>
  import('@/components/patient/PatientHealthRecords').then(module => ({
    default: module.PatientHealthRecords
  }))
);

export const LazyPatientProfile = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.PatientProfile
  }))
);

export const LazyPatientBills = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.PatientBills
  }))
);

export const LazyAvailableDoctors = React.lazy(() =>
  import('@/components/patient/AvailableDoctors').then(module => ({
    default: module.AvailableDoctors
  }))
);

// Doctors Dashboard Components
export const LazyDoctorDashboardLayoutPage = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.DoctorDashboardLayoutPage
  }))
);
export const LazyDoctorDashboardPage = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.DoctorDashboardPage
  }))
);
export const LazyDoctorAppointments = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.DoctorAppointments
  }))
);
export const LazyDoctorAvailability = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.DoctorAvailability
  }))
);
export const LazyDoctorPatients = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.DoctorPatients
  }))
);
export const LazyDoctorProfile = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.DoctorProfile
  }))
);

// Hospital Admin Dashboard Components
export const LazyHospitalAdminDashboardPage = React.lazy(() =>
  import('@/components/lazy/LazyPageComponents').then(module => ({
    default: module.HospitalAdminDashboardPage
  }))
);

// Auth Components
export const LazyAuthForm = React.lazy(() =>
  import('@/components/auth/AuthForm').then(module => ({
    default: module.AuthForm
  }))
);

export const LazyProgressiveOnboarding = React.lazy(() =>
  import('@/shared/components/auth/ProgressiveOnboarding').then(module => ({
    default: module.ProgressiveOnboarding
  }))
);

// Public Components
export const LazyNotFound = React.lazy(() => import('@/pages/NotFound'));

// for wrapping lazy components with suspense
export const withSuspense = <P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ReactNode = <LoadingFallback />
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  );

  WrappedComponent.displayName = `withSuspense(${Component.displayName || Component.name})`;

  return WrappedComponent;
};