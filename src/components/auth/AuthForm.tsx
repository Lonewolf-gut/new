import { useState } from "react";
import { ProgressiveOnboarding } from "@/shared/components/auth/ProgressiveOnboarding";
import { SignIn } from "@/shared/components/auth/SignIn";
import { OnboardingErrorBoundary } from "@/shared/components/auth//OnboardingErrorBoundary";

interface AuthFormProps {
  onBack: () => void;
  onSuccess: () => void;
  defaultMode?: "signin" | "signup";
}

export function AuthForm({
  onBack,
  onSuccess,
  defaultMode = "signin",
}: AuthFormProps) {
  const [currentView, setCurrentView] = useState<"signin" | "signup">(defaultMode);

  if (currentView === "signin") {
    return (
      <SignIn
        onSwitchToSignUp={() => setCurrentView("signup")}
      />
    );
  }

  return (
    <OnboardingErrorBoundary onReset={() => setCurrentView("signin")}>
      <ProgressiveOnboarding
        onBack={onBack}
        onSuccess={onSuccess}
      />
    </OnboardingErrorBoundary>
  );
}