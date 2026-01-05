"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RoleSpecificWelcomeProps {
  user: any
  onViewDashboard: () => void
}

export const RoleSpecificWelcome = memo(({ user, onViewDashboard }: RoleSpecificWelcomeProps) => {
  const getRoleContent = () => {
    switch (user.role) {
      case "patient":
        return {
          title: "Welcome to BawaHealth!",
          subtitle: "Your account has been created",
          ctaText: "Explore BawaHealth",
          status: "ready",
        }

      case "doctor":
        return {
          title:
            user.approval_status === "approved"
              ? `Welcome, Dr. ${user.last_name || user.first_name}!`
              : "Application Submitted Successfully",
          subtitle:
            user.approval_status === "approved"
              ? "Your medical practice is now live on BawaHealth"
              : "Your credentials are being verified by our team",
          ctaText: user.approval_status === "approved" ? "Access Dashboard" : "View Status",
          status: user.approval_status === "approved" ? "ready" : "pending",
        }

      case "hospital_admin":
        return {
          title:
            user.approval_status === "approved"
              ? "Welcome to BawaHealth Administration!"
              : "Hospital Registration Submitted",
          subtitle:
            user.approval_status === "approved"
              ? "Your hospital is now part of the BawaHealth network"
              : "Your hospital credentials are being verified",
          ctaText: user.approval_status === "approved" ? "Manage Hospital" : "View Status",
          status: user.approval_status === "approved" ? "ready" : "pending",
        }

      default:
        return {
          title: "Welcome to BawaHealth!",
          subtitle: "Your account has been created",
          ctaText: "Get Started",
          status: "ready",
        }
    }
  }

  const roleContent = getRoleContent()
  const isReady = roleContent.status === "ready"

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        {/* Illustration */}
        <img src="/welcome-illus.svg" alt="" className="mx-auto" />

        {/* Status Badge */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-full ${isReady
              ? "bg-primary/10 text-primary"
              : "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200"
              }`}
          >
            {isReady ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            <span className="text-sm font-medium">{isReady ? "Account active" : "Verification in Progress"}</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={onViewDashboard}
            className="w-full"
          >
            {roleContent.ctaText}
          </Button>
        </motion.div>

        {/* Additional Info for Pending Status */}
        {!isReady && (
          <motion.div
            className="pt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-muted-foreground">
              We'll send you an email notification once your verification is complete
            </p>
            <p className="text-xs text-muted-foreground">
              Expected processing time: {user.role === "doctor" ? "3-5" : "5-7"} business days
            </p>
          </motion.div>
        )}
      </motion.div>
    </div >
  )
})

RoleSpecificWelcome.displayName = "RoleSpecificWelcome"
