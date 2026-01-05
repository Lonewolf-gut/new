import { Route, Routes } from "react-router";
import {
  LazyDoctorAppointments,
  LazyDoctorAvailability,
  LazyDoctorDashboardLayoutPage,
  LazyDoctorDashboardPage,
  LazyDoctorPatients,
  LazyDoctorProfile,
  withSuspense,
} from "@/components/lazy/LazyComponents";

export const DoctorRoutes = () => {
  const SuspenseDoctorDashboardLayout = withSuspense(
    LazyDoctorDashboardLayoutPage
  );
  const SuspenseDoctorDashboard = withSuspense(LazyDoctorDashboardPage);
  const SuspenseDoctorProfile = withSuspense(LazyDoctorProfile);
  const SuspenseDoctorAppointments = withSuspense(LazyDoctorAppointments);
  const SuspenseDoctorAvailability = withSuspense(LazyDoctorAvailability);
  const SuspenseDoctorPatients = withSuspense(LazyDoctorPatients);
  return (
    <Routes>
      <Route path="/" element={<SuspenseDoctorDashboardLayout />}>
        <Route path="/dashboard" element={<SuspenseDoctorDashboard />} index />
        <Route path="/appointments" element={<SuspenseDoctorAppointments />} />
        <Route path="/availability" element={<SuspenseDoctorAvailability />} />
        <Route path="/patients" element={<SuspenseDoctorPatients />} />
        <Route path="/profile" element={<SuspenseDoctorProfile />} />
      </Route>
    </Routes>
  );
};
