import React, { Suspense, lazy } from 'react';
import { FeatureErrorBoundary } from '@/components/FeatureErrorBoundary';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

// Lazy load
// Patient dashboard components
const LazyPatientDashboard = lazy(() =>
  import('@/pages/PatientDashboard')
    .catch(error => {
      console.error('Failed to load PatientDashboard chunk:', error);
      throw new Error(`PatientDashboard component failed to load: ${error.message}`);
    })
);
const LazyPatientDashboardLayout = lazy(() =>
  import('@/components/patient/PatientDashboard_Layout')
    .catch(error => {
      console.error('Failed to load PatientDashboardLayout chunk:', error);
      throw new Error(`PatientDashboardLayout component failed to load: ${error.message}`);
    })
);
const LazyPatientHealthRecords = lazy(() =>
  import('@/components/patient/PatientHealthRecords')
    .catch(error => {
      console.error('Failed to load PatientHealthRecords chunk:', error);
      throw new Error(`PatientHealthRecords component failed to load: ${error.message}`);
    })
);
const LazyAvailableDoctors = lazy(() =>
  import('@/components/patient/AvailableDoctors')
    .catch(error => {
      console.error('Failed to load AvailableDoctors chunk:', error);
      throw new Error(`AvailableDoctors component failed to load: ${error.message}`);
    })
);
const LazyPatientProfile = lazy(() =>
  import('@/components/patient/PatientProfile')
    .catch(error => {
      console.error('Failed to load PatientProfile chunk:', error);
      throw new Error(`PatientProfile component failed to load: ${error.message}`);
    })
);

const LazyPatientBills = lazy(() =>
  import('@/components/patient/PatientBills')
    .catch(error => {
      console.error('Failed to load PatientBills chunk:', error);
      throw new Error(`PatientBills component failed to load: ${error.message}`);
    })
);

// Doctor and admin dashboard components
const LazyDoctorDashboard = lazy(() =>
  import('@/components/doctor/DoctorDashboard')
    .catch(error => {
      console.error('Failed to load DoctorDashboard chunk:', error);
      throw new Error(`DoctorDashboard component failed to load: ${error.message}`);
    })
);
const LazyDoctorDashboardLayout = lazy(() =>
  import('@/components/doctor/DoctorDashboard_Layout')
    .catch(error => {
      console.error('Failed to load DoctorDashboard chunk:', error);
      throw new Error(`DoctorDashboard component failed to load: ${error.message}`);
    })
);

export const LazyDoctorAppointments = lazy(() => import('@/components/doctor/DoctorAppointments'));
export const LazyDoctorAvailability = lazy(() => import('@/components/doctor/DoctorAvailability'));
export const LazyDoctorPatients = lazy(() => import('@/components/doctor/DoctorPatients'));
export const LazyDoctorProfile = lazy(() => import('@/components/doctor/DoctorProfile'));

const LazyHospitalAdminDashboard = lazy(() =>
  import('@/pages/HospitalAdminDashboard')
    .catch(error => {
      console.error('Failed to load HospitalAdminDashboard chunk:', error);
      throw new Error(`HospitalAdminDashboard component failed to load: ${error.message}`);
    })
);

interface LazyPageWrapperProps {
  children: React.ReactNode;
  featureName: string;
}

// lazy-loaded pages with error boundaries
export function LazyPageWrapper({ children, featureName }: LazyPageWrapperProps) {
  return (
    <FeatureErrorBoundary featureName={featureName}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <LoadingSpinner size="lg" text={`Loading ${featureName}...`} />
          </div>
        }
      >
        {children}
      </Suspense>
    </FeatureErrorBoundary>
  );
}

// Optimized lazy-loaded dashboard components
export const PatientDashboardPage = React.memo(() => (
  <LazyPageWrapper featureName="Patient Dashboard">
    <LazyPatientDashboard />
  </LazyPageWrapper>
));
export const PatientDashboardLayout = React.memo(() => (
  <LazyPageWrapper featureName="Patient Dashboard">
    <LazyPatientDashboardLayout />
  </LazyPageWrapper>
));

export const PatientHealthRecords = React.memo(() => (
  <LazyPageWrapper featureName="Patient Health Records">
    <LazyPatientHealthRecords />
  </LazyPageWrapper>
));

export const AvailableDoctors = React.memo(() => (
  <LazyPageWrapper featureName="Available Doctors">
    <LazyAvailableDoctors />
  </LazyPageWrapper>
));

export const PatientBills = React.memo(() => (
  <LazyPageWrapper featureName="Patient Bills & Payments">
    <LazyPatientBills />
  </LazyPageWrapper>
));
export const PatientProfile = React.memo(() => (
  <LazyPageWrapper featureName="Patient Profile">
    <LazyPatientProfile />
  </LazyPageWrapper>
));

// Doctor Dashboard Components
export const DoctorDashboardPage = React.memo(() => (
  <LazyPageWrapper featureName='Doctor Dashboard'>
    <LazyDoctorDashboard />
  </LazyPageWrapper>
))

export const DoctorDashboardLayoutPage = React.memo(() => (
  <LazyPageWrapper featureName='Doctor Dashboard'>
    <LazyDoctorDashboardLayout />
  </LazyPageWrapper>
))
export const DoctorDashboard = React.memo(() => (
  <LazyPageWrapper featureName='Doctor Dashboard'>
    <LazyDoctorDashboard />
  </LazyPageWrapper>
))
export const DoctorAppointments = React.memo(() => (
  <LazyPageWrapper featureName='Doctor Appointments'>
    <LazyDoctorAppointments />
  </LazyPageWrapper>
))
export const DoctorAvailability = React.memo(() => (
  <LazyPageWrapper featureName='Doctor Availability'>
    <LazyDoctorAvailability />
  </LazyPageWrapper>
))
export const DoctorPatients = React.memo(() => (
  <LazyPageWrapper featureName='Doctor Patients'>
    <LazyDoctorPatients />
  </LazyPageWrapper>
))
export const DoctorProfile = React.memo(() => (
  <LazyPageWrapper featureName='Doctor Profile'>
    <LazyDoctorProfile />
  </LazyPageWrapper>
))


export const HospitalAdminDashboardPage = React.memo(() => (
  <LazyPageWrapper featureName='Hospital Admin Dashboard'>
    <LazyHospitalAdminDashboard />
  </LazyPageWrapper>
))

