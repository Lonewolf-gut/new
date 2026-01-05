import { memo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer } from "@/components/ResponsiveContainer"
import { Icon } from "@iconify/react"
import { useUserStore } from "@/stores/userStore"
import { Outlet, useNavigate, useLocation } from "react-router"
import { ROUTES } from "@/utils/constants"
import { DoctorDashboardHeader } from "./DoctorDashboardHeader"

export const DoctorDashboardLayout = memo(() => {
    const user = useUserStore((state) => state.user);

    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
        const path = location.pathname;

        if (path === ROUTES.DOCTOR.DASHBOARD || path === '/doctor') {
            return "dashboard";
        } else if (path === ROUTES.DOCTOR.APPOINTMENTS) {
            return "appointments";
        } else if (path === ROUTES.DOCTOR.AVAILABILITY) {
            return "availability";
        } else if (path === ROUTES.DOCTOR.PATIENTS) {
            return "patients";
        } else if (path === ROUTES.DOCTOR.PROFILE) {
            return "profile";
        }
        return "dashboard";
    };

    const activeTab = getActiveTab();

    const handleTabChange = (value: string) => {
        switch (value) {
            case "dashboard":
                navigate(ROUTES.DOCTOR.DASHBOARD);
                break;
            case "appointments":
                navigate(ROUTES.DOCTOR.APPOINTMENTS);
                break;
            case "availability":
                navigate(ROUTES.DOCTOR.AVAILABILITY);
                break;
            case "patients":
                navigate(ROUTES.DOCTOR.PATIENTS);
                break;
            case "profile":
                navigate(ROUTES.DOCTOR.PROFILE);
                break;
            default:
                navigate(ROUTES.DOCTOR.DASHBOARD);
        }
    };

    return (
        <div className="min-h-screen bg-background font-inter">
            <DoctorDashboardHeader />

            <ResponsiveContainer>
                <div className="mb-8 mt-8">
                    <h2 className="text-3xl font-bold text-primary mb-3">Welcome Back, Dr. {user?.profile.lastName}!</h2>
                    <p className="text-base text-muted-foreground max-w-3xl">
                        Manage your appointments, review patient cases, and provide excellent healthcare services through your dashboard.
                    </p>
                </div>
                <Tabs className="space-y-4" value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="w-full justify-start bg-[#F9F9F9] rounded-none h-auto p-0 gap-6 mb-8">
                        {[
                            { value: "dashboard", label: "Dashboard", icon: "mdi:chart-line" },
                            { value: "appointments", label: "Appointments", icon: "solar:calendar-outline" },
                            { value: "availability", label: "Availability", icon: "mingcute:time-line" },
                            { value: "patients", label: "Patients", icon: "fluent:patient-20-regular" },
                            { value: "profile", label: "Profile", icon: "tabler:user" },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex items-center gap-2 bg-transparent data-[state=active]:bg-primary data-[state=active]:shadow-none rounded-lg border-transparent py-3 text-muted-foreground data-[state=active]:text-white"
                            >
                                <Icon icon={tab.icon} className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <Outlet />
                </Tabs>
            </ResponsiveContainer>
        </div>
    )
})

DoctorDashboardLayout.displayName = "DoctorDashboardLayout"

export default DoctorDashboardLayout