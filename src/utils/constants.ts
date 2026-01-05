
export const APPOINTMENT_DURATION_DEFAULT = 15;

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  PAYMENT: '/payment',
  ONBOARDING: '/onboarding',
  PATIENT: {
    DASHBOARD: '/patient/dashboard',
    DOCTORS: '/patient/doctors',
    HEALTHRECORDS: '/patient/health-records',
    BILLS: '/patient/bills',
    PROFILE: '/patient/profile',
    FEEDBACK: '/patient/feedback',
  },
  DOCTOR: {
    DASHBOARD: '/doctor/dashboard',
    APPOINTMENTS: '/doctor/appointments',
    AVAILABILITY: '/doctor/availability',
    PATIENTS: '/doctor/patients',
    PROFILE: '/doctor/profile',
  },
  ADMIN: '/admin/dashboard',
  HOSPITAL_ADMIN: '/hospital-admin/dashboard',
}
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  HOSPITAL_ADMIN: 'hospital_admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export const CONSULTATION_TYPES = {
  TELEMEDICINE: 'telemedicine',
  IN_PERSON: 'in_person',
  EMERGENCY: 'emergency',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;


export const AFFILIATION_TYPES = {
  INDEPENDENT: 'independent',
  AFFILIATE: 'affiliate',
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, 
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  FILE_TOO_LARGE: 'File size must be less than 2MB',
  INVALID_FILE_TYPE: 'Only JPEG and PNG files are allowed',
} as const;

export const SPECIALTIES = [
  'General Practice',
  'Internal Medicine',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Urology',
  'Emergency Medicine',
  'Family Medicine',
  'Obstetrics & Gynecology',
  'Ophthalmology',
  'Pathology',
  'Pulmonology',
] as const;

export const GHANAIAN_REGIONS = [
  'Greater Accra Region',
  'Ashanti Region',
  'Western Region',
  'Central Region',
  'Eastern Region',
  'Northern Region',
  'Upper East Region',
  'Upper West Region',
  'Volta Region',
  'Brong-Ahafo Region',
  'Western North Region',
  'Ahafo Region',
  'Bono Region',
  'Bono East Region',
  'North East Region',
  'Savannah Region',
  'Oti Region',
] as const;

export const GHANA_STATES = [
  'Accra',
  'Kumasi',
  'Tamale',
  'Sekondi-Takoradi',
  'Sunyani',
  'Cape Coast',
  'Koforidua',
  'Ho',
  'Wa',
  'Bolgatanga',
  'Tema',
  'Techiman',
  'Obuasi',
  'Teshie',
  'Madina',
  'Ashaiman',
  'Nungua',
  'Lashibi',
  'Dome',
  'Adenta',
  'Aflao',
  'Agona Swedru',
  'Asamankese',
  'Bawku',
  'Berekum',
  'Ejura',
  'Elmina',
  'Hohoe',
  'Kasoa',
  'Keta',
  'Kintampo',
  'Konongo',
  'Mampong',
  'Nkawkaw',
  'Nsawam',
  'Prestea',
  'Saltpond',
  'Tarkwa',
  'Wenchi',
  'Winneba',
  'Yendi'
]

export const API_ENDPOINTS = {
  APPOINTMENTS: '/appointments',
  USERS: '/users',
  HOSPITALS: '/hospitals',
  RATINGS: '/ratings',
  PAYMENTS: '/payments',
  NOTIFICATIONS: '/notifications',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

export const SUCCESS_MESSAGES = {
  APPOINTMENT_BOOKED: 'Appointment booked successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
} as const;

export const TIME_FORMATS = {
  DATE_DISPLAY: 'PPP', // January 1, 2023
  DATETIME_DISPLAY: 'PPP p', // January 1, 2023 at 12:00 PM
  TIME_DISPLAY: 'p', // 12:00 PM
  ISO_DATE: 'yyyy-MM-dd',
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  LARGE_PAGE_SIZE: 50,
} as const;