import { memo } from 'react';
import { motion } from "framer-motion";
import { RoleSpecificWelcome } from "./RoleSpecificWelcome";

interface WelcomeStepProps {
  formData: any;
  onNext?: () => void;
  authenticatedUser?: any;
}

export const WelcomeStep = memo(({ formData, onNext, authenticatedUser }: WelcomeStepProps) => {

  const handleViewDashboard = () => {
    if (onNext) {
      onNext();
    }
  };

  const user = authenticatedUser || formData;

  return (
    <motion.div
      className="min-h-[400px] flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <RoleSpecificWelcome
        user={user}
        onViewDashboard={handleViewDashboard}
      />
    </motion.div>
  );
});

WelcomeStep.displayName = 'WelcomeStep';