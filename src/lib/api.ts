import type { MedicalFile, Vital } from "@/types/interfaces";
import { STORAGE_KEYS } from "@/utils/constants";
import axios, {type AxiosInstance, type AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log("🔧 API Configuration:", {
    baseURL: API_BASE_URL || "NOT SET - Please configure VITE_API_BASE_URL in .env",
    hasBaseURL: !!API_BASE_URL,
  });
  
  if (!API_BASE_URL) {
    console.error("❌ VITE_API_BASE_URL is not configured! Please set it in your .env file");
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("📤 API Request:", config.method?.toUpperCase(), fullUrl, "Token:", token.substring(0, 20) + "...");
    } else {
      console.log("📤 API Request:", config.method?.toUpperCase(), fullUrl, "NO TOKEN");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    }
    return response;
  },
  (error) => {
    console.error("API Error Response:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Authentication failed, removing token");
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject({ ...error, message: errorMessage });
  }
);

export const api = {
  // Auth endpoints
  auth: {
    // OTP endpoints (for patient signup)
    sendOtp: (data: { email?: string; phoneNumber?: string }) => 
      apiClient.post("/auth/send-otp", data),
    verifyOtp: (data: { email?: string; phoneNumber?: string; otp: string }) => 
      apiClient.post("/auth/verify-otp", data),
    // Signup endpoints
    signupPatient: (data: any) => apiClient.post("/auth/signup/patient", data),
    signupDoctor: (data:any) => apiClient.post("/auth/signup/doctor", data),
    signupHospitalAdmin: (data:any) =>
      apiClient.post("/auth/signup/hospital-admin", data),
    signupSuperAdmin: (data:any) =>
      apiClient.post("/auth/signup/super-admin", data),
    // Signin - supports both PIN (for patients) and password (for doctors/admins)
    signin: (data: { 
      email?: string; 
      phoneNumber?: string; 
      pin?: string; 
      password?: string;
    }) => apiClient.post("/auth/signin", data),
    // Super Admin signin - email + password + mandatory 2FA
    signinSuperAdmin: (data: {
      email: string;
      password: string;
      twoFactorCode: string;
    }) => apiClient.post("/auth/signin/super-admin", data),
    resetPassword: (data:any) => apiClient.post("/auth/reset-password", data),
    checkRegistrationStatus: (data:any) =>
      apiClient.post("/auth/check-registration-status", data),
     changePassword: (data:{
      currentPassword: string;
      newPassword: string;
    }) => apiClient.patch("/auth/change-password", data),
    signout: () => {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      window.location.href = "/auth";
    },
    googleSignIn: (data: { credential: string; role?: string }) => 
      apiClient.post("/auth/google", { idToken: data.credential, role: data.role || "PATIENT" }),
  },

  // Profile endpoints
  profiles: {
    get: () => apiClient.get(`/profiles/me`),
    patientStat: () => apiClient.get("/profiles/stat"),
    doctorStat: () => apiClient.get("/profiles/doctor/stat"),
    updateProfile: (data:any) => apiClient.put("/profiles/update", data),
  },

  // Hospital endpoints
  hospitals: {
    create: (data:any) => apiClient.post("/hospitals", data),
    approve: (id: string) => apiClient.put(`/hospitals/${id}/approve`),
    search: (query?: string) =>
      apiClient.get(`/hospitals/search?query=${query}`),
  },
  // doctors endpoints
  doctors: {
    getAvailability: (doctorId: string, params?: any) =>
      apiClient.get(`/doctors/${doctorId}/availability`, { params }),
    getAppointments: (doctorId: string, params?: any) =>
      apiClient.get(`/doctors/${doctorId}/appointments`, { params }),
    getById: (id: string) => apiClient.get(`/doctors/${id}`),
    getApprovedDoctors: (params?: any) =>
      apiClient.get("/doctors/approved", { params }),
  },

  // Patients endpoints
  patients: {
    getAll: (params?: any) => apiClient.get("/patients", { params }),
    getMedicalHistory: (patientId: string) => apiClient.get(`/patients/${patientId}/medical-history`),
   
    getDoctorProfile: (
      patientId: string,
    ) => apiClient.get(`/patients/${patientId}/doctor-profile`),

    updateMedicalConditions: (
      patientId: string,
      data: { chronicConditions: string[]; allergies: string[] }
    ) => apiClient.put(`/patients/${patientId}/medical-conditions`, data),
   
    createLegacyNote: (patientId: string, data: { notes: string }) =>
      apiClient.post(`/patients/${patientId}/legacy-notes`, data),
    addMedicalFile: (patientId: string, data:Partial<MedicalFile>) => apiClient.post(`/patients/${patientId}/medical-files/add`, data),
  },

  // Vitals endpoints
  vitals: {
    addVitals: (patientId: string, data:Partial<Vital>) => apiClient.post(`/vitals/${patientId}`, data),
  },

  // Rating endpoints
  ratings: {
    create: (data:any) => apiClient.post("/ratings", data),
    getAll: (params?: any) => apiClient.get("/ratings", { params }),
    getByDoctor: (doctorId: string, params?: any) =>
      apiClient.get(`/ratings/doctor/${doctorId}`, { params }),
    delete: (id: string) => apiClient.delete(`/ratings/${id}`),
  },

  // Appointments endpoints
  appointments: {
    get: (id: string) => apiClient.get(`/appointments/${id}`),
    getAll: (params?: any) => apiClient.get("/appointments", { params }),
    getStats: (params?: any) => apiClient.get("/appointments/stats", { params }),
    search: (params?: any) => apiClient.get("/appointments/search", { params }),
    getAvailability: (params?: any) =>
      apiClient.get("/appointments/availability", { params }),
    updateAppointmentStatus: (id: string, data: { status: string }) =>
      apiClient.put(`/appointments/${id}/status`, data),
  },

  // Slots endpoints
  slots: {
    getAll: () => apiClient.get("/slots", ),
    getAvailableDoctorsSlots: (query?: { speciality?: string; date?: string }) =>
      apiClient.get(`/slots/available-doctors`, { params: query }),
    create: async (slotData: {
    date: Date | string;
    startTime: Date | string;
    endTime: Date | string;
    duration: number;
  }) =>  await apiClient.post('/slots', slotData),
  delete: async (slotId: string) =>  await apiClient.delete(`/slots/${slotId}`),
  },

  // Prescriptions endpoints
  prescriptions: {
    create: (data:any) => apiClient.post("/prescriptions", data),
    get: (id: string) => apiClient.get(`/prescriptions/${id}`),
    getAll: (params?: any) => apiClient.get("/prescriptions", { params }),
  update: (id: string, data: Record<string, unknown>) => apiClient.put(`/prescriptions/${id}`, data),
    delete: (id: string) => apiClient.delete(`/prescriptions/${id}`),
    getByPatient: (patientId: string, params?: any) =>
      apiClient.get(`/prescriptions/patient/${patientId}`, { params }),
    getByDoctor: (doctorId: string, params?: any) =>
      apiClient.get(`/prescriptions/doctor/${doctorId}`, { params }),
    getActive: (params?: any) => apiClient.get("/prescriptions/active", { params }),
    search: (params?: any) => apiClient.get("/prescriptions/search", { params }),
  },
  
// Payments endpoints
    payments: {
    initialize: (data: {
      doctorId: string;
      slotId: string;
      symptoms?: string;
    }) => apiClient.post("/payments/initialize", data),
    verify: (reference: string) => apiClient.get(`/payments/verify/${reference}`),
    getBanks: () => apiClient.get("/payments/banks"),
    getHistory: (params?: {
      status?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
      page?: number;
      limit?: number;
    }) => apiClient.get("/payments/history", { params }),
  },
};

export default apiClient;
