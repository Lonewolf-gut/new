import { api } from "@/lib/api";
import type { Appointment, Doctor, PatientStat, Slot } from "@/types/interfaces";
import { create } from "zustand";

type PatientDataStore = {
  stat: PatientStat;
  appointments: Appointment[];
  doctors: Doctor[] | null;
  slots: Slot[];
  fees: {
    consultationFee: number;
    platformFee: number;
  }
  fetchDoctors: () => Promise<Doctor[] | undefined>;
  fetchAppointments: () => Promise<Appointment[]>;
  fetchStat: () => Promise<PatientStat | undefined>;
  fetchSlots: (query?: { speciality?: string; date?: string }) => Promise<Slot[] | undefined>;
};

export const usePatientDataStore = create<PatientDataStore>((set) => ({
  stat: {
    totalAppointments: 0,
    upcomingAppointments: 0,
    activePrescriptions: 0,
    recordedVitals: 0
  },
  fees: {
    consultationFee: 0,
    platformFee: 0
  },
  slots: [],
  appointments: [],
  doctors: null,

  fetchDoctors: async () => {
    try {
      const response = await api.doctors.getApprovedDoctors({ page: 1, limit: 15});
      const data = response.data?.data || response.data;
      const doctors = data.doctors || data || [];
      set(() => ({ doctors: Array.isArray(doctors) ? doctors : [] }));
      return Array.isArray(doctors) ? doctors : [];
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // Return empty array on error to prevent undefined
      set(() => ({ doctors: [] }));
      return [];
    }
  },

  fetchSlots: async (query?: { speciality?: string; date?: string }) => {
    try {
      const response = await api.slots.getAvailableDoctorsSlots(query);
      const data = response.data;
      set(() => ({ slots: data.slots, fees: data.fees }));
      return data.slots;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },

  fetchAppointments: async () => {
    try {
      const response = await api.appointments.getAll({ page: 1, limit: 15 });
      const data = response.data;

      // Handle both wrapped and unwrapped responses
      const appointments = data.appointments || data.data?.appointments || data || [];
      
      // Ensure appointments is always an array
      const appointmentsArray = Array.isArray(appointments) ? appointments : [];
      
      set(() => ({ appointments: appointmentsArray }));
      return appointmentsArray;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Set empty array on error to prevent undefined
      set(() => ({ appointments: [] }));
      return [];
    }
  },
 
  fetchStat: async () => {
    try {
      const response = await api.profiles.patientStat();
      const data = response.data;
      set(() => ({ stat: { ...data } }));
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
}));
