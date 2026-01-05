// Security utilities for input validation and sanitization

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: string;
}

// Email validation with enhanced security
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const sanitized = email.trim().toLowerCase();
  
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(sanitized)) {
    errors.push('Invalid email format');
  }
  
  // Length checks
  if (sanitized.length > 254) {
    errors.push('Email too long');
  }
  
  // Check for dangerous characters
  const dangerousChars = /[<>"';&|`$(){}[\]\\]/;
  if (dangerousChars.test(sanitized)) {
    errors.push('Email contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined
  };
}

// Phone number validation and sanitization
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];
  const sanitized = phone.replace(/[^\d+\-\s()]/g, '');
  
  // Remove all non-digit characters for length check
  const digitsOnly = sanitized.replace(/\D/g, '');
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    errors.push('Phone number must be between 10-15 digits');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined
  };
}

// Name validation (prevents XSS and injection)
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];
  const sanitized = name.trim().replace(/\s+/g, ' ');
  
  // Check length
  if (sanitized.length < 1) {
    errors.push('Name cannot be empty');
  }
  
  if (sanitized.length > 100) {
    errors.push('Name too long');
  }
  
  // Check for dangerous characters (allow basic punctuation)
  const allowedChars = /^[a-zA-Z\s\-'.,]+$/;
  if (!allowedChars.test(sanitized)) {
    errors.push('Name contains invalid characters');
  }
  
  // Check for script injection patterns
  const scriptPatterns = /(script|javascript|vbscript|onload|onerror|onclick)/i;
  if (scriptPatterns.test(sanitized)) {
    errors.push('Name contains suspicious content');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined
  };
}

// Generic text validation (for descriptions, notes, etc.)
export function validateText(text: string, maxLength: number = 1000): ValidationResult {
  const errors: string[] = [];
  const sanitized = text.trim();
  
  if (sanitized.length > maxLength) {
    errors.push(`Text too long (max ${maxLength} characters)`);
  }
  
  // Check for script injection patterns
  const scriptPatterns = /<script|javascript:|vbscript:|on\w+\s*=/i;
  if (scriptPatterns.test(sanitized)) {
    errors.push('Text contains potentially dangerous content');
  }
  
  // Remove or escape HTML tags for security
  const cleanText = sanitized.replace(/<[^>]*>/g, '');
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? cleanText : undefined
  };
}

// License number validation
export function validateLicenseNumber(license: string): ValidationResult {
  const errors: string[] = [];
  const sanitized = license.trim().toUpperCase();
  
  if (sanitized.length < 3 || sanitized.length > 20) {
    errors.push('License number must be between 3-20 characters');
  }
  
  // Allow only alphanumeric characters and common separators
  const validChars = /^[A-Z0-9\-_./]+$/;
  if (!validChars.test(sanitized)) {
    errors.push('License number contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined
  };
}

// Password strength validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password too long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common patterns
  const commonPatterns = [
    /(.)\1{3,}/, // Repeated characters
    /123456|654321|abcdef|qwerty/i, // Sequential patterns
    /password|admin|user|login/i // Common words
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common patterns');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: undefined // Never return sanitized password
  };
}
