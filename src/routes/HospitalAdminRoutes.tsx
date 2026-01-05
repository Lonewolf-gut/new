import React from 'react';
import { Route, Routes } from 'react-router';
import { LazyHospitalAdminDashboardPage, withSuspense } from '@/components/lazy/LazyComponents';

interface HospitalAdminRoutesProps {
    fallback?: React.ReactNode;
}

export const HospitalAdminRoutes: React.FC<HospitalAdminRoutesProps> = () => {
    const SuspenseHospitalAdminDashboard = withSuspense(LazyHospitalAdminDashboardPage);

    return (
        <Routes>
            <Route
                path="/dashboard"
                element={<SuspenseHospitalAdminDashboard />}
            />
            <Route
                path="/"
                element={<SuspenseHospitalAdminDashboard />}
            />
        </Routes>
    );
};