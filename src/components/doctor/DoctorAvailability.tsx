import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";
import { useDoctorDataStore } from "@/stores/doctorDataStore";
import { useDoctorQuery } from "@/hooks/useDoctorQuery";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { APPOINTMENT_DURATION_DEFAULT } from "@/utils/constants";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { TIME_SLOTS } from "@/lib/utils";
import type { TimeSlot } from "@/types/interfaces";

interface TimeSlotLocal {
    time: string;
    available: boolean;
    utcStartTime: Date;
    utcEndTime: Date;
}

interface DaySchedule {
    day: string;
    date: number;
    month: number;
    year: number;
    fullDate: Date; // Local date
    slots: TimeSlotLocal[];
}

const TIME_SLOTS_ARRAY = TIME_SLOTS.FIFTEEN_MIN;

export default function DoctorAvailability() {
    const [weekOffset, setWeekOffset] = useState(0);
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
    const [loadingSlots, setLoadingSlots] = useState<Set<string>>(new Set());
    const [userTimezone] = useState<string>(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const appointments = useDoctorDataStore((state) => state.appointments);
    const slots = useDoctorDataStore((state) => state.slots);
    const { refetch, isLoading: isInitialLoading } = useDoctorQuery().slots;
    const addSlot = useDoctorDataStore((state) => state.addSlot);
    const removeSlot = useDoctorDataStore((state) => state.removeSlot);

    useEffect(() => {
        const loadSlots = async () => {
            await refetch();
        };
        loadSlots();
    }, [weekOffset]);

    const convertLocalToUtcIso = (localDate: Date): string => {
        return localDate.toISOString();
    };

    const STAT_CARDS = [
        {
            label: "Today",
            value:
                appointments?.filter((app) => {
                    const appDate = new Date(app.appointmentDate);
                    const today = new Date();
                    return (
                        appDate.getFullYear() === today.getFullYear() &&
                        appDate.getMonth() === today.getMonth() &&
                        appDate.getDate() === today.getDate()
                    );
                }).length || 0,
            icon: "solar:calendar-outline",
            color: "text-primary",
        },
        {
            label: "Upcoming",
            value:
                appointments?.filter(
                    (app) => new Date(app.appointmentDate) > new Date()
                ).length || 0,
            icon: "material-symbols:event-upcoming-outline-rounded",
            color: "text-[#ED9200]",
        },
        {
            label: "Completed",
            value:
                appointments?.filter((app) => app.status === "COMPLETED").length || 0,
            icon: "charm:tick",
            color: "text-[#43A047]",
        },
        {
            label: "Cancelled",
            value:
                appointments?.filter((app) => app.status === "CANCELLED").length || 0,
            icon: "material-symbols:cancel-outline-rounded",
            color: "text-[#FF0000]",
        },
    ];

    /**
     * Check if a day is in the past (excluding today - using local time)
     */
    const isPastDay = (day: DaySchedule): boolean => {
        const today = new Date();

        const todayMidnight = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        const dayMidnight = new Date(day.year, day.month, day.date);

        return dayMidnight < todayMidnight;
    };

    /**
     * Check if a specific slot time is in the past (using local time)
     */
    const isPastSlot = (day: DaySchedule, time: string): boolean => {
        const now = new Date();
        const [hours, minutes] = time.split(":").map(Number);
        const slotDateTime = new Date(
            day.year,
            day.month,
            day.date,
            hours,
            minutes
        );

        return slotDateTime < now;
    };

    /**
     * Check if a slot exists in backend
     */
    const isSlotExists = (localDate: Date, localTime: string): boolean => {
        const [hours, minutes] = localTime.split(":").map(Number);

        const localDateTime = new Date(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate(),
            hours,
            minutes,
            0,
            0
        );

        const localUtcTimestamp = localDateTime.getTime();

        return slots.some((slot) => {
            const slotStartTime = new Date(slot.startTime);
            return slotStartTime.getTime() === localUtcTimestamp;
        });
    };

    /**
     * Check if a slot is available (exists and not booked)
     */
    const isSlotAvailable = (localDate: Date, localTime: string): boolean => {
        const [hours, minutes] = localTime.split(":").map(Number);

        const localDateTime = new Date(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate(),
            hours,
            minutes,
            0,
            0
        );

        // Convert to UTC timestamp for comparison
        const localUtcTimestamp = localDateTime.getTime();

        return slots.some((slot) => {
            const slotStartTime = new Date(slot.startTime);
            return (
                slotStartTime.getTime() === localUtcTimestamp && !slot.isBooked
            );
        });
    };

    const schedule = useMemo(() => {
        const today = new Date();

        // Find Monday of current week in local time
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(today.getFullYear(), today.getMonth(), diff);

        // Apply week offset
        const weekStart = new Date(monday);
        weekStart.setDate(weekStart.getDate() + weekOffset * 7);

        const days: DaySchedule[] = [];
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        for (let i = 0; i < 7; i++) {
            const localDate = new Date(weekStart);
            localDate.setDate(localDate.getDate() + i);

            // Generate slots for this day
            const daySlots = TIME_SLOTS_ARRAY.map((time) => {
                const [hours, minutes] = time.split(":").map(Number);

                // Create local datetime for this slot
                const localDateTime = new Date(
                    localDate.getFullYear(),
                    localDate.getMonth(),
                    localDate.getDate(),
                    hours,
                    minutes,
                    0,
                    0
                );

                // Calculate end time
                const localEndTime = new Date(
                    localDateTime.getTime() + APPOINTMENT_DURATION_DEFAULT * 60 * 1000
                );

                const exists = isSlotExists(localDate, time);
                const available = isSlotAvailable(localDate, time);

                return {
                    time,
                    available: exists ? available : true,
                    utcStartTime: localDateTime,
                    utcEndTime: localEndTime,
                };
            });

            days.push({
                day: dayNames[i],
                date: localDate.getDate(),
                month: localDate.getMonth(),
                year: localDate.getFullYear(),
                fullDate: localDate,
                slots: daySlots,
            });
        }

        return days;
    }, [weekOffset, slots, userTimezone]);

    /**
     * Find existing slot in backend (by comparing UTC timestamps)
     */
    const findExistingSlot = (localDateTime: Date): TimeSlot | null => {
        const localUtcTimestamp = localDateTime.getTime();

        return (
            slots.find((slot) => {
                const slotStartTime = new Date(slot.startTime);
                return slotStartTime.getTime() === localUtcTimestamp;
            }) || null
        );
    };

    const dateRangeText = useMemo(() => {
        if (schedule.length === 0) return "";
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const firstDay = schedule[0];
        const lastDay = schedule[6];
        const monthStr = monthNames[firstDay.month];
        const endMonthStr = monthNames[lastDay.month];

        if (firstDay.month === lastDay.month) {
            return `${monthStr} ${firstDay.date} - ${lastDay.date}, ${firstDay.year}`;
        } else {
            return `${monthStr} ${firstDay.date} - ${endMonthStr} ${lastDay.date}, ${firstDay.year}`;
        }
    }, [schedule]);

    const toggleExpanded = (dayIndex: number) => {
        const newExpanded = new Set(expandedDays);
        if (newExpanded.has(dayIndex)) {
            newExpanded.delete(dayIndex);
        } else {
            newExpanded.add(dayIndex);
        }
        setExpandedDays(newExpanded);
    };

    const toggleSlot = async (dayIndex: number, slotIndex: number) => {
        const slotKey = `${dayIndex}-${slotIndex}`;
        const day = schedule[dayIndex];
        const slot = day.slots[slotIndex];

        // Check if this slot is currently loading
        if (loadingSlots.has(slotKey)) return;

        // Prevent adding slots for past days OR past time slots (including today)
        if (isPastDay(day) || isPastSlot(day, slot.time)) {
            showErrorToast("Cannot add or modify slots for past dates or times");
            return;
        }

        try {
            setLoadingSlots((prev) => new Set(prev).add(slotKey));

            const existingSlot = findExistingSlot(slot.utcStartTime);

            if (existingSlot) {
                if (existingSlot.isBooked) {
                    showErrorToast("Cannot remove a booked slot");
                    return;
                }

                await removeSlot(existingSlot.id);
                showSuccessToast("Time slot removed successfully");
            } else {
                const localDateOnly = new Date(
                    day.year,
                    day.month,
                    day.date,
                    0,
                    0,
                    0,
                    0
                );

                // Send as ISO strings
                await addSlot({
                    date: convertLocalToUtcIso(localDateOnly),
                    startTime: convertLocalToUtcIso(slot.utcStartTime),
                    endTime: convertLocalToUtcIso(slot.utcEndTime),
                    duration: APPOINTMENT_DURATION_DEFAULT,
                });
                showSuccessToast("Success", "Time slot added successfully");
            }

            await refetch();
        } catch (error: any) {
            showErrorToast(
                error?.message || "This slot overlaps with an existing appointment"
            );
        } finally {
            setLoadingSlots((prev) => {
                const newSet = new Set(prev);
                newSet.delete(slotKey);
                return newSet;
            });
        }
    };

    const getSlotAppearance = (day: DaySchedule, time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const localDateTime = new Date(
            day.year,
            day.month,
            day.date,
            hours,
            minutes,
            0,
            0
        );

        const existingSlot = findExistingSlot(localDateTime);
        const slotKey = getSlotKey(day, time);
        const isLoading = loadingSlots.has(slotKey);

        const isPast = isPastDay(day) || isPastSlot(day, time);

        if (isLoading) {
            return "bg-gray-300 text-gray-600 border-2 border-gray-400 cursor-not-allowed opacity-70";
        }

        if (isPast) {
            return "bg-gray-300 text-gray-500 border-2 border-gray-400 cursor-not-allowed opacity-50";
        }

        if (existingSlot) {
            if (existingSlot.isBooked) {
                return "bg-yellow-500 text-yellow-900 border-2 border-yellow-600 cursor-not-allowed opacity-80";
            }
            return "bg-green-500 text-green-900 border-2 border-green-600 hover:border-green-700 cursor-pointer";
        }

        return "bg-muted text-foreground border-2 border-transparent hover:border-primary cursor-pointer";
    };

    // get unique key for a slot
    const getSlotKey = (day: DaySchedule, time: string): string => {
        const dayIndex = schedule.findIndex(
            (d) => d.date === day.date && d.month === day.month && d.year === day.year
        );
        const slotIndex = TIME_SLOTS_ARRAY.indexOf(time);
        return `${dayIndex}-${slotIndex}`;
    };

    // Check if slot should be disabled
    const isSlotDisabled = (day: DaySchedule, time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const localDateTime = new Date(
            day.year,
            day.month,
            day.date,
            hours,
            minutes,
            0,
            0
        );

        const existingSlot = findExistingSlot(localDateTime);
        const slotKey = getSlotKey(day, time);
        const isLoading = loadingSlots.has(slotKey);

        const isPast = isPastDay(day) || isPastSlot(day, time);

        return isLoading || existingSlot?.isBooked || isPast;
    };


    const isDayDisabledForExpansion = (day: DaySchedule): boolean => {
        return isPastDay(day);
    };

    const visibleSlots = 9;
    const moreSlots = TIME_SLOTS_ARRAY.length - visibleSlots;

    return (
        <div className="w-full bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Availability Management</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Timezone: {userTimezone} • All times displayed in your local time
                        </p>
                    </div>
                    {(isInitialLoading || loadingSlots.size > 0) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <LoadingSpinner size="sm" />
                            {loadingSlots.size > 0 ? "Updating slots..." : "Loading..."}
                        </div>
                    )}
                </div>

                {/* Rest of the component remains the same */}
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {STAT_CARDS.map((stat, idx) => {
                        return (
                            <Card className="shadow-sm border border-border p-0" key={idx}>
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

                {/* Date Range and Navigation */}
                <div className="p-4 bg-secondary">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-primary">
                            {dateRangeText}
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                                {weekOffset === 0
                                    ? "This Week"
                                    : `Week ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setWeekOffset((prev) => prev - 1)}
                                disabled={weekOffset === 0 || isInitialLoading}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setWeekOffset((prev) => prev + 1)}
                                disabled={isInitialLoading}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Weekly Schedule Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
                        {schedule.map((day, dayIndex) => (
                            <Card key={dayIndex} className="p-4 h-fit">
                                {/* Day Header */}
                                <div className="text-center mb-4 pb-4 border-b">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {day.day}
                                    </p>
                                    <p className="text-2xl font-bold">{day.date}</p>
                                    {isPastDay(day) && (
                                        <p className="text-xs text-red-500 mt-1">Past Date</p>
                                    )}
                                </div>

                                {/* Time Slots */}
                                <div className="space-y-2">
                                    {day.slots.slice(0, visibleSlots).map((slot, slotIndex) => {
                                        const slotKey = `${dayIndex}-${slotIndex}`;
                                        const slotAppearance = getSlotAppearance(day, slot.time);
                                        const isDisabled = isSlotDisabled(day, slot.time);
                                        const isLoading = loadingSlots.has(slotKey);

                                        return (
                                            <button
                                                key={slotIndex}
                                                onClick={() => toggleSlot(dayIndex, slotIndex)}
                                                disabled={isDisabled}
                                                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${slotAppearance} ${isDisabled ? "cursor-not-allowed" : ""}`}
                                            >
                                                {isLoading ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    slot.time
                                                )}
                                            </button>
                                        );
                                    })}

                                    {/* Expand Button*/}
                                    <button
                                        onClick={() => toggleExpanded(dayIndex)}
                                        disabled={isInitialLoading || isDayDisabledForExpansion(day)}
                                        className="w-full py-2 px-3 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                                    >
                                        +{moreSlots} more
                                        <ChevronRight
                                            className={`w-4 h-4 transition-transform ${expandedDays.has(dayIndex) ? "rotate-90" : ""}`}
                                        />
                                    </button>

                                    {/* Expanded Slots */}
                                    {expandedDays.has(dayIndex) && (
                                        <div className="space-y-2 pt-2 border-t">
                                            {day.slots.slice(visibleSlots).map((slot, slotIndex) => {
                                                const actualSlotIndex = visibleSlots + slotIndex;
                                                const slotKey = `${dayIndex}-${actualSlotIndex}`;
                                                const slotAppearance = getSlotAppearance(
                                                    day,
                                                    slot.time
                                                );
                                                const isDisabled = isSlotDisabled(day, slot.time);
                                                const isLoading = loadingSlots.has(slotKey);

                                                return (
                                                    <button
                                                        key={actualSlotIndex}
                                                        onClick={() =>
                                                            toggleSlot(dayIndex, actualSlotIndex)
                                                        }
                                                        disabled={isDisabled}
                                                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${slotAppearance} ${isDisabled ? "cursor-not-allowed" : ""}`}
                                                    >
                                                        {isLoading ? (
                                                            <LoadingSpinner size="sm" />
                                                        ) : (
                                                            slot.time
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-600"></div>
                            <span className="text-sm font-medium">Available Slot</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded border-2 border-yellow-600"></div>
                            <span className="text-sm font-medium">Booked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded border-2 border-gray-400"></div>
                            <span className="text-sm font-medium">Past Time</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded border-2 border-gray-400"></div>
                            <span className="text-sm font-medium">Updating</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}