export type UserRole = "PATIENT" | "DOCTOR" | "HOSPITAL_ADMIN";

export type PatientStat = {
  totalAppointments: number;
  upcomingAppointments: number;
  activePrescriptions: number;
  recordedVitals: number;
};

export type DoctorStat = {
  todaysAppointmentsCount: number;
  weeklyAppointmentsCount: number;
  uniquePatientsToday: number;
  completedToday: number;
  performance: {
    totalAppointments: number;
    completionRate: number;
    cancellationRate: number;
    totalCompleted: number;
    totalCancelled: number;
    prescriptionsIssued: number;
  };
  chartData: {
    day: string;
    appointments: number;
  }[];
};

export interface DoctorPatient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hospital: string;
    profilePicture: string;
    lastAppointment: string;
    isActive: boolean;
    totalAppointments: number;
    status: boolean
    dateOfBirth: Date;
    age: number;
    createdAt: string;
}
export interface DoctorPatientProfileResponse {
  profile: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    profilePicture?: string;
    createdAt: string;
    isActive: boolean;
    email: string;
    hospital: {
      id: string;
      name: string;
    } | null;
    age: number | null;
  };
  medicalConditions: {
    id?: string;
    chronicConditions: string[];
    allergies: string[];
    createdAt?: string;
    updatedAt?: string;
  };
  currentSymptoms: Array<{
    id: string;
    title: string;
    timestamp: string;
  }>;
 
  prescriptions: Prescription[];
  vitals: Vital[];
  legacyNotes: LegacyNotes[];
  appointmentStats: {
    totalAppointments: number;
    lastAppointment: string | null;
  };
}
export interface TimeSlot {
  date: Date;
  time: String;
  startTime: Date;
  endTime: Date;
  duration: string;
  isBooked: boolean;
  id: string;
}
export type Slot = {
  doctor: Partial<Doctor>;
  timeSlots: TimeSlot[];
};

export interface MedicalFile {
  id: string;
  url: string;
  title: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface MedicalCondition {
  id: string;
  chronicConditions: string[];
  allergies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vital {
  id: string;
  profileId: string;
  heartRate?: number;
  temperature?: number;
  bloodSugar?: number;
  bloodPressure?: string;
  weight?: number;
  height?: number;
  symptoms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegacyNotes{
  id: string;
  profileId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  role: string;
  lastName: string;
  email?: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  profilePicture?: string;
  country: string;
  isActive: boolean;
  isApproved: boolean;
  approvalStatus: string;
  hospitalId?: string;
  specialty?: string;
  licenseNumber?: string;
  bio?: string;
  identificationNumber?: string;
  hospital: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phoneNumber: string;
    email: string;
    isApproved: boolean;
  } | null;
}

export interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  specialty?: string;
  licenseNumber?: string;
  bio?: string;
  hospitalId?: string;
  hospital: {
    id: string;
    name: string;
    address?: string;
  };
  ratingCount: number;
  approvalStatus?: string;
  isApproved?: boolean;
  averageRating?: number;
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  appointmentDate: Date;
  duration: number; // in minutes
  status: "PENDING" | "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  consultationType: string;
  meetingLink?: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    profilePicture?: string;
  };
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  issuedAt: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  appointment?: Appointment;
}

export interface Hospital {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state: string;
  region?: string;
  country: string;
  website?: string;
  registration_number?: string;
  license_number?: string;
  logo_url?: string;
  is_approved: boolean;
  is_active: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DoctorRating {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  rating: number;
  communication_rating?: number;
  professionalism_rating?: number;
  punctuality_rating?: number;
  overall_satisfaction?: number;
  review_text?: string;
  comment?: string;
  would_recommend: boolean;
  anonymous: boolean;
  is_verified: boolean;
  helpful_count: number;
  flagged_inappropriate: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentDetails {
  id: string;
  appointment_id?: string;
  patient_id: string;
  consultation_fee: number;
  platform_fee: number;
  total_amount: number;
  currency: string;
  payment_status: "pending" | "completed" | "failed" | "refunded";
  payment_method?: string;
  payment_reference?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "AUDIO";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  threadId?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentProvider = "PAY_STACK";
export type PAYMENT_TYPE = "CREDIT" | "DEBIT";
export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PAYMENT_TYPE;
  provider: PaymentProvider;
  transactionId: string;
  platformFee: number;
  doctorAmount: number;
  paymentDate: string;
  isVerified: boolean;
  metadata?: Record<string, any>;
  paymentDetails?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
export interface Review {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_id?: string;
  rating: number;
  review_text?: string;
  status: "pending" | "approved" | "rejected" | "edited";
  moderated_by?: string;
  moderated_at?: string;
  moderation_notes?: string;
  edited_by?: string;
  edited_at?: string;
  original_rating?: number;
  original_text?: string;
  is_anonymous: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  doctor_profile?: {
    first_name: string;
    last_name: string;
    specialty: string;
  };
  patient_profile?: {
    first_name: string;
    last_name: string;
  };
}
