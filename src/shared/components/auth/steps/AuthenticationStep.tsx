import { memo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon } from "@iconify/react"

interface AuthenticationStepProps {
  formData: any
  updateFormData: (field: string, value: string) => void
  onNext?: () => void
  onBack?: () => void
}

export const AuthenticationStep = memo(({ formData, updateFormData }: AuthenticationStepProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const isPatient = formData.role === "patient"
  const isDoctor = formData.role === "doctor"
  const usesOtpFlow = isPatient || isDoctor

  const passwordStrength = getPasswordStrength(formData.password || "")

  function getPasswordStrength(password: string) {
    if (!password) return { score: 0, label: "", color: "" }

    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
    const colors = ["text-red-500", "text-orange-500", "text-yellow-500", "text-blue-500", "text-green-500"]

    return {
      score: (score / 5) * 100,
      label: labels[score - 1] || "Very Weak",
      color: colors[score - 1] || "text-red-500",
    }
  }

  // For patients and doctors, show phone/email (OTP flow) - phone is default
  if (usesOtpFlow) {
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
              <Icon icon="mdi:shield-check-outline" className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-sm text-blue-900">Secure Signup</p>
                <p className="text-sm text-blue-700">
                  We'll send you a verification code to confirm your email or phone number. 
                  You'll then create a 6-digit PIN for quick access.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email Address {isDoctor ? "(Optional)" : ""}
            </Label>
            <div className="relative">
              <Icon icon="material-symbols:mail-outline" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email || ""}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
              Phone Number {isDoctor ? "(Default)" : "(Optional)"}
            </Label>
            <div className="relative">
              <Icon icon="mdi:phone-outline" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+233XXXXXXXXX"
                value={formData.phone || ""}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500">
              {isDoctor 
                ? "Phone number is preferred. You can also use email for verification."
                : "You can use either email or phone number for verification"}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // For doctors/admins, show email + password
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email (Serves as Username)
          </Label>
          <div className="relative">
            <Icon icon="material-symbols:mail-outline" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email || ""}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-900">
            Password
          </Label>
          <div className="relative">
            <Icon icon="solar:lock-linear" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password || ""}
              onChange={(e) => updateFormData("password", e.target.value)}
              className="pl-10 pr-10 "
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Icon icon="weui:eyes-on-outlined" className="w-5 h-5 text-gray-400" /> : <Icon icon="weui:eyes-off-outlined" className="w-5 h-5 text-gray-400" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
            Confirm Password
          </Label>
          <div className="relative">
            <Icon icon="solar:lock-linear" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword || ""}
              onChange={(e) => updateFormData("confirmPassword", e.target.value)}
              className="pl-10 pr-10 "
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <Icon icon="weui:eyes-on-outlined" className="w-5 h-5 text-gray-400" /> : <Icon icon="weui:eyes-off-outlined" className="w-5 h-5 text-gray-400" />}
            </Button>
          </div>
        </div>

        {formData.password && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm mb-3">
              Password strength:{" "}
              <span className={`font-semibold ${passwordStrength.color}`}>{passwordStrength.label}</span>
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>One number</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>One uppercase letter</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>One special character</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span>One lowercase letter</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-4 mt-6">
          <div className="flex items-start space-x-3">
            <Icon icon="stash:shield-duotone" className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-sm text-gray-900">Account Security</p>
              <p className="text-sm text-gray-600">Your account will be protected with industry-standard encryption</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

AuthenticationStep.displayName = "AuthenticationStep"
