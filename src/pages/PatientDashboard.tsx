import { memo } from "react"
import { ResponsiveContainer } from "@/components/ResponsiveContainer"
import PatientAppointments from "@/components/patient/PatientAppointments"

export const PatientDashboard = memo(() => {
  return (
    <div className="min-h-screen bg-background">
      <ResponsiveContainer className="p-0!">
        <PatientAppointments />
      </ResponsiveContainer>
    </div>
  )
});

PatientDashboard.displayName = "PatientDashboard"

export default PatientDashboard
