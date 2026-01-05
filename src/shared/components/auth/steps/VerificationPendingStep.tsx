import { memo } from 'react';
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VerificationPendingStepProps {
  formData: any;
  onNext: () => void;
}

export const VerificationPendingStep = memo(({ formData, onNext }: VerificationPendingStepProps) => {
  const getApprovalInfo = () => {
    switch (formData.role) {
      case 'patient':
        return {
          title: 'Account Created Successfully!',
          message: 'Your patient account is ready to use immediately.',
          waitTime: 'No waiting required',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950/20',
          borderColor: 'border-green-200 dark:border-green-800',
          status: 'approved'
        };
      case 'doctor':
        return {
          title: 'Verification in Progress',
          message: 'Your medical credentials are being reviewed by our verification team.',
          waitTime: '1-3 business days',
          icon: Clock,
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-50 dark:bg-amber-950/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          status: 'pending'
        };
      case 'hospital_admin':
        return {
          title: 'Institution Verification Required',
          message: 'Your hospital credentials and authorization are being verified.',
          waitTime: '2-5 business days',
          icon: Shield,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          status: 'pending'
        };
      default:
        return {
          title: 'Account Under Review',
          message: 'Your account is being reviewed by our team.',
          waitTime: '1-2 business days',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-50 dark:bg-amber-950/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          status: 'pending'
        };
    }
  };

  const approvalInfo = getApprovalInfo();
  const Icon = approvalInfo.icon;

  const verificationSteps = formData.role === 'doctor' ? [
    { step: 'Medical License Verification', status: 'in_progress' },
    { step: 'Professional Credentials Review', status: 'pending' },
    { step: 'Background Check', status: 'pending' },
    { step: 'Account Approval', status: 'pending' }
  ] : formData.role === 'hospital_admin' ? [
    { step: 'Hospital License Verification', status: 'in_progress' },
    { step: 'Authorization Documentation', status: 'pending' },
    { step: 'Institutional Compliance Check', status: 'pending' },
    { step: 'Account Approval', status: 'pending' }
  ] : [
    { step: 'Account Created', status: 'completed' },
    { step: 'Ready to Use', status: 'completed' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div
          className={`inline-flex items-center justify-center w-20 h-20 ${approvalInfo.bgColor} rounded-full`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Icon className={`w-10 h-10 ${approvalInfo.iconColor}`} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-foreground">{approvalInfo.title}</h2>
          <p className="text-muted-foreground mt-2">{approvalInfo.message}</p>
        </motion.div>
      </div>

      <Card className={`p-6 ${approvalInfo.bgColor} border ${approvalInfo.borderColor}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Verification Process</h3>
            <span className="text-sm text-muted-foreground">
              Expected time: {approvalInfo.waitTime}
            </span>
          </div>
          
          <div className="space-y-3">
            {verificationSteps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : step.status === 'in_progress'
                    ? 'bg-amber-500 text-white'
                    : 'bg-muted border-2 border-muted-foreground'
                }`}>
                  {step.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                  {step.status === 'in_progress' && <Clock className="w-4 h-4" />}
                  {step.status === 'pending' && <div className="w-2 h-2 bg-muted-foreground rounded-full" />}
                </div>
                <span className={`text-sm ${
                  step.status === 'completed' 
                    ? 'text-green-700 dark:text-green-300 font-medium' 
                    : step.status === 'in_progress'
                    ? 'text-amber-700 dark:text-amber-300 font-medium'
                    : 'text-muted-foreground'
                }`}>
                  {step.step}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {approvalInfo.status === 'pending' && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Email Notification
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                We'll send you an email at <strong>{formData.email}</strong> once your 
                verification is complete. Please check your spam folder if you don't see it.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        <h4 className="font-medium text-foreground">What happens next?</h4>
        <div className="space-y-2">
          {formData.role === 'patient' ? (
            <>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Start browsing available doctors and book appointments
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Complete your health profile for better care
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Our team will verify your submitted documents
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  You'll receive an email confirmation once approved
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Access to full platform features upon approval
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full bg-gradient-active text-white hover:opacity-90 h-12 rounded-xl text-base font-medium"
      >
        {formData.role === 'patient' ? 'Start Using BawaHealth' : 'Complete Setup'}
      </Button>
    </div>
  );
});

VerificationPendingStep.displayName = 'VerificationPendingStep';