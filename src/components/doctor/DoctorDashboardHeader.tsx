import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/stores/userStore"
import { api } from "@/lib/api"
import { Icon } from "@iconify/react"

export function DoctorDashboardHeader() {
  const user = useUserStore((state) => state.user)

  return (
    <header className="sticky top-0 z-50 bg-white py-5 max-w-7xl mx-auto">
      <div className="px-4 md:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="w-32" />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full gap-2 bg-muted py-6 px-3 border-gray-300 text-black">
            <Icon icon="ri:question-line" className="w-4 h-4" />
            <span>Help & Support</span>
          </Button>
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profile.profilePicture} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user?.profile.firstName?.[0]}
              {user?.profile.lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="hidden sm:block">
            <p className="font-semibold text-foreground">
              Dr. {user?.profile.firstName} {user?.profile.lastName}
            </p>
            <p className="text-sm text-muted-foreground">Patient</p>
            {user?.profile.hospital && <div className="flex items-center gap-1 mt-0.5">
              <Icon icon="rivet-icons:link" className="w-3 h-3 text-primary" />
              <span className="text-sm text-primary">{user.profile.hospital.name}</span>
            </div>}
          </div>

          <Button
            onClick={async () => {
              api.auth.signout()
            }}
            variant="outline"
            size={"sm"}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
