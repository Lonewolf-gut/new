import { useEffect, useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn, formatDate, formatDuration, formatTime, formatTimeSlotDisplay } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { usePatientQuery } from "@/hooks/usePatientQuery"
import { usePatientDataStore } from "@/stores/patientDataStore"
import { Link } from "react-router"
import { ROUTES } from "@/utils/constants"
import { format } from "date-fns"
import type { Doctor, TimeSlot } from "@/types/interfaces"
import BookAppointmentDialog from "./BookAppointmentDialog"


export default function PatientAppointments() {
    const [activeTab, setActiveTab] = useState("upcoming")
    const [currentView, setCurrentView] = useState<"book" | "appointments">("book")
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedAppointmentData, setSelectedAppointmentData] = useState<{
        doctor: Partial<Doctor>,
        timeSlot: Partial<TimeSlot>
    } | null>(null)

    usePatientQuery();
    const appointments = usePatientDataStore((state) => state.appointments) || []
    const slots = usePatientDataStore((state) => state.slots) || []

    const upcomingCount = useMemo(() => (appointments || []).filter((app) => app.status === "CONFIRMED").length, [appointments])
    const appointmentsHistory = useMemo(() => (appointments || []).filter((app) => app.status === "COMPLETED" || app.status == "CANCELLED"), [appointments])
    const filteredUpcomingAppointments = useMemo(() => {
        return (appointments || []).filter((app) => app.status === "CONFIRMED" || app.status === "PENDING" || app.status === "SCHEDULED");
    }, [appointments]);

    useEffect(() => {
        if (!selectedDate) {
            return;
        }
        const localDateStr = format(selectedDate, "yyyy-MM-dd");
        usePatientDataStore.getState().fetchSlots({
            date: localDateStr,
        })
    }, [selectedDate])

    // Filter slots
    const filteredSlots = useMemo(() => {
        if (!slots || slots.length === 0) return [];
        if (selectedDoctor === "all") {
            return slots;
        }
        return slots.filter(slot => slot?.doctor?.id === selectedDoctor);
    }, [slots, selectedDoctor]);

    const handleTimeSlotClick = (doctor: Partial<Doctor>, slot: any) => {
        const formattedTime = formatTimeSlotDisplay(slot);

        const appointmentData = {
            doctor,
            timeSlot: {
                id: slot.id!,
                time: formattedTime,
                duration: slot.duration!,
                startTime: slot.startTime!,
                endTime: slot.endTime!,
                date: slot.date!,
            }
        };
        setSelectedTimeSlot(slot.id!);
        setSelectedAppointmentData({
            doctor,
            timeSlot: appointmentData.timeSlot,
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {currentView === "book" ? (
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Book Your Appointment</h2>
                    <p className="text-sm text-muted-foreground">Select available date and time</p>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Your Appointments</h2>
                    <p className="text-sm text-muted-foreground">A summary of your upcoming and past appointments.</p>
                </div>
            )}

            {/* Appointment Summary Dialog */}
            <BookAppointmentDialog
                open={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                doctor={selectedAppointmentData?.doctor!}
                timeSlot={selectedAppointmentData?.timeSlot!}
            />

            {currentView === "book" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/*  Doctor selection and time slots */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Doctor Filter */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 max-w-md">
                                <label className="text-sm font-medium text-foreground mb-2 block">Filter by Doctor (Optional)</label>
                                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All Doctors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Doctors</SelectItem>
                                        {(slots || []).map((slot) => (
                                            slot?.doctor?.id ? (
                                                <SelectItem key={slot.doctor.id} value={slot.doctor.id}>
                                                    {slot.doctor.firstName} {slot.doctor.lastName}
                                                </SelectItem>
                                            ) : null
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Link to={ROUTES.PATIENT.DOCTORS}>
                                <Button
                                    variant="link"
                                    className="text-primary mt-6"
                                >
                                    View Available Doctors
                                </Button>
                            </Link>
                        </div>

                        {/* Doctors and Time Slots */}
                        <div className="space-y-8">
                            {filteredSlots.length > 0 ? filteredSlots.map((slot) => {
                                if (!slot?.doctor?.id) return null;
                                return (
                                <div key={slot.doctor.id} className="space-y-4">
                                    {/* Doctor Info */}
                                    <div className="flex items-center gap-3">
                                        <Icon icon="solar:user-circle-outline" className="w-6 h-6 text-foreground" />
                                        <div>
                                            <h3 className="font-semibold text-foreground text-lg">{slot.doctor.firstName} {slot.doctor.lastName}</h3>
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 mt-1">
                                                {slot.doctor.specialty}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="flex flex-wrap gap-3">
                                        {(slot.timeSlots || []).map((timeSlot, index) => {
                                            const formattedTime = formatTimeSlotDisplay(timeSlot);

                                            return (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    className={cn(
                                                        "flex flex-col items-start h-auto py-3 px-4 rounded-lg border-0 shadow-sm",
                                                        selectedTimeSlot === timeSlot.id && "border border-primary bg-primary/10",
                                                    )}
                                                    onClick={() => handleTimeSlotClick(slot.doctor, timeSlot)}
                                                >
                                                    <span className="font-semibold text-foreground">
                                                        {formattedTime}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                                                        <Icon icon="mingcute:time-line" className="w-3 h-3" />
                                                        <span>{formatDuration(timeSlot.duration)}</span>
                                                    </div>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                                );
                            }) : <div className="text-sm text-muted-foreground/70 flex items-center gap-2 flex-col col-span-2 mt-14">
                                <Icon icon="mynaui:calendar-x" className="w-12 h-12 inline-block" />
                                No available doctors or time slots found for the selected date.
                            </div>
                            }
                        </div>

                        {/* View Appointments Button */}
                        <Button
                            variant="outline"
                            className="w-full text-primary border-primary hover:bg-primary/5 bg-transparent"
                            onClick={() => setCurrentView("appointments")}
                        >
                            View Appointments
                        </Button>
                    </div>

                    {/* Right side - Calendar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Calendar */}
                        <div className="w-fit relative p-3">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => {
                                    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                                    const today = new Date()
                                    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

                                    return day < startOfToday
                                }}
                                className="rounded-md"
                                classNames={{
                                    months: "flex flex-col",
                                    month_caption: "flex justify-center items-center h-10 relative mb-4",
                                    caption_label: "text-base font-semibold",
                                    nav: "flex items-center gap-1",
                                    table: "w-full border-collapse",
                                    weekdays: "flex",
                                    weekday: "text-muted-foreground w-9 font-normal text-xs",
                                    week: "flex w-full mt-2",
                                    day: "h-9 w-9 text-center text-sm p-0 relative",
                                    today: "bg-accent text-accent-foreground",
                                    selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-full",
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Appointments Tabs */}
            {currentView == "appointments" && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full max-w-2xl grid-cols-2 h-auto p-1 bg-muted/30">
                        <TabsTrigger
                            value="upcoming"
                            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                        >
                            <Icon icon="solar:calendar-outline" className="w-4 h-4" />
                            <span className="font-medium">Upcoming ({upcomingCount})</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-muted-foreground"
                        >
                            <Icon icon="ic:outline-history" className="w-4 h-4" />
                            <span className="font-medium">History ({appointmentsHistory.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Appointments List */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-foreground">Upcoming Appointments</h3>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                        {upcomingCount} scheduled
                                    </Badge>
                                </div>

                                {/* Appointment Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredUpcomingAppointments.length > 0 ? (
                                        filteredUpcomingAppointments.map((appointment) => (
                                            <Card key={appointment.id} className="shadow-none border border-border bg-gray-50 p-0">
                                                <CardContent className="p-6 space-y-4">
                                                    {/* Status Badge */}
                                                    <div>
                                                        {!["CONFIRMED", "COMPLETED", "CANCELLED", "SCHEDULED"].includes(appointment.status) && (
                                                            <Badge
                                                                className={cn(
                                                                    appointment.status === "PENDING"
                                                                        ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                                                        : appointment.status == "SCHEDULED" || appointment.status == "CONFIRMED" ? "bg-green-100 text-green-500" : "bg-red-50 text-red-500",
                                                                    "border-0 font-medium"
                                                                )}
                                                            >
                                                                {appointment.status}
                                                            </Badge>
                                                        )}

                                                    </div>

                                                    {/* Doctor Info */}
                                                    {appointment.doctor && (
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="w-12 h-12">
                                                                <AvatarImage
                                                                    src={appointment.doctor.profilePicture || "/placeholder.svg"}
                                                                    alt={(appointment.doctor.firstName || "") + " " + (appointment.doctor.lastName || "")}
                                                                />
                                                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                                    {appointment.doctor.firstName?.[0] || ""}{appointment.doctor.lastName?.[0] || ""}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h4 className="font-semibold text-foreground">
                                                                    {appointment.doctor.firstName} {appointment.doctor.lastName}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Appointment Details */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-foreground">
                                                            <Icon icon="solar:calendar-outline" className="w-4 h-4 text-muted-foreground" />
                                                            <span>{formatDate(appointment.appointmentDate)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-foreground">
                                                            <Icon icon="mingcute:time-line" className="w-4 h-4 text-muted-foreground" />
                                                            <span>{formatTime(appointment.appointmentDate)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-foreground">
                                                            <Icon icon="majesticons:video-line" className="w-4 h-4 text-muted-foreground" />
                                                            <span>{appointment.consultationType}</span>
                                                        </div>
                                                    </div>

                                                    {/* Booked Date */}
                                                    <p className="text-xs text-muted-foreground">Booked on {formatDate(appointment.createdAt)}</p>

                                                    {/* Join Meeting Button */}
                                                    <Button
                                                        className={cn(
                                                            "w-full gap-2",
                                                            appointment.status === "PENDING"
                                                                ? "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                                                                : "bg-primary text-primary-foreground hover:bg-primary/90",
                                                        )}
                                                        disabled={appointment.meetingLink === null}
                                                        onClick={() => {
                                                            window.open(appointment.meetingLink)
                                                        }}
                                                    >
                                                        <span>Join Meeting</span>
                                                        <Icon icon="majesticons:video-line" className="w-4 h-4" />
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-sm text-muted-foreground flex items-center gap-2 flex-col col-span-2">
                                            <Icon icon="mynaui:calendar-x" className="w-12 h-12 inline-block" />
                                            No upcoming appointments found.
                                        </div>
                                    )}
                                </div>

                                <Button variant="outline" className="w-full bg-transparent" onClick={() => setCurrentView("book")}>
                                    Back to Appointment Booking
                                </Button>
                            </div>

                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-8">Appointment History</h3>

                            {/* Table Header */}
                            <div className="grid grid-cols-4 gap-4 mb-6 px-4">
                                <div className="text-sm font-medium text-muted-foreground">Name</div>
                                <div className="text-sm font-medium text-muted-foreground">Date</div>
                                <div className="text-sm font-medium text-muted-foreground">Time</div>
                                <div className="text-sm font-medium text-muted-foreground">Duration</div>
                            </div>

                            {/* Table Rows */}
                            <div className="space-y-6">
                                {appointmentsHistory.length > 0 ? appointmentsHistory.map((appointment) => (
                                    <div key={appointment.id} className="grid grid-cols-4 gap-4 items-center px-4">
                                        {/* Name Column */}
                                        {appointment.doctor && (
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-14 h-14">
                                                    <AvatarImage
                                                        src={appointment.doctor.profilePicture || "/placeholder.svg"}
                                                        alt={(appointment.doctor.firstName || "") + " " + (appointment.doctor.lastName || "")}
                                                    />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                        {appointment.doctor.firstName?.[0] || ""}{appointment.doctor.lastName?.[0] || ""}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="font-semibold text-foreground">
                                                        {appointment.doctor.firstName} {appointment.doctor.lastName}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Date Column */}
                                        <div className="text-foreground">{formatDate(appointment.appointmentDate)}</div>

                                        {/* Time Column */}
                                        <div className="text-foreground">{formatTime(appointment.appointmentDate)}</div>

                                        {/* Duration Column */}
                                        <div className="text-foreground">{formatDuration(appointment.duration)}</div>
                                    </div>
                                )) : <div className="text-sm text-muted-foreground/70 flex items-center gap-2 flex-col col-span-2 mt-14">
                                    <Icon icon="ic:outline-history" className="w-12 h-12 inline-block" />
                                    No past appointments found.
                                </div>
                                }
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}