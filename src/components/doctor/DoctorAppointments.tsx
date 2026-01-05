import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useDoctorDataStore } from "@/stores/doctorDataStore";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { useDoctorQuery } from "@/hooks/useDoctorQuery";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Badge } from "../ui/badge";
import PatientDetailsDialog from "./DoctorPatientDialog";

const statusTabs = [
    { id: "pending", label: "Pending", icon: "mingcute:time-line" },
    { id: "scheduled", label: "Scheduled", icon: "solar:calendar-linear" },
    { id: "confirmed", label: "Confirmed", icon: "mdi:check-bold" },
    { id: "completed", label: "Completed", icon: "rivet-icons:inbox-complete" },
    {
        id: "cancelled",
        label: "Cancelled",
        icon: "material-symbols:cancel-outline-rounded",
    },
];

export default function AppointmentManagement() {
    const [activeTab, setActiveTab] = useState<string>("pending");
    const appointments = useDoctorDataStore((state) => state.appointments);
    const filteredAppointments = appointments?.filter(
        (apt) => apt.status.toLowerCase() === activeTab
    );
    const { refetch } = useDoctorQuery().appointments;
    const [selectedPatient, setSelectedPatient] = useState<string | null>(
        null
    );
    const [dialogOpen, setDialogOpen] = useState(false);

    const statCards = [
        {
            label: "Today",
            value:
                appointments?.filter(
                    (apt) =>
                        new Date(apt.appointmentDate).toDateString() ===
                        new Date().toDateString()
                ).length || 0,
            icon: "solar:calendar-outline",
            color: "text-primary",
        },
        {
            label: "Scheduled",
            value:
                appointments?.filter(
                    (apt) => new Date(apt.appointmentDate) > new Date()
                ).length || 0,
            icon: "material-symbols:event-upcoming-outline-rounded",
            color: "text-[#ED9200]",
        },
        {
            label: "Completed",
            value:
                appointments?.filter((apt) => apt.status === "COMPLETED").length || 0,
            icon: "charm:tick",
            color: "text-[#43A047]",
        },
        {
            label: "Cancelled",
            value:
                appointments?.filter((apt) => apt.status === "CANCELLED").length || 0,
            icon: "material-symbols:cancel-outline-rounded",
            color: "text-[#FF0000]",
        },
    ];
    const updateStatusMutation = useMutation({
        mutationFn: async ({
            appointmentId,
            status,
        }: {
            appointmentId: string;
            status: string;
        }) => {
            const response = await api.appointments.updateAppointmentStatus(
                appointmentId,
                { status }
            );
            return response.data;
        },
        onSuccess: async () => {
            await refetch();
            showSuccessToast("Success!", "Appointment status updated successfully.");
        },
        onError: (error) => {
            showErrorToast(
                error.message || "Error",
                "Failed to update appointment status."
            );
        },
    });
    console.log("Filtered Appointments:", filteredAppointments, selectedPatient);
    return (
        <div className="w-full mx-auto">
            {updateStatusMutation.isPending && (
                <div className="fixed left-0 top-0 w-full h-full bg-white/50 z-50 flex items-center justify-center">
                    <LoadingSpinner text="Please wait" />
                </div>
            )}

            {selectedPatient && (
                <PatientDetailsDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    patientId={selectedPatient}
                />
            )}
            <h1 className="text-2xl font-bold mb-8 text-foreground">
                Appointment Management
            </h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => {
                    return (
                        <Card className="shadow-sm border border-border p-0" key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-4xl font-bold text-primary mb-2">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {stat.label}
                                        </p>
                                    </div>
                                    <div className="">
                                        <Icon
                                            icon={stat.icon}
                                            className={`w-8 h-8 ${stat.color}`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Status Filter Tabs */}
            <Tabs
                className="space-y-4"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <TabsList className="w-full justify-start bg-[#F9F9F9] rounded-none h-auto p-0 gap-6 mb-8">
                    {statusTabs.map((tab, index) => (
                        <TabsTrigger
                            key={index}
                            value={tab.id}
                            className="flex items-center gap-2 bg-transparent data-[state=active]:bg-primary data-[state=active]:shadow-none rounded-lg border-transparent py-3 text-muted-foreground data-[state=active]:text-white"
                        >
                            <Icon icon={tab.icon} className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Appointment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments &&
                    filteredAppointments?.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="flex flex-col p-6 bg-secondary rounded-2xl"
                        >
                            {/* Status badge */}
                            <div className="mb-4">
                                {["CONFIRMED", "COMPLETED", "CANCELLED", "SCHEDULED"].includes(appointment.status) && (
                                    <Badge
                                        className={cn(
                                            appointment.status === "PENDING"
                                                ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                                : appointment.status == "SCHEDULED" || appointment.status == "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-700",
                                            "border-0 font-medium"
                                        )}
                                    >
                                        {appointment.status}
                                    </Badge>
                                )}

                            </div>
                            {/* Patient Info */}
                            <div className="flex items-center gap-4 mb-3">
                                <img
                                    src={appointment.patient.profilePicture || "/placeholder.svg"}
                                    alt={appointment.patient.firstName}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <p
                                        className="font-semibold text-foreground hover:underline cursor-pointer"
                                        onClick={() => {
                                            setSelectedPatient(appointment.patient.id);
                                            setDialogOpen(true);
                                        }}
                                    >
                                        {appointment.patient.firstName}{" "}
                                        {appointment.patient.lastName}
                                    </p>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Icon
                                        icon="solar:calendar-outline"
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span>
                                        {formatDate(new Date(appointment.appointmentDate))}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Icon
                                        icon="mingcute:time-line"
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span>
                                        {formatTime(new Date(appointment.appointmentDate))}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Icon
                                        icon="majesticons:video-line"
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span>{appointment.consultationType}</span>
                                </div>
                                <div className="text-muted-foreground">
                                    <span className="text-sm text-muted-foreground">
                                        Symptoms:{" "}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {appointment.symptoms}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 flex-1 flex flex-col justify-end">
                                {(appointment.status === "SCHEDULED" || appointment.status === "PENDING") && (
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-600"
                                            onClick={() =>
                                                updateStatusMutation.mutate({
                                                    appointmentId: appointment.id,
                                                    status: "CONFIRMED",
                                                })
                                            }
                                            disabled={updateStatusMutation.isPending}
                                        >
                                            <Icon icon="mingcute:check-2-fill" className="w-4 h-4 mr-2" />
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-600"
                                            onClick={() =>
                                                updateStatusMutation.mutate({
                                                    appointmentId: appointment.id,
                                                    status: "CANCELLED",
                                                })
                                            }
                                            disabled={updateStatusMutation.isPending}
                                        >
                                            <Icon
                                                icon="mdi:cancel-bold"
                                                className="w-4 h-4 mr-2"
                                            />
                                            Cancel
                                        </Button>
                                    </div>
                                )}

                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                    disabled={appointment.status !== "CONFIRMED"}
                                    onClick={() => window.open(appointment.meetingLink)}
                                >
                                    Join meeting
                                    <Icon icon="tabler:message" className="w-4 h-4 mr-2" />
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Empty State */}
            {appointments && filteredAppointments?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        No appointments found for this status.
                    </p>
                </div>
            )}
            {!appointments && (
                <div className="text-center py-12">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
}
