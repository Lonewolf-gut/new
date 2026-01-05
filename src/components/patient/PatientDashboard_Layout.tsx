import { memo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { PatientDashboardHeader } from "@/components/patient/PatientDashboardHeader"
import { User } from "iconoir-react"
import { ResponsiveContainer } from "@/components/ResponsiveContainer"
import { Icon } from "@iconify/react"
import { usePatientDataStore } from "@/stores/patientDataStore"
import { useUserStore } from "@/stores/userStore"
import { usePatientQuery } from "@/hooks/usePatientQuery"
import { Outlet, useNavigate, useLocation } from "react-router"
import { ROUTES } from "@/utils/constants"

export const PatientDashboardLayout = memo(() => {
    const user = useUserStore((state) => state.user);
    const stat = usePatientDataStore((state) => state.stat) || {
        totalAppointments: 0,
        upcomingAppointments: 0,
        activePrescriptions: 0,
        recordedVitals: 0
    };
    usePatientQuery();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on current URL path
    const getActiveTab = () => {
        const path = location.pathname;

        if (path === ROUTES.PATIENT.DASHBOARD || path === '/patient') {
            return "appointments";
        } else if (path === ROUTES.PATIENT.DOCTORS) {
            return "doctors";
        } else if (path === ROUTES.PATIENT.HEALTHRECORDS) {
            return "health-records";
        } else if (path === ROUTES.PATIENT.BILLS) {
            return "bills";
        } else if (path === ROUTES.PATIENT.PROFILE) {
            return "profile";
        } else if (path === ROUTES.PATIENT.FEEDBACK) {
            return "feedback";
        }
        return "appointments";
    };

    const activeTab = getActiveTab();

    const handleTabChange = (value: string) => {
        switch (value) {
            case "appointments":
                navigate(ROUTES.PATIENT.DASHBOARD);
                break;
            case "doctors":
                navigate(ROUTES.PATIENT.DOCTORS);
                break;
            case "health-records":
                navigate(ROUTES.PATIENT.HEALTHRECORDS);
                break;
            case "bills":
                navigate(ROUTES.PATIENT.BILLS);
                break;
            case "profile":
                navigate(ROUTES.PATIENT.PROFILE);
                break;
            default:
                navigate(ROUTES.PATIENT.DASHBOARD);
        }
    };

    return (
        <div className="min-h-screen bg-background font-inter">
            <PatientDashboardHeader />

            <ResponsiveContainer>
                <div className="mb-8 mt-8">
                    <h2 className="text-3xl font-bold text-primary mb-3">Welcome Back, {user?.profile?.firstName || "User"}!</h2>
                    <p className="text-base text-muted-foreground max-w-3xl">
                        Manage your health appointments, access medical records, and connect with healthcare professionals
                        seamlessly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="shadow-sm border border-border p-0">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-primary mb-2">{stat.totalAppointments}</p>
                                    <p className="text-sm font-bold text-foreground">Total Appointments</p>
                                </div>
                                <div className="">
                                    <Icon icon="solar:calendar-outline" className="w-8 h-8 text-[#43A047]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-border p-0">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-primary mb-2">{stat.upcomingAppointments}</p>
                                    <p className="text-sm font-bold text-foreground">Upcoming Appointments</p>
                                </div>
                                <div className="">
                                    <Icon icon="maki:doctor" className="w-8 h-8 text-[#8A38F5]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-border p-0">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-primary mb-2">{stat.activePrescriptions}</p>
                                    <p className="text-sm font-bold text-foreground">Active Prescriptions</p>
                                </div>
                                <div className="">
                                    <Icon icon="mdi:drugs" className="w-8 h-8 text-[#ED9200]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-border p-0">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-primary mb-2">{stat.recordedVitals}</p>
                                    <p className="text-sm font-bold text-foreground">Recorded Vitals</p>
                                </div>
                                <div className="">
                                    <Icon icon="material-symbols:vitals-rounded" className="w-8 h-8 text-[#FF0000]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs className="space-y-4" value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="w-full justify-start bg-[#F9F9F9] rounded-none h-auto p-0 gap-6">
                        <TabsTrigger
                            value="appointments"
                            className="flex items-center gap-2 bg-transparent data-[state=active]:bg-primary data-[state=active]:shadow-none rounded-lg border-transparent py-3 text-muted-foreground data-[state=active]:text-white"
                        >
                            <Icon icon="solar:calendar-outline" className="w-5 h-5" />
                            <span>Appointments</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="doctors"
                            className="flex items-center gap-2 bg-transparent data-[state=active]:bg-primary data-[state=active]:shadow-none rounded-lg border-transparent py-3 text-muted-foreground data-[state=active]:text-white"
                        >
                            <Icon icon="maki:doctor" className="w-5 h-5" />
                            <span>Doctors</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="health-records"
                            className="flex items-center gap-2 bg-transparent data-[state=active]:bg-primary data-[state=active]:shadow-none rounded-lg border-transparent py-3 text-muted-foreground data-[state=active]:text-white"
                        >
                            <Icon icon="solar:heart-outline" className="w-5 h-5" />
                            <span>Health Records</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="bills"
                            className="flex items-center gap-2 bg-transparent data-[state=active]:bg-primary data-[state=active]:shadow-none rounded-lg border-transparent py-3 text-muted-foreground data-[state=active]:text-white"
                        >
                            <Icon icon="mage:dollar" className="w-5 h-5" />
                            <span>Bills & Payments</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="profile"
                            className="flex items-center gap-2 bg-transparent data-[state=active]:bg-primary data-[state=active]:shadow-none rounded-lg border-transparent py-3 text-muted-foreground data-[state=active]:text-white"
                        >
                            <User className="w-5 h-5" />
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="feedback"
                            className="flex items-center gap-2 bg-transparent data-[state=active]:bg-primary data-[state=active]:shadow-none rounded-lg border-transparent py-3 text-muted-foreground data-[state=active]:text-white"
                        >
                            <Icon icon="material-symbols:feedback-outline" className="w-5 h-5" />
                            <span>Feedback</span>
                        </TabsTrigger>
                    </TabsList>

                    <Outlet />
                </Tabs>
            </ResponsiveContainer>
        </div>
    )
})

PatientDashboardLayout.displayName = "PatientDashboardLayout"

export default PatientDashboardLayout