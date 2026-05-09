import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  // If it doesn't contain numbers, it's likely a string like "Morning", return as is
  if (!/\d/.test(timeStr)) return timeStr;

  // Extract hours, minutes, and potential AM/PM
  const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i);
  if (!match) return timeStr;

  let [_, hoursStr, minutesStr, ampm] = match;
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || "00";
  ampm = ampm ? ampm.toUpperCase() : "";

  // Handle 24-hour formats and hallucinated "14:00 PM" formats
  if (hours > 12) {
    hours -= 12;
    ampm = "PM";
  } else if (hours === 0) {
    hours = 12;
    ampm = "AM";
  } else if (hours === 12 && !ampm) {
    ampm = "PM";
  } else if (!ampm) {
    ampm = "AM";
  }

  // Format nicely (e.g. "2:00 PM" instead of "02:00 PM")
  return `${hours}:${minutes} ${ampm}`;
}
