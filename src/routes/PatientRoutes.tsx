import React from 'react';
import { Route, Routes } from 'react-router';
import { LazyAvailableDoctors, LazyPatientDashboardLayout, LazyPatientDashboardPage, LazyPatientHealthRecords, LazyPatientProfile, LazyPatientBills, withSuspense } from '@/components/lazy/LazyComponents';

interface PatientRoutesProps {
  fallback?: React.ReactNode;
}

export const PatientRoutes: React.FC<PatientRoutesProps> = () => {
  const SuspensePatientDashboard = withSuspense(LazyPatientDashboardPage);
  const SuspensePatientDashboardLayout = withSuspense(LazyPatientDashboardLayout);
  const SuspensePatientHealthRecords = withSuspense(LazyPatientHealthRecords);
  const SuspenseAvailableDoctors = withSuspense(LazyAvailableDoctors);
  const SuspensePatientProfile = withSuspense(LazyPatientProfile);
  const SuspensePatientSubscriptions = withSuspense(LazyPatientBills);
  return (
    <Routes>
      <Route
        path="/"
        element={<SuspensePatientDashboardLayout />}
      >
        <Route index element={<SuspensePatientDashboard />} />
        <Route path={"dashboard"} element={<SuspensePatientDashboard />} />
        <Route path={"doctors"} element={<SuspenseAvailableDoctors />} />
        <Route path={"health-records"} element={<SuspensePatientHealthRecords />} />
        <Route path={"bills"} element={<SuspensePatientSubscriptions />} />
        <Route path={"profile"} element={<SuspensePatientProfile />} />
        <Route path={"feedback"} element={<></>} />
      </Route>

    </Routes>
  );
};