import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import { api } from "@/lib/api";
import { ROUTES, STORAGE_KEYS } from "@/utils/constants";
import { Icon } from "@iconify/react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

const signInSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .min(6, "Phone number must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  pin: z
    .string()
    .length(6, "PIN must be exactly 6 digits")
    .regex(/^\d+$/, "PIN must contain only numbers")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
}).refine((data) => (data.email || data.phoneNumber) && (data.pin || data.password), {
  message: "Either email or phone number is required, and either PIN or password is required",
});

type SignInFormData = z.infer<typeof signInSchema>;

interface SignInProps {
  onSwitchToSignUp: () => void;
}

export const SignIn = memo(({ onSwitchToSignUp }: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"pin" | "password">("pin"); // Default to PIN for patients/doctors

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const watchedEmail = watch("email");

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      showErrorToast("Google sign in failed", "No credentials received");
      return;
    }

    setGoogleLoading(true);
    try {
      const response = await api.auth.googleSignIn({ 
        credential: credentialResponse.credential,
        role: "PATIENT" 
      });
      
      showSuccessToast(
        "Google sign in successful",
        "Redirecting to your dashboard..."
      );

      setTimeout(() => {
        const role = response.data.user.role;
        const role_dashboard =
          role === "PATIENT"
            ? ROUTES.PATIENT.DASHBOARD
            : role === "DOCTOR"
              ? ROUTES.DOCTOR.DASHBOARD
              : role === "HOSPITAL_ADMIN"
                ? ROUTES.HOSPITAL_ADMIN
                : "/";
        window.location.href = role_dashboard;
      }, 1000);
    } catch (err) {
      showErrorToast(
        (err as Error).message || "Google sign in failed",
        "Please try again"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    showErrorToast("Google sign in failed", "Please try again");
  };

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      // Build signin payload - prefer phone for PIN auth, email for password auth
      const signinPayload: { email?: string; phoneNumber?: string; pin?: string; password?: string } = {};
      
      if (authMethod === "pin") {
        // For PIN auth, prefer phone number
        if (data.phoneNumber && data.phoneNumber.trim()) {
          let phone = data.phoneNumber.trim();
          if (!phone.startsWith("+")) {
            phone = `+233${phone.replace(/^0/, "")}`;
          }
          signinPayload.phoneNumber = phone;
        } else if (data.email && data.email.trim()) {
          signinPayload.email = data.email.trim();
        }
        if (data.pin) {
          signinPayload.pin = data.pin;
        }
      } else {
        // For password auth, use email
        if (data.email && data.email.trim()) {
          signinPayload.email = data.email.trim();
        }
        if (data.password) {
          signinPayload.password = data.password;
        }
      }
      
      const response = await api.auth.signin(signinPayload);

      console.log("Sign in response:", response.data);

      // Handle different response structures
      const responseData = response.data?.data || response.data;
      const token = responseData?.token || response.data?.token;
      const user = responseData?.user || response.data?.user;

      // Ensure auth token is persisted for protected routes
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        console.log("✅ Token saved to localStorage");
      } else {
        console.error("❌ No token in response:", response.data);
        showErrorToast("Sign in failed", "No authentication token received");
        setLoading(false);
        return;
      }

      if (!user) {
        console.error("❌ No user data in response:", response.data);
        showErrorToast("Sign in failed", "User data not received");
        setLoading(false);
        return;
      }

      showSuccessToast(
        "Sign in successful",
        "Redirecting to your dashboard..."
      );

      setTimeout(() => {
        const role = user.role;
        console.log("User role:", role);
        
        const role_dashboard =
          role === "PATIENT"
            ? ROUTES.PATIENT.DASHBOARD
            : role === "DOCTOR"
              ? ROUTES.DOCTOR.DASHBOARD
              : role === "HOSPITAL_ADMIN"
                ? ROUTES.HOSPITAL_ADMIN
                : "/";
        
        console.log("Redirecting to:", role_dashboard);
        window.location.href = role_dashboard;
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "An unexpected error occurred";
      
      // If error says PIN is required, switch to PIN mode
      if (errorMessage.toLowerCase().includes("pin is required") || errorMessage.toLowerCase().includes("pin required")) {
        setAuthMethod("pin");
        showErrorToast("PIN required", "Please enter your 6-digit PIN");
      } else {
        showErrorToast(errorMessage, "Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!watchedEmail?.trim()) {
      await trigger("email");
      return;
    }

    try {
      showSuccessToast("Reset email sent", "Please check your inbox");
    } catch (error: any) {
      showErrorToast((error as Error).message || "An unexpected error occurred", "Please try again");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Image and Logo */}
      <div className="relative hidden lg:flex bg-dark-primary items-center justify-center overflow-hidden">
        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          <img
            src="/logo-white.svg"
            alt="BawaHealth Logo"
            className="h-20 w-auto"
          />
        </div>

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Medical Professional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome Back!
            </h1>
            <p className="text-base text-muted-foreground">
              Sign in to your BawaHealth account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            {/* Phone Number (for PIN auth) */}
            {authMethod === "pin" && (
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-foreground"
                >
                  Phone Number (Default)
                </Label>
                <div className="relative">
                  <Icon
                    icon="mdi:phone-outline"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...register("phoneNumber")}
                    placeholder="+233XXXXXXXXX"
                    className="pl-11"
                    autoComplete="tel"
                    autoFocus
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            )}

            {/* Email (for password auth, or optional for PIN auth) */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email {authMethod === "pin" ? "(Optional)" : ""}
              </Label>
              <div className="relative">
                <Icon
                  icon="material-symbols:mail-outline"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
                />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder={authMethod === "pin" ? "Or enter your email" : "Enter your email"}
                  className="pl-11"
                  autoComplete="email"
                  autoFocus={authMethod === "password"}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Auth Method Toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Sign in as:
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={authMethod === "pin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAuthMethod("pin")}
                  className="text-xs"
                >
                  Patient/Doctor (PIN)
                </Button>
                <Button
                  type="button"
                  variant={authMethod === "password" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAuthMethod("password")}
                  className="text-xs"
                >
                  Admin (Password)
                </Button>
              </div>
            </div>

            {/* PIN Input (for patients) */}
            {authMethod === "pin" && (
              <div className="space-y-2">
                <Label
                  htmlFor="pin"
                  className="text-sm font-medium text-foreground"
                >
                  PIN (6 digits)
                </Label>
                <div className="relative">
                  <Icon
                    icon="solar:lock-linear"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  />
                  <Input
                    id="pin"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    {...register("pin")}
                    placeholder="000000"
                    className="pl-11 text-center text-2xl tracking-widest font-mono"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      e.target.value = value;
                      register("pin").onChange(e);
                    }}
                    autoComplete="off"
                  />
                </div>
                {errors.pin && (
                  <p className="text-xs text-destructive">
                    {errors.pin.message}
                  </p>
                )}
              </div>
            )}

            {/* Password Input (for doctors/admins) */}
            {authMethod === "password" && (
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Icon
                    icon="solar:lock-linear"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className={`pl-11 pr-11
                      }`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <Icon icon="weui:eyes-off-outlined" className="w-5 h-5" />
                    ) : (
                      <Icon icon="weui:eyes-on-outlined" className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            {/* Forgot Password (only show for password mode) */}
            {authMethod === "password" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="w-full"
            >
              {loading ? (
                <Icon icon="ri:loader-5-fill" className="animate-spin text-white" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <button
                onClick={onSwitchToSignUp}
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border h-4 my-4" />

          {/* Social Login */}
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Or Continue with
            </p>
            <div className="flex justify-center">
              {googleLoading ? (
                <div className="flex flex-col items-center gap-2 p-4">
                  <Icon icon="ri:loader-5-fill" className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-muted-foreground text-sm">Signing in...</span>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

SignIn.displayName = "SimpleSignIn";
