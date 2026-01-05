import { useMedicalRecordStore } from "@/stores/medicalRecordStore";
import { usePatientDataStore } from "@/stores/patientDataStore";
import { useQuery } from "@tanstack/react-query";

export function usePatientQuery() {
  const { 
    appointments,
    fetchStat, 
    fetchAppointments, 
    fetchDoctors
  } = usePatientDataStore();
  
  return   {
    statQuery: useQuery({
      queryKey: ["profileStat"],
      queryFn: () => fetchStat(),
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }),
    appointmentsQuery: useQuery({
      queryKey: ["appointments"],
      queryFn: () => fetchAppointments(),
      staleTime: 5 * 60 * 1000,
      retry: 1,
      enabled: !appointments || appointments.length === 0,
    }),
    
    doctorsQuery: useQuery({
      queryKey: ["doctors"],
      queryFn: () => fetchDoctors(),

    }),
    medicalRecordHistoryQuery: useQuery({
      queryKey: ["medicalRecordHistory"],
      queryFn: () => useMedicalRecordStore.getState().fetchMedicalRecords(),
      staleTime: 15 * 60 * 1000,
      retry: 1,
    }),
  };
}

