import { api } from '@/lib/api';
import { create } from 'zustand';
import { useUserStore } from './userStore';
import type { MedicalFile, MedicalCondition, Vital, Prescription } from '@/types/interfaces';

interface MedicalRecordStore {
    medicalFiles: MedicalFile[];
    medicalConditions: MedicalCondition[];
    vitals: Partial<Vital>[];
    prescriptions: Partial<Prescription>[];
    fetchMedicalRecords: () => Promise<{
        medicalFiles: MedicalFile[];
        medicalConditions: MedicalCondition[];
        vitals: Partial<Vital>[];
    }>;
    addMedicalFile: (file: Partial<MedicalFile>) => void;
    updateMedicalCondition: (condition: MedicalCondition) => void;
    addVital: (vital: Partial<Vital>) => void;   
}   

export const useMedicalRecordStore = create<MedicalRecordStore>((set) => ({
    medicalFiles: [],
    medicalConditions: [],
    vitals: [],
    prescriptions: [],
    fetchMedicalRecords: async () => {
        try {
            const patientId = useUserStore.getState().user?.id;
            if (!patientId) {
                // Return empty data if no patient ID
                const emptyData = { medicalFiles: [], medicalConditions: [], vitals: [] };
                set(emptyData);
                return emptyData;
            }
            
            const response = await api.patients.getMedicalHistory(patientId);
            const responseData = response.data?.data || response.data;
            const medicalFiles = responseData?.medicalFiles || [];
            const medicalConditions = responseData?.medicalConditions || [];
            const vitals = responseData?.vitals || [];
            
            const data = {
                medicalFiles: Array.isArray(medicalFiles) ? medicalFiles : [],
                medicalConditions: Array.isArray(medicalConditions) ? medicalConditions : [],
                vitals: Array.isArray(vitals) ? vitals : [],
            };
            
            set(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch medical records:', error);
            // Return empty data on error to prevent undefined
            const emptyData = { medicalFiles: [], medicalConditions: [], vitals: [] };
            set(emptyData);
            return emptyData;
        }
    },
    addMedicalFile: (file: Partial<MedicalFile>) =>
        set((state) => ({ medicalFiles: [...state.medicalFiles, {
            title: file.title || 'Untitled',
            id: file.id || Date.now().toString(),
            url: file.url || '',
            fileType: file.fileType || 'unknown',
            createdAt: file.createdAt || new Date().toISOString(),
            updatedAt: file.updatedAt || new Date().toISOString(),
            notes: file.notes || '',
            profileId: useUserStore.getState().user?.id || '',
        }] })),

    updateMedicalCondition: (condition) =>
        set((state) => ({
            medicalConditions: state.medicalConditions.map((c) =>
                c.id === condition.id ? condition : c
            ),
        })),
    addVital: (vital: Partial<Vital>) =>
        set((state) => ({ vitals: [...state.vitals, vital] })),
}));