import { memo, useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon } from "@iconify/react"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { api } from "@/lib/api"
import LoaderIcon from "@/components/LoaderIcon"

interface OtpVerificationStepProps {
  email?: string
  phoneNumber?: string
  onOtpVerified: (verificationToken: string) => void
  onResendOtp: () => Promise<void>
  loading?: boolean
}

export const OtpVerificationStep = memo(({ 
  email, 
  phoneNumber, 
  onOtpVerified, 
  onResendOtp,
  loading: parentLoading = false 
}: OtpVerificationStepProps) => {
  const [otp, setOtp] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      showErrorToast("Invalid OTP", "Please enter the 6-digit code")
      return
    }

    setVerifying(true)
    try {
      const verifyPayload = {
        email,
        phoneNumber,
        otp: otp.trim(),
      }
      
      console.log("Verifying OTP with:", {
        email,
        phoneNumber,
        otpLength: otp.trim().length,
        otpValue: otp.trim(),
      })
      
      const response = await api.auth.verifyOtp(verifyPayload)

      const verificationToken = response.data?.data?.verificationToken || response.data?.verificationToken
      
      if (!verificationToken) {
        showErrorToast("Verification failed", "Invalid OTP or verification token not received")
        return
      }

      showSuccessToast("OTP verified successfully", "You can now complete your registration")
      onOtpVerified(verificationToken)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to verify OTP"
      showErrorToast("Verification failed", errorMessage)
      setOtp("") // Clear OTP on error
    } finally {
      setVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      showErrorToast("Please wait", `You can resend OTP in ${resendCooldown} seconds`)
      return
    }

    setResending(true)
    try {
      await onResendOtp()
      showSuccessToast(
        "OTP resent", 
        phoneNumber 
          ? `Please check your phone (${phoneNumber})` 
          : email 
            ? `Please check your email (${email})` 
            : "Please check your email or phone"
      )
      setOtp("") // Clear current OTP
      
      // Set cooldown timer (60 seconds)
      setResendCooldown(60)
      
      // Clear any existing interval
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current)
      }
      
      cooldownIntervalRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownIntervalRef.current) {
              clearInterval(cooldownIntervalRef.current)
              cooldownIntervalRef.current = null
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.message || "Failed to resend OTP"
      showErrorToast("Resend failed", errorMessage)
    } finally {
      setResending(false)
    }
  }

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6)
    setOtp(digitsOnly)
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current)
        cooldownIntervalRef.current = null
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-5">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon icon="mdi:information-outline" className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-sm text-blue-900">
                Check your {phoneNumber ? "phone" : email ? "email" : "contact"}
              </p>
              <p className="text-sm text-blue-700">
                We've sent a 6-digit verification code to{" "}
                <span className="font-medium">
                  {phoneNumber || email || "your contact"}
                </span>
                {phoneNumber && (
                  <span className="text-xs text-blue-600 block mt-1">
                    📱 Sent via SMS
                  </span>
                )}
                {!phoneNumber && email && (
                  <span className="text-xs text-blue-600 block mt-1">
                    📧 Sent via Email
                  </span>
                )}
              </p>
              {import.meta.env.DEV && (
                <p className="text-xs text-blue-600 mt-2">
                  💡 Development mode: Check the backend console for the OTP code
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otp" className="text-sm font-medium text-gray-900">
            Enter Verification Code
          </Label>
          <div className="relative">
            <Icon icon="mdi:lock-outline" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className="pl-10 text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              disabled={verifying || parentLoading}
            />
          </div>
          <p className="text-xs text-gray-500">Enter the 6-digit code sent to you</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResendOtp}
            disabled={resending || verifying || parentLoading || resendCooldown > 0}
            className="text-primary hover:text-primary/80 disabled:opacity-50"
          >
            {resending ? (
              <>
                <LoaderIcon className="w-4 h-4 mr-1" />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>

        <Button
          onClick={handleVerifyOtp}
          disabled={otp.length !== 6 || verifying || parentLoading}
          className="w-full"
        >
          {verifying ? (
            <>
              <LoaderIcon className="w-4 h-4 mr-2" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </Button>
      </div>
    </motion.div>
  )
})

OtpVerificationStep.displayName = "OtpVerificationStep"

