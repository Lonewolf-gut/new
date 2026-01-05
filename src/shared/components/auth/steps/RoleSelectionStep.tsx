import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"

interface RoleSelectionStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function RoleSelectionStep({ formData, updateFormData }: RoleSelectionStepProps) {
  const roles = [
    {
      id: "patient" as const,
      title: "Patient",
      description: "Book appointments and manage your health records",
      icon: "medical-icon:i-outpatient",

    },
    {
      id: "doctor" as const,
      title: "Doctor",
      description: "Provide consultations and manage patient care",
      icon: "maki:doctor",

    },
    {
      id: "hospital_admin" as const,
      title: "Hospital Admin",
      description: "Manage hospital operations and staff",
      icon: "grommet-icons:user-admin",
    },
  ]
  const handleRoleSelect = (roleId: string) => {
    updateFormData({ role: roleId });
  };

  return (
    <div className="space-y-4">
      {roles.map((role) => {
        const isSelected = formData.role === role.id

        return (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className={cn(
              "w-full flex items-start gap-0 rounded-xl border transition-all text-left overflow-hidden rounded-r-xl",
              isSelected ? "border-primary bg-primary/10" : "border-gray-300 hover:border-gray-400 bg-gray-100",
            )}
          >
            {/* Icon section */}
            <div
              className={cn(
                "flex items-center justify-center w-28 py-10 rounded-l-xl",
                isSelected ? "bg-primary" : "bg-gray-400",
              )}
            >
              <Icon icon={role.icon} className="w-8 h-8 text-white" />
            </div>

            {/* Content section */}
            <div className={cn("flex-1 p-4")}>
              <h3 className="text-lg font-semibold text-black mb-2">{role.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{role.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
