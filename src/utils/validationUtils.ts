import { FILE_UPLOAD, VALIDATION_MESSAGES } from './constants';

/**
 * Email validation using regex
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email.trim()) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: VALIDATION_MESSAGES.INVALID_EMAIL };
  }

  return { isValid: true };
};

/**
 * Ghana phone number validation
 */
export const validatePhoneNumber = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone.trim()) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }

  // Ghana phone number format: +233XXXXXXXXX or 0XXXXXXXXX
  const ghanaPhoneRegex = /^(\+233|0)[0-9]{9}$/;
  if (!ghanaPhoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, message: VALIDATION_MESSAGES.INVALID_PHONE };
  }

  return { isValid: true };
};

/**
 * Password strength validation
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string; strength?: 'weak' | 'medium' | 'strong' } => {
  if (!password) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }

  if (password.length < 8) {
    return { isValid: false, message: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT };
  }

  // Check password strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (strengthScore >= 3) strength = 'strong';
  else if (strengthScore >= 2) strength = 'medium';

  return { isValid: true, strength };
};

/**
 * File upload validation
 */
export const validateFile = (file: File): { isValid: boolean; message?: string } => {
  if (!file) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }

  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return { isValid: false, message: VALIDATION_MESSAGES.FILE_TOO_LARGE };
  }

  // Check file type
  const allowedTypes: string[] = [...FILE_UPLOAD.ALLOWED_TYPES];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: VALIDATION_MESSAGES.INVALID_FILE_TYPE };
  }

  return { isValid: true };
};

export const validateRequired = (value: any, fieldName?: string): { isValid: boolean; message?: string } => {
  const isEmpty = value === null || value === undefined || 
    (typeof value === 'string' && !value.trim()) ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) {
    return { 
      isValid: false, 
      message: fieldName ? `${fieldName} is required` : VALIDATION_MESSAGES.REQUIRED_FIELD 
    };
  }

  return { isValid: true };
};

/**
 * Date validation for appointments
 */
export const validateAppointmentDate = (date: Date): { isValid: boolean; message?: string } => {
  const now = new Date();
  const minDate = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now

  if (date < minDate) {
    return { 
      isValid: false, 
      message: 'Appointment must be at least 30 minutes from now' 
    };
  }

  const maxDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
  if (date > maxDate) {
    return { 
      isValid: false, 
      message: 'Appointment cannot be more than 90 days in the future' 
    };
  }

  return { isValid: true };
};

/**
 * Medical license number validation (Ghana format)
 */
export const validateMedicalLicense = (license: string): { isValid: boolean; message?: string } => {
  if (!license.trim()) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }

  // Ghana Medical and Dental Council license format: MDS/XXXX
  const licenseRegex = /^(MDS|MDC)\/\d{4,6}$/i;
  if (!licenseRegex.test(license)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid Ghana Medical Council license number (e.g., MDS/1234)' 
    };
  }

  return { isValid: true };
};

/**
 * Hospital registration number validation
 */
export const validateHospitalRegistration = (regNumber: string): { isValid: boolean; message?: string } => {
  if (!regNumber.trim()) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }

  // Basic format validation - adjust based on Ghana's hospital registration format
  const regRegex = /^[A-Z]{2,4}\/\d{4,8}$/i;
  if (!regRegex.test(regNumber)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid hospital registration number' 
    };
  }

  return { isValid: true };
};

/**
 * Age validation for patients
 */
export const validateAge = (birthDate: Date): { isValid: boolean; message?: string; age?: number } => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 0) {
    return { isValid: false, message: 'Birth date cannot be in the future' };
  }

  if (age > 120) {
    return { isValid: false, message: 'Please enter a valid birth date' };
  }

  return { isValid: true, age };
};

/**
 * Batch validation for forms
 */
export const validateForm = (
  data: Record<string, any>, 
  rules: Record<string, Array<(value: any) => { isValid: boolean; message?: string }>>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const [field, validators] of Object.entries(rules)) {
    const value = data[field];
    
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        errors[field] = result.message || 'Invalid value';
        break; 
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .trim()
    .substring(0, 1000); // Limit length
};
