import { memo, useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { RoleSelectionStep } from "./steps/RoleSelectionStep"
import { AuthenticationStep } from "./steps/AuthenticationStep"
import { OtpVerificationStep } from "./steps/OtpVerificationStep"
import { PersonalInfoFields } from "./steps/PersonalInfoFields"
import { DocumentUploadStep } from "./steps/DocumentUploadStep"
import { HospitalDetailsStep } from "./steps/HospitalDetailsStep"
import { WelcomeStep } from "./steps/WelcomeStep"
import { ProgressIndicator } from "./ProgressIndicator"
import { api } from "@/lib/api"
import { ProfessionalDetailsStep } from "./steps/ProfessionalDetailsStep"
import { format } from "date-fns"
import { HospitalAffiliation } from "./steps/HospitalAffliation"
import type { Hospital } from "@/types/interfaces"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { STORAGE_KEYS } from "@/utils/constants"
import LoaderIcon from "@/components/LoaderIcon"
import { useUserStore } from "@/stores/userStore"
import { useNavigate } from "react-router"
import { ROUTES } from "@/utils/constants"
import type { UserRole } from "@/types/interfaces"
export interface FormData {
  email: string
  password: string
  confirmPassword: string
  pin: string
  confirmPin: string
  verificationToken: string
  role: "patient" | "doctor" | "hospital_admin" | "super_admin" | ""
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  country: string
  gender: string
  allergies: string[]
  medicalConditions: string[]
  nhisNumber: string
  identificationNumber?: string

  hospitalId?: string
  hospital?: Hospital
  specialty: string
  licenseNumber: string
  hospitalName: string
  hospitalEmail: string
  hospitalAddress: string
  hospitalState: string
  hospitalCountry: string
  hospitalPhone: string
  hospitalRegistrationNumber: string
  hospitalLicenseNumber: string
  uploadedDocuments: any[]
  bio?: string
}

interface ProgressiveOnboardingProps {
  onBack: () => void
  onSuccess: () => void
}

export const ProgressiveOnboarding = memo(({ onBack, onSuccess: _onSuccess }: ProgressiveOnboardingProps) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [authenticatedUser, _setAuthenticatedUser] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    pin: "",
    confirmPin: "",
    verificationToken: "",
    role: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    allergies: [],
    medicalConditions: [],
    nhisNumber: "",
    identificationNumber: "",
    hospitalId: "",
    specialty: "",
    licenseNumber: "",
    hospitalName: "",
    hospitalEmail: "",
    hospitalAddress: "",
    hospitalState: "",
    hospitalCountry: "",
    hospitalPhone: "",
    hospitalRegistrationNumber: "",
    hospitalLicenseNumber: "",
    uploadedDocuments: [],
  })


  const shouldFetchHospitals = formData.role === "doctor" || formData.role === "hospital_admin"
  const hospitals: Hospital[] = []
  const hospitalsLoading = false

  // Step definitions for new progressive disclosure flow
  const steps = useMemo(() => {
    const baseSteps: { id: string; title: string; subtitle: string; component: React.FC<any> }[] = [
      {
        id: "role-selection",
        title: "Choose Your Role",
        subtitle: "Tell us how you'll be using BawaHealth",
        component: RoleSelectionStep,
      },
      {
        id: "authentication",
        title: (formData.role === "patient" || formData.role === "doctor") ? "Verify Your Contact" : "Create Your Account",
        subtitle: (formData.role === "patient" || formData.role === "doctor") ? "We'll send you a verification code" : "Set up your login credentials",
        component: AuthenticationStep,
      },
    ]

    // Add OTP verification step for patients and doctors
    if (formData.role === "patient" || formData.role === "doctor") {
      baseSteps.push({
        id: "otp-verification",
        title: "Verify Your Code",
        subtitle: "Enter the verification code we sent you",
        component: OtpVerificationStep,
      })
    }

    baseSteps.push({
      id: "personal-info",
      title: "Personal Information",
      subtitle: "Help us get to know you better",
      component: PersonalInfoFields,
    })

    // Add role-specific steps BEFORE welcome
    if (formData.role === "hospital_admin") {
      baseSteps.push({
        id: "hospital-details",
        title: "Hospital Information",
        subtitle: "Tell us about your healthcare facility",
        component: HospitalDetailsStep,
      })
    }

    if (formData.role === "patient" || formData.role === "doctor") {
      baseSteps.push({
        id: "hospital-affiliation",
        title: "Hospital Affiliation",
        subtitle: "Do you have a preferred hospital?",
        component: HospitalAffiliation,
      })
    }

    if (formData.role === "doctor") {
      baseSteps.push({
        id: "professional-details",
        title: "Professional Details",
        subtitle: "Tell us about your healthcare facility",
        component: ProfessionalDetailsStep,
      })
    }

    if (formData.role === "doctor" || formData.role === "hospital_admin") {
      baseSteps.push({
        id: "document-upload",
        title: "Verification Documents",
        subtitle: "Upload required documents for verification",
        component: DocumentUploadStep,
      })
    }

    // Always end with welcome
    baseSteps.push({
      id: "welcome",
      title: "Welcome to BawaHealth!",
      subtitle: "You're all set to get started",
      component: WelcomeStep,
    })

    return baseSteps
  }, [formData.role])

  const isStepValid = useCallback(
    (stepIndex: number): boolean => {
      const step = steps[stepIndex]
      if (!step) return false

      switch (step.id) {
        case "role-selection":
          return !!formData.role

        case "authentication":
          if (formData.role === "patient" || formData.role === "doctor") {
            // For patients and doctors, phone/email is required (OTP flow)
            return !!(formData.email || formData.phone)
          } else {
            // For hospital admins, require password
            return !!(
              formData.email &&
              formData.password &&
              formData.confirmPassword &&
              formData.password === formData.confirmPassword
            )
          }

        case "otp-verification":
          // OTP verification is handled by the component itself
          return !!formData.verificationToken

        case "personal-info":
          const hasBasicInfo = !!(
            formData.firstName &&
            formData.lastName &&
            formData.phone &&
            formData.dateOfBirth &&
            formData.gender
          )
          // For patients, also require PIN
          if (formData.role === "patient") {
            return hasBasicInfo && !!formData.pin && formData.pin.length === 6 && formData.pin === formData.confirmPin
          }
          return hasBasicInfo

        case "hospital-details":
          return !!(
            formData.hospitalName &&
            formData.hospitalEmail &&
            formData.hospitalPhone &&
            formData.hospitalAddress &&
            formData.hospitalState &&
            formData.hospitalCountry &&
            formData.hospitalRegistrationNumber &&
            formData.hospitalLicenseNumber
          )

        case "document-upload":
          if (formData.role === "doctor" || formData.role === "hospital_admin") {
            return formData.uploadedDocuments && formData.uploadedDocuments.length > 0
          }
          return true

        default:
          return true
      }
    },
    [formData, steps],
  )

  const handleNext = async () => {
    const step = steps[currentStep]

    // Handle authentication step - send OTP for patients and doctors, check account for others
    if (step.id === "authentication") {
      if (formData.role === "patient" || formData.role === "doctor") {
        await handleSendOtp()
        return
      } else if (!authenticatedUser) {
        await handleCheckAccount()
        return
      }
    }

    // Check if this is the final step before welcome
    if (currentStep === steps.length - 2) {
      await handleCreateAccount()
    } else {
      if (step.id === "welcome") {
        // On the final welcome screen, navigate to dashboard using stored user data
        try {
          // Ensure token is in localStorage (should already be there after signup)
          const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
          if (!token) {
            showErrorToast("Authentication error", "Please sign in again")
            navigate("/auth")
            return
          }

          // Get the user from store (should be set during signup)
          const user = useUserStore.getState().user
          const tokenCheck = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
          console.log("Welcome step - navigating to dashboard:", {
            hasUser: !!user,
            userRole: user?.role,
            hasToken: !!tokenCheck,
            storeState: useUserStore.getState()
          });
          
          let role: UserRole | undefined
          
          if (user && user.role) {
            role = user.role as UserRole
          } else {
            // Fallback: try to get role from formData
            role = formData.role.toUpperCase() as UserRole
          }
          
          if (!role) {
            console.error("Failed to determine role", { user, formData: formData.role });
            showErrorToast("Failed to determine user role", "Please try again")
            navigate("/auth")
            return
          }

          // Navigate to role-specific dashboard
          let dashboardRoute: string | undefined
          
          if (role === "PATIENT") {
            dashboardRoute = ROUTES.PATIENT.DASHBOARD
          } else if (role === "DOCTOR") {
            dashboardRoute = ROUTES.DOCTOR.DASHBOARD
          } else if (role === "HOSPITAL_ADMIN") {
            dashboardRoute = ROUTES.HOSPITAL_ADMIN
          }
          
          console.log("Navigating to dashboard:", { role, dashboardRoute, hasUser: !!user, hasToken: !!tokenCheck });
          if (dashboardRoute) {
            // Use React Router navigate - the ProtectedRoute will handle authentication
            navigate(dashboardRoute)
          } else {
            console.error(`No dashboard route found for role: ${role}`)
            navigate("/auth")
          }
        } catch (error: any) {
          console.error("Error navigating to dashboard:", error)
          const errorMessage = error?.message || error?.response?.data?.message || "Failed to load dashboard"
          if (errorMessage.toLowerCase().includes("authentication") || errorMessage.toLowerCase().includes("token")) {
            showErrorToast("Authentication error", "Please sign in again")
          } else {
            showErrorToast("Failed to load dashboard", errorMessage)
          }
          navigate("/auth")
        }
        return
      }

      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    if (currentStep === 0) {
      onBack()
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0))
    }
  }

  const handleSendOtp = async () => {
    if (!formData.email && !formData.phone) {
      showErrorToast("Please enter your email or phone number")
      return
    }

    setLoading(true)
    try {
      const normalizedEmail = formData.email?.trim().toLowerCase()
      // Format phone number with country code if it doesn't start with +
      let phoneNumber = formData.phone?.trim()
      if (phoneNumber && !phoneNumber.startsWith("+")) {
        // Assume Ghana country code if not present
        phoneNumber = `+233${phoneNumber.replace(/^0/, "")}`
      }

      // Check registration status first
      if (normalizedEmail) {
        try {
          const statusCheck = await api.auth.checkRegistrationStatus({ email: normalizedEmail })
          if (statusCheck && statusCheck.data && !statusCheck.data.can_register) {
            if (statusCheck.data.status === "complete") {
              showErrorToast("This email is already registered. Please sign in instead.")
              setLoading(false)
              return
            } else if (statusCheck.data.status === "orphaned") {
              showErrorToast("This email has an incomplete registration. Please contact support to resolve this issue.")
              setLoading(false)
              return
            }
          }
        } catch (error) {
          console.error("Status check error:", error)
        }
      }

      // Send OTP - only include fields that have values
      const otpPayload: { email?: string; phoneNumber?: string } = {}
      
      if (normalizedEmail && normalizedEmail.length > 0) {
        otpPayload.email = normalizedEmail
      }
      
      if (phoneNumber && phoneNumber.length >= 6) {
        otpPayload.phoneNumber = phoneNumber
      }
      
      // Ensure at least one is provided
      if (!otpPayload.email && !otpPayload.phoneNumber) {
        showErrorToast("Validation error", "Please provide a valid email or phone number (at least 6 digits)")
        setLoading(false)
        return
      }
      
      console.log("Sending OTP request:", otpPayload)
      const response = await api.auth.sendOtp(otpPayload)

      console.log("OTP response:", response.data)
      
      // Determine which method was used (phone is prioritized)
      const responseData = response.data?.data || response.data
      const methodUsed = responseData?.method || (phoneNumber ? "phone" : "email")
      const contactInfo = phoneNumber || normalizedEmail || "your contact"
      
      // In development, show OTP in console
      if (responseData?.otp || response.data?.otp) {
        const otp = responseData?.otp || response.data?.otp
        console.log("🔐 OTP Code (dev mode):", otp)
        const methodText = methodUsed === "phone" ? "phone" : "email"
        showSuccessToast(
          "Verification code sent", 
          `Please check your ${methodText} (${contactInfo}). Dev OTP: ${otp}`
        )
      } else {
        const methodText = methodUsed === "phone" ? "phone" : "email"
        showSuccessToast(
          "Verification code sent", 
          `Please check your ${methodText} (${contactInfo})`
        )
      }
      
      // Move to OTP verification step
      setCurrentStep((prev) => prev + 1)
    } catch (error: any) {
      console.error("Send OTP error details:", {
        error,
        message: error?.message,
        code: error?.code,
        response: error?.response,
        responseData: error?.response?.data,
        config: error?.config,
        url: error?.config?.url,
        baseURL: error?.config?.baseURL,
      })
      
      // Extract validation errors from backend
      let errorMessage = "Failed to send verification code"
      
      if (error?.response?.data) {
        const responseData = error.response.data
        
        // Handle Zod validation errors (array of issues)
        if (responseData.issues && Array.isArray(responseData.issues)) {
          const validationErrors = responseData.issues.map((issue: any) => {
            const path = issue.path?.join('.') || 'field'
            return `${path}: ${issue.message}`
          }).join(', ')
          errorMessage = `Validation failed: ${validationErrors}`
        } 
        // Handle simple error message
        else if (responseData.message) {
          errorMessage = responseData.message
        }
        // Handle error object
        else if (responseData.error) {
          errorMessage = responseData.error
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      // Check for network errors
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'Not configured'
        showErrorToast(
          "Network Error", 
          `Cannot connect to backend API. Please check if the backend is running. API URL: ${apiUrl}`
        )
      } else if (error?.response?.status === 404) {
        showErrorToast(
          "Endpoint not found", 
          "The OTP endpoint was not found. Please check your API configuration."
        )
      } else if (error?.response?.status === 400) {
        // 400 Bad Request - validation error
        showErrorToast("Validation failed", errorMessage)
      } else if (error?.response?.status >= 500) {
        showErrorToast(
          "Server Error", 
          "The server encountered an error. Please try again later."
        )
      } else {
        showErrorToast("Failed to send code", errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerified = (verificationToken: string) => {
    setFormData((prev) => ({ ...prev, verificationToken }))
    // Move to next step (personal info)
    setCurrentStep((prev) => prev + 1)
  }

  const handleResendOtp = async () => {
    try {
      // Use the same normalization logic as handleSendOtp
      const normalizedEmail = formData.email?.trim().toLowerCase()
      let phoneNumber = formData.phone?.trim()
      
      // Format phone number the same way as when sending
      if (phoneNumber && !phoneNumber.startsWith("+")) {
        phoneNumber = `+233${phoneNumber.replace(/^0/, "")}`
      }
      
      const otpPayload: { email?: string; phoneNumber?: string } = {}
      
      // Only include email if it has a value
      if (normalizedEmail && normalizedEmail.length > 0) {
        otpPayload.email = normalizedEmail
      }
      
      // Only include phoneNumber if it has a value
      if (phoneNumber && phoneNumber.length >= 6) {
        otpPayload.phoneNumber = phoneNumber
      }
      
      // Ensure at least one is provided
      if (!otpPayload.email && !otpPayload.phoneNumber) {
        throw new Error("Please provide a valid email or phone number")
      }
      
      console.log("Resending OTP request:", otpPayload)
      const response = await api.auth.sendOtp(otpPayload)
      
      console.log("OTP resend response:", response.data)
      
      // In development, show OTP in console
      if (response.data?.data?.otp || response.data?.otp) {
        const otp = response.data?.data?.otp || response.data?.otp
        console.log("🔐 OTP Code (dev mode - resend):", otp)
      }
      
      // Success will be shown by OtpVerificationStep component
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      
      // Extract error message
      let errorMessage = "Failed to resend verification code"
      
      if (error?.response?.data) {
        const responseData = error.response.data
        
        if (responseData.issues && Array.isArray(responseData.issues)) {
          const validationErrors = responseData.issues.map((issue: any) => {
            const path = issue.path?.join('.') || 'field'
            return `${path}: ${issue.message}`
          }).join(', ')
          errorMessage = `Validation failed: ${validationErrors}`
        } else if (responseData.message) {
          errorMessage = responseData.message
        } else if (responseData.error) {
          errorMessage = responseData.error
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      // Re-throw so OtpVerificationStep can handle it
      throw new Error(errorMessage)
    }
  }

  // Helper to get normalized email and formatted phone for OTP verification
  const getOtpIdentifiers = () => {
    const normalizedEmail = formData.email?.trim().toLowerCase()
    let phoneNumber = formData.phone?.trim()
    
    // Format phone number the same way as when sending
    if (phoneNumber && !phoneNumber.startsWith("+")) {
      phoneNumber = `+233${phoneNumber.replace(/^0/, "")}`
    }
    
    return {
      email: normalizedEmail && normalizedEmail.length > 0 ? normalizedEmail : undefined,
      phoneNumber: phoneNumber && phoneNumber.length >= 6 ? phoneNumber : undefined,
    }
  }

  const handleCheckAccount = async () => {
    if (!formData.email || !formData.password) {
      showErrorToast("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const normalizedEmail = formData.email.trim().toLowerCase()

      try {
        const statusCheck = await api.auth.checkRegistrationStatus({ email: normalizedEmail })

        if (statusCheck && statusCheck.data && !statusCheck.data.can_register) {
          if (statusCheck.data.status === "complete") {
            showErrorToast("This email is already registered. Please sign in instead.")
            return
          } else if (statusCheck.data.status === "orphaned") {
            showErrorToast("This email has an incomplete registration. Please contact support to resolve this issue.")
            return
          }
        }
      } catch (error) {
        console.error("Status check error:", error)
      }

      setCurrentStep((prev) => prev + 1)
    } catch (error: any) {
      showErrorToast(error.message || "Failed to create account", "Please try again or contact support if the problem persists.",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    setLoading(true)
    try {
      // For non-patients, validate password
      if (formData.role !== "patient") {
        // Basic client-side guard to match backend validation (min 8 chars)
        if (!formData.password || formData.password.length < 8) {
          showErrorToast(
            "Password is too short",
            "Please use at least 8 characters for your password."
          )
          setLoading(false)
          return
        }
      }

      // Backend requires non-empty location fields like state/city/country.
      // In the current UI, the "State" dropdown actually writes into `city`,
      // so treat either `state` or `city` as satisfying this requirement.
      const hasRegion =
        (formData.state && formData.state.trim().length > 0) ||
        (formData.city && formData.city.trim().length > 0)

      if (!hasRegion) {
        showErrorToast(
          "State/Region is required",
          "Please select or enter your state/region before continuing."
        )
        setLoading(false)
        return
      }

      const normalizedEmail = formData.email.trim().toLowerCase()

      if (formData.role == "patient") {
        // Validate PIN
        if (!formData.pin || formData.pin.length !== 6) {
          showErrorToast("Invalid PIN", "Please enter a 6-digit PIN")
          setLoading(false)
          return
        }

        if (formData.pin !== formData.confirmPin) {
          showErrorToast("PINs don't match", "Please make sure both PINs are the same")
          setLoading(false)
          return
        }

        if (!formData.verificationToken) {
          showErrorToast("Verification required", "Please verify your email or phone number first")
          setLoading(false)
          return
        }

        // Validate all required fields
        if (!formData.firstName?.trim()) {
          showErrorToast("First name is required", "Please enter your first name")
          setLoading(false)
          return
        }

        if (!formData.lastName?.trim()) {
          showErrorToast("Last name is required", "Please enter your last name")
          setLoading(false)
          return
        }

        if (!formData.phone?.trim()) {
          showErrorToast("Phone number is required", "Please enter your phone number")
          setLoading(false)
          return
        }

        if (!formData.dateOfBirth) {
          showErrorToast("Date of birth is required", "Please select your date of birth")
          setLoading(false)
          return
        }

        if (!formData.gender) {
          showErrorToast("Gender is required", "Please select your gender")
          setLoading(false)
          return
        }

        if (!formData.address?.trim()) {
          showErrorToast("Address is required", "Please enter your address")
          setLoading(false)
          return
        }

        if (!formData.city?.trim() && !formData.state?.trim()) {
          showErrorToast("City/State is required", "Please select your city or state")
          setLoading(false)
          return
        }

        if (!formData.country?.trim()) {
          showErrorToast("Country is required", "Please select your country")
          setLoading(false)
          return
        }

        console.log("Starting patient signup with PIN...");
        
        // Format phone number with country code if needed
        let phoneNumber = formData.phone?.trim()
        if (phoneNumber && !phoneNumber.startsWith("+")) {
          // Assume Ghana country code if not present
          phoneNumber = `+233${phoneNumber.replace(/^0/, "")}`
        }

        // Format date of birth - ensure it's a valid date string
        let dateOfBirthStr: string
        try {
          if (typeof formData.dateOfBirth === 'string') {
            // If it's already a string, try to parse and format it
            const date = new Date(formData.dateOfBirth)
            if (isNaN(date.getTime())) {
              showErrorToast("Invalid date format", "Please select a valid date of birth")
              setLoading(false)
              return
            }
            dateOfBirthStr = format(date, "yyyy-MM-dd")
          } else {
            dateOfBirthStr = format(new Date(formData.dateOfBirth), "yyyy-MM-dd")
          }
        } catch (dateError) {
          console.error("Date formatting error:", dateError)
          showErrorToast("Invalid date format", "Please select a valid date of birth")
          setLoading(false)
          return
        }

        let result: any;
        try {
          const signupPayload: any = {
            verificationToken: formData.verificationToken,
            pin: formData.pin,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: dateOfBirthStr,
            // Backend expects uppercase enum: "MALE" | "FEMALE" | "OTHER"
            gender: formData.gender.toUpperCase(),
            phoneNumber: phoneNumber || "",
            address: formData.address,
            city: formData.city,
            // Fallback to city if state was not set separately
            state: formData.state || formData.city,
            country: formData.country,
          }

          // Add optional fields only if they have values
          if (formData.nhisNumber) {
            signupPayload.nhisNumber = formData.nhisNumber
          }
          if (formData.identificationNumber) {
            signupPayload.identificationNumber = formData.identificationNumber
          }
          if (formData.allergies && formData.allergies.length > 0) {
            signupPayload.allergies = formData.allergies
          }
          if (formData.medicalConditions && formData.medicalConditions.length > 0) {
            signupPayload.medicalConditions = formData.medicalConditions
          }
          if (formData.hospitalId) {
            signupPayload.hospitalId = formData.hospitalId
          }

          console.log("Sending signup payload:", { ...signupPayload, pin: "****" }) // Don't log PIN
          
          result = await api.auth.signupPatient(signupPayload)

          // The backend wraps the response in { success, message, data: { token, user, ... } }
          const responseData = result.data.data || result.data;
          
          console.log("Signup response received:", {
            hasToken: !!responseData.token,
            hasUser: !!responseData.user,
            responseKeys: Object.keys(result.data),
            fullResponse: result.data,
            responseData: responseData
          });

          if (responseData.token) {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, responseData.token)
            console.log("✅ Token saved to localStorage:", responseData.token.substring(0, 20) + "...")
            console.log("✅ Token verification - localStorage now has:", !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN))
          } else {
            console.error("❌ No token received in signup response:", result.data)
            showErrorToast("Signup failed", "No authentication token received from server")
            setLoading(false)
            return
          }
        } catch (signupError: any) {
          console.error("❌ Signup error:", {
            message: signupError?.message,
            response: signupError?.response?.data,
            status: signupError?.response?.status,
            error: signupError
          });
          
          // Extract error message from response
          const errorMessage = signupError?.response?.data?.message || 
                              signupError?.message || 
                              "Failed to create account. Please check all fields and try again."
          
          showErrorToast("Signup failed", errorMessage)
          setLoading(false)
          return
        }

        // Store user data from signup response for navigation
        // Use responseData which handles both wrapped and unwrapped responses
        const responseData = result.data.data || result.data;
        const responseMessage = result.data.message || "Your account has been created successfully";
        
        if (responseData.user) {
          const userData = {
            id: responseData.user.id,
            email: responseData.user.email,
            role: responseData.user.role,
            profile: {
              id: responseData.user.profile?.id || "",
              firstName: responseData.user.profile?.firstName || formData.firstName,
              lastName: responseData.user.profile?.lastName || formData.lastName,
              role: responseData.user.role,
              dateOfBirth: formData.dateOfBirth,
              gender: formData.gender,
              phoneNumber: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              country: formData.country,
              isActive: true,
              isApproved: responseData.user.profile?.isApproved ?? true,
              approvalStatus: responseData.user.profile?.isApproved ? "approved" : "pending",
            } as any
          };
          console.log("Storing user data after signup:", userData);
          useUserStore.setState({ user: userData });
          console.log("User data stored. Current store state:", useUserStore.getState());
        } else {
          console.error("No user data in signup response:", result.data);
        }

        console.log("Setting step to welcome, current step will be:", steps.length - 1);
        setCurrentStep(steps.length - 1)

        showSuccessToast(responseMessage)
        
        // Double-check token is saved before moving to welcome step
        const verifyToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!verifyToken) {
          console.error("❌ CRITICAL: Token was not saved! This should not happen.");
          showErrorToast("Authentication error", "Token was not saved. Please try again.");
          setLoading(false);
          return;
        }
        console.log("✅ Token verified before welcome step");
      } else if (formData.role == "hospital_admin") {
        const result = await api.auth.signupHospitalAdmin({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: normalizedEmail,
          password: formData.password,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          identificationNumber: formData.identificationNumber,
          role: formData.role.toUpperCase() || "HOSPITAL_ADMIN",
          phoneNumber: formData.phone || null,
          dateOfBirth: formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : null,
          gender: formData.gender.toUpperCase() || null,
          hospitalName: formData.hospitalName || null,
          hospitalEmail: formData.hospitalEmail || null,
          hospitalPhone: formData.hospitalPhone || null,
          hospitalAddress: formData.hospitalAddress || null,
          hospitalState: formData.hospitalState || null,
          hospitalCountry: formData.hospitalCountry || null,
          hospitalRegistrationNumber: formData.hospitalRegistrationNumber || null,
          hospitalLicenseNumber: formData.hospitalLicenseNumber || null,
          documents: formData.uploadedDocuments,
          hospitalId: formData.hospitalId || null,
        })

        // The backend wraps the response in { success, message, data: { token, user, ... } }
        const hospitalAdminResponseData = result.data.data || result.data;
        
        if (hospitalAdminResponseData.token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, hospitalAdminResponseData.token)
          console.log("✅ Hospital admin token saved");
        } else {
          console.error("❌ No token in hospital admin response:", result.data);
        }

        const onboardingResult = hospitalAdminResponseData

        const message = !onboardingResult.isApproved
          ? "Profile created successfully! Your account is pending approval."
          : "Welcome! Your profile has been completed successfully."

        showSuccessToast(message)
        setCurrentStep(steps.length - 1)
      } else if (formData.role == "doctor") {
        // Validate PIN for doctors
        if (!formData.pin || formData.pin.length !== 6) {
          showErrorToast("Invalid PIN", "Please enter a 6-digit PIN")
          setLoading(false)
          return
        }

        if (formData.pin !== formData.confirmPin) {
          showErrorToast("PINs don't match", "Please make sure both PINs are the same")
          setLoading(false)
          return
        }

        if (!formData.verificationToken) {
          showErrorToast("Verification required", "Please verify your email or phone number first")
          setLoading(false)
          return
        }

        // Format phone number with country code if needed
        let phoneNumber = formData.phone?.trim()
        if (phoneNumber && !phoneNumber.startsWith("+")) {
          phoneNumber = `+233${phoneNumber.replace(/^0/, "")}`
        }

        // Format date of birth
        let dateOfBirthStr: string
        try {
          if (typeof formData.dateOfBirth === 'string') {
            const date = new Date(formData.dateOfBirth)
            if (isNaN(date.getTime())) {
              showErrorToast("Invalid date format", "Please select a valid date of birth")
              setLoading(false)
              return
            }
            dateOfBirthStr = format(date, "yyyy-MM-dd")
          } else {
            dateOfBirthStr = format(new Date(formData.dateOfBirth), "yyyy-MM-dd")
          }
        } catch (dateError) {
          console.error("Date formatting error:", dateError)
          showErrorToast("Invalid date format", "Please select a valid date of birth")
          setLoading(false)
          return
        }

        let result: any;
        try {
          const signupPayload: any = {
            verificationToken: formData.verificationToken,
            pin: formData.pin,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: dateOfBirthStr,
            gender: formData.gender.toUpperCase(),
            phoneNumber: phoneNumber || "",
            address: formData.address,
            city: formData.city,
            state: formData.state || formData.city,
            country: formData.country,
            specialty: formData.specialty || "",
            licenseNumber: formData.licenseNumber || "",
          }

          if (formData.hospitalId) {
            signupPayload.hospitalId = formData.hospitalId
          }
          if (formData.bio) {
            signupPayload.bio = formData.bio
          }
          if (formData.uploadedDocuments && formData.uploadedDocuments.length > 0) {
            signupPayload.documents = formData.uploadedDocuments
          }

          console.log("Sending doctor signup payload:", { ...signupPayload, pin: "****" })
          
          result = await api.auth.signupDoctor(signupPayload)

          const responseData = result.data.data || result.data;
          
          if (responseData.token) {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, responseData.token)
            console.log("✅ Doctor token saved")
          } else {
            console.error("❌ No token in doctor response:", result.data)
            showErrorToast("Signup failed", "No authentication token received from server")
            setLoading(false)
            return
          }

          if (responseData.user) {
            const userData = {
              id: responseData.user.id,
              email: responseData.user.email,
              role: responseData.user.role,
              profile: {
                id: responseData.user.profile?.id || "",
                firstName: responseData.user.profile?.firstName || formData.firstName,
                lastName: responseData.user.profile?.lastName || formData.lastName,
                role: responseData.user.role,
                isActive: true,
                isApproved: responseData.user.profile?.isApproved ?? false,
                approvalStatus: responseData.user.profile?.isApproved ? "approved" : "pending",
              } as any
            };
            useUserStore.setState({ user: userData });
          }

          const responseMessage = result.data.message || "Doctor account created successfully. Your account is pending approval."
          showSuccessToast(responseMessage)
          setCurrentStep(steps.length - 1)
        } catch (signupError: any) {
          console.error("❌ Doctor signup error:", {
            message: signupError?.message,
            response: signupError?.response?.data,
            status: signupError?.response?.status,
          });
          
          const errorMessage = signupError?.response?.data?.message || 
                              signupError?.message || 
                              "Failed to create account. Please check all fields and try again."
          
          showErrorToast("Signup failed", errorMessage)
          setLoading(false)
          return
        }

        // The backend wraps the response in { success, message, data: { token, user, ... } }
        const doctorResponseData = result.data.data || result.data;
        
        if (doctorResponseData.token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, doctorResponseData.token)
          console.log("✅ Doctor token saved");
        } else {
          console.error("❌ No token in doctor response:", result.data);
        }

        const onboardingResult = doctorResponseData

        const message = !onboardingResult.isApproved
          ? "Profile created successfully! Your account is pending approval."
          : "Welcome! Your profile has been completed successfully."

        showSuccessToast(message)
        setCurrentStep(steps.length - 1)
      }
    } catch (error: any) {
      console.error("Onboarding completion error:", error)
      
      // Extract detailed error message
      let errorMessage = "Failed to complete onboarding"
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      // Show user-friendly error
      showErrorToast("Signup failed", errorMessage)
      
      // Log full error for debugging
      console.error("Full error details:", {
        error,
        response: error?.response,
        data: error?.response?.data,
        status: error?.response?.status
      })
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: string | [] | Hospital) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Safety check: ensure we have valid steps and current step
  if (!steps || steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading signup form...</p>
        </div>
      </div>
    )
  }

  const CurrentStepComponent = steps[currentStep]?.component
  const currentStepData = steps[currentStep]

  // Safety check: ensure current step exists
  if (!currentStepData || !CurrentStepComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Error loading step. Please try again.</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-screen min-h-screen flex overflow-y-hidden">
      {/* Left side - Image with logo */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute top-12 left-12 z-10">
          <img src="/logo-white.svg" alt="BawaHealth Logo" className="h-16 w-auto" />
        </div>
        <img
          src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Medical Professional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 bg-white overflow-y-scroll">
        <div className="w-full max-w-2xl">
          {/* Header with back button and progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-primary -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <ProgressIndicator current={currentStep} total={steps.length} />
            </div>

            {/* Step title and subtitle */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-black mb-2">{currentStepData?.title}</h1>
              <p className="text-black/60">{currentStepData?.subtitle}</p>
            </motion.div>
          </div>

          {/* Content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {CurrentStepComponent && currentStepData && (
                  <>
                    {currentStepData.id === "otp-verification" ? (
                      <CurrentStepComponent
                        email={getOtpIdentifiers().email}
                        phoneNumber={getOtpIdentifiers().phoneNumber}
                        onOtpVerified={handleOtpVerified}
                        onResendOtp={handleResendOtp}
                        loading={loading}
                      />
                    ) : (
                      <CurrentStepComponent
                        formData={formData}
                        updateFormData={(fieldOrData: any, value?: string) => {
                          if (typeof fieldOrData === "object" && fieldOrData !== null) {
                            // Object update
                            setFormData((prev) => ({ ...prev, ...fieldOrData }))
                          } else if (typeof fieldOrData === "string" && value !== undefined) {
                            // Field-value update
                            setFormData((prev) => ({ ...prev, [fieldOrData]: value }))
                          }
                        }}
                        onInputChange={updateFormData}
                        loading={loading}
                        hospitals={shouldFetchHospitals ? (Array.isArray(hospitals) ? hospitals : []) : []}
                        hospitalsLoading={shouldFetchHospitals ? hospitalsLoading : false}
                        onNext={handleNext}
                        onBack={handleBack}
                      />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Continue Button - show for all steps except welcome and OTP verification */}
            {currentStep < steps.length - 1 && currentStepData?.id !== "otp-verification" && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className="w-full"
                >
                  {loading ? (
                    <LoaderIcon />
                  ) : (
                    <>
                      {currentStep === steps.length - 2 ? "Create account" : "Continue"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

ProgressiveOnboarding.displayName = "ProgressiveOnboarding"
