import { api } from "@/lib/api";
import type { DoctorPatient, DoctorStat, TimeSlot } from "@/types/interfaces";
import { create } from "zustand";
import type { Appointment } from "@/types/interfaces";

type DoctorDataStore = {
  stat: DoctorStat;
  appointments: Appointment[] | null;
  slots: TimeSlot[];
  patients: DoctorPatient[] | null;
  fetchStat: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  fetchSlots: () => Promise<void>;
  fetchPatients: () => Promise<void>;
  addSlot: (slotData: {
    date: string;      // UTC date
    startTime: string;   // UTC datetime
    endTime: string;     // UTC datetime
    duration: number;
  }) => Promise<void>;
  removeSlot: (slotId: string) => Promise<void>;
};

export const useDoctorDataStore = create<DoctorDataStore>((set) => ({
  stat: {
    todaysAppointmentsCount: 0,
    weeklyAppointmentsCount: 0,
    uniquePatientsToday: 0,
    completedToday: 0,
    performance: {
      totalAppointments: 0,
      completionRate: 0,
      totalCompleted: 0,
      cancellationRate: 0,
        totalCancelled: 0,
      prescriptionsIssued: 0,
    },
    chartData: [
      { day: "Sun", appointments: 0 },
      { day: "Mon", appointments: 0 },
      { day: "Tue", appointments: 0 },
      { day: "Wed", appointments: 0 },
      { day: "Thu", appointments: 0 },
      { day: "Fri", appointments: 0 },
      { day: "Sat", appointments: 0 },
    ],
  },
  appointments: null,
  patients: null,
  fetchStat: async () => {
    try {
      const response = await api.profiles.doctorStat();
      const data = response.data;
      set(() => ({ stat: { ...data } }));
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  fetchAppointments: async () => {
    try {
      const response = await api.appointments.getAll();
      const data = response.data.appointments;
      set(() => ({ appointments: data }));
      return data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  },
  slots: [],
  fetchSlots: async () => {
    try {
      const response = await api.slots.getAll();
      const data = response.data.slots;
      
      const processedSlots = data.map((slot: TimeSlot) => ({
        ...slot,
        date: new Date(slot.date),
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
      }));
      
      set(() => ({ slots: processedSlots }));
      return processedSlots;
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  },
  addSlot: async (slotData) => {
    try {
      const response = await api.slots.create(slotData);
      const newSlot = response.data.slot;
      
      const processedSlot = {
        ...newSlot,
        date: new Date(newSlot.date),
        startTime: new Date(newSlot.startTime),
        endTime: new Date(newSlot.endTime),
      };
      
      set((state) => ({
        slots: [...state.slots, processedSlot]
      }));
    } catch (error) {
      console.error("Error adding slot:", error);
      throw error;
    }
  },

  removeSlot: async (slotId: string) => {
    try {
      await api.slots.delete(slotId);
      
      set((state) => ({
        slots: state.slots.filter(slot => slot.id !== slotId)
      }));
    } catch (error) {
      console.error("Error removing slot:", error);
      throw error;
    }
  },
  fetchPatients: async () => {
    try {
      const response = await api.patients.getAll();
      console.log(response);
      const data = response.data.patients;
      set(() => ({ patients: data }));
      return data;
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }
}));