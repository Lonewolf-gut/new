import type { TimeSlot } from "@/types/interfaces";
import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export interface TimeSlotConfig {
  startHour?: number;
  endHour?: number;
  duration?: number;
  includeEndTime?: boolean;
}

export const generateTimeSlots = (config: TimeSlotConfig = {}): string[] => {
  const {
    startHour = 9,
    endHour = 17,
    duration = 30,
    includeEndTime = true
  } = config;

  // Validate inputs
  if (startHour < 0 || startHour > 23) {
    throw new Error('Start hour must be between 0 and 23');
  }
  if (endHour < 0 || endHour > 23) {
    throw new Error('End hour must be between 0 and 23');
  }
  if (endHour <= startHour) {
    throw new Error('End hour must be greater than start hour');
  }
  if (duration <= 0 || duration > 60) {
    throw new Error('Duration must be between 1 and 60 minutes');
  }
  if (60 % duration !== 0) {
    throw new Error('Duration must evenly divide 60 minutes');
  }

  const slots: string[] = [];
  const totalMinutes = (endHour - startHour) * 60;
  const totalSlots = Math.floor(totalMinutes / duration);

  for (let i = 0; i < totalSlots; i++) {
    const totalMinutesFromStart = i * duration;
    const hours = startHour + Math.floor(totalMinutesFromStart / 60);
    const minutes = totalMinutesFromStart % 60;
    
    // Format time as "HH:MM"
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    slots.push(timeString);
  }

  // Add end time if requested and it doesn't already exist
  if (includeEndTime) {
    const endTimeString = `${endHour.toString().padStart(2, '0')}:00`;
    const lastSlot = slots[slots.length - 1];
    
    if (lastSlot !== endTimeString) {
      slots.push(endTimeString);
    }
  }

  return slots;
}

export const TIME_SLOTS = {
  FIFTEEN_MIN: generateTimeSlots({ duration: 15 }),
} as const;



export const toGhanaCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
};

export const formatTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'HH:mm');
};

export const formatDuration = (duration: string | number): string => {
    if (typeof duration === 'number') {
        return `${duration} min`;
    }
    return duration;
};


export const formatTimeSlotDisplay = (timeSlot: TimeSlot): string => {
    try {
        const startUtc = new Date(timeSlot.startTime);
        const endUtc = new Date(timeSlot.endTime);

        const startFormatted = format(startUtc, 'HH:mm');
        const endFormatted = format(endUtc, 'HH:mm');

        return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
        console.error('Error formatting time slot:', error);
        return 'Invalid time';
    }
};