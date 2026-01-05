import { useDoctorDataStore } from "@/stores/doctorDataStore";
import { useQuery } from "@tanstack/react-query";

export function useDoctorQuery() {
  const { 
    fetchStat,
    fetchAppointments ,
    fetchSlots,
    fetchPatients,
  } = useDoctorDataStore();
  
  return   {
    stat: useQuery({
      queryKey: ["profileStat"],
      queryFn: () => fetchStat(),
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }),
    appointments: useQuery({
      queryKey: ["appointments"],
      queryFn: () => fetchAppointments(),
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }),
    slots: useQuery({ 
      queryKey: ["doctorSlots"],
      queryFn: () => fetchSlots(),
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }),
    patients: useQuery({
      queryKey: ["doctorPatients"],
      queryFn: () => fetchPatients(),
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }),
  };
}

